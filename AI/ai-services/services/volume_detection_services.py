import os
import tempfile
import cv2
import numpy as np
import torch


def _load_midas():
    model = torch.hub.load("intel-isl/MiDaS", "DPT_Hybrid")
    model.eval()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
    return model, transforms.dpt_transform, device

_MODEL, _TRANSFORM, _DEVICE = _load_midas()


def detect_plate_circle(gray: np.ndarray):
    eq = cv2.equalizeHist(gray)
    blur = cv2.GaussianBlur(eq, (7,7), 0)
    circles = cv2.HoughCircles(
        blur, cv2.HOUGH_GRADIENT, dp=1.0,
        minDist=gray.shape[0]//2, param1=100, param2=50,
        minRadius=gray.shape[0]//8, maxRadius=gray.shape[0]//2
    )
    if circles is None:
        raise RuntimeError("Tabak bulunamadı.")
    x, y, r = max(np.round(circles[0]).astype(int), key=lambda c: c[2])
    return x, y, r

def remove_background(img: np.ndarray, x: int, y: int, r: int):
    mask = np.zeros(img.shape[:2], np.uint8)
    bgdModel = np.zeros((1,65), np.float64)
    fgdModel = np.zeros((1,65), np.float64)
    rect = (x-r, y-r, 2*r, 2*r)
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    mask_fg = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
    m = cv2.morphologyEx(mask_fg, cv2.MORPH_OPEN, kernel, iterations=2)
    mask_clean = cv2.morphologyEx(m, cv2.MORPH_CLOSE, kernel, iterations=2)
    return img * mask_clean[:,:,None], mask_clean

def refine_depth(depth: np.ndarray):
    lo, hi = np.percentile(depth, [2, 98])
    clipped = np.clip(depth, lo, hi)
    filt = cv2.medianBlur(clipped.astype(np.float32), 5)
    return (filt - filt.min()) / (np.ptp(filt) + 1e-6)

ASSUMED_PLATE_DIAMETER_CM = 25.0
ASSUMED_PLATE_HEIGHT_CM   = 2.0

def calibrate_scales(depth, mask, x, y, r):
    h, w = depth.shape
    Y, X = np.ogrid[:h, :w]
    plate = (X-x)**2 + (Y-y)**2 <= r**2
    bg_region = plate & (mask == 0)
    fg_region = plate & (mask == 1)
    base  = np.median(depth[bg_region])
    peak  = np.percentile(depth[fg_region], 90)
    delta = peak - base
    pixel_to_cm = ASSUMED_PLATE_DIAMETER_CM / (2 * r)
    depth_scale = ASSUMED_PLATE_HEIGHT_CM / delta if delta > 1e-6 else 1.0
    conf_mask = float(np.clip(fg_region.sum() / plate.sum(), 0, 1))
    return pixel_to_cm, depth_scale, conf_mask

def estimate_volume(depth, pixel_to_cm, depth_scale, mask):
    dn = refine_depth(depth)
    h_cm = dn * depth_scale
    h_food = np.clip(h_cm * mask, 0, None)
    base_vol = float(np.sum(h_food) * (pixel_to_cm ** 2))
    cf = 250.0 if base_vol < 15.0 else 1.0
    return base_vol * cf

def detect_volume_from_stream(file_stream, filename="tmp.jpg"):

    _, ext = os.path.splitext(filename)
    ext = ext or ".jpg"
    file_stream.seek(0)
    data = file_stream.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:

        img  = cv2.imread(tmp_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        x,y,r = detect_plate_circle(gray)
        fg, mask = remove_background(img, x,y,r)

   
        inp = _TRANSFORM(cv2.cvtColor(fg, cv2.COLOR_BGR2RGB)).to(_DEVICE)
        with torch.no_grad():
            pred  = _MODEL(inp)
            depth = torch.nn.functional.interpolate(
                pred.unsqueeze(1), size=gray.shape,
                mode='bicubic', align_corners=False
            ).squeeze().cpu().numpy()


        pixel_to_cm, depth_scale, conf_mask = calibrate_scales(depth, mask, x, y, r)
        volume = estimate_volume(depth, pixel_to_cm, depth_scale, mask)

        print(f"[DEBUG VOLUME] volume: {volume:.2f} cm³, conf_mask: {conf_mask:.2f}")
    finally:
        os.unlink(tmp_path)

    if conf_mask < 0.50:
        print(f"[DEBUG VOLUME] confidence_mask ({conf_mask:.2f}) < 0.50 → returning False")
        return None, False

    return volume, conf_mask

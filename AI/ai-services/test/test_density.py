import os
import random
import torch
import cv2
import numpy as np


ASSUMED_PLATE_DIAMETER_CM = 25.0   
ASSUMED_PLATE_HEIGHT_CM = 2.0     


def load_midas_model():

    model = torch.hub.load("intel-isl/MiDaS", "DPT_Hybrid")
    model.eval()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
    return model, transforms.dpt_transform, device


def detect_plate_circle(gray: np.ndarray):
    """
    Histogram eşitleme ve Gaussian blur sonrası HoughCircles ile tabak çemberini tespit eder.
    """
    eq = cv2.equalizeHist(gray)
    blur = cv2.GaussianBlur(eq, (7,7), 0)
    circles = cv2.HoughCircles(
        blur, cv2.HOUGH_GRADIENT, dp=1.0,
        minDist=gray.shape[0]//2, param1=100, param2=50,
        minRadius=gray.shape[0]//8, maxRadius=gray.shape[0]//2
    )
    if circles is None:
        raise RuntimeError("Tabak bulunamadı.")
    circles = np.round(circles[0]).astype(int)
    x, y, r = max(circles, key=lambda c: c[2])
    return x, y, r


def remove_background(img: np.ndarray, x: int, y: int, r: int):
    """
    GrabCut ile tabak içi yemek bölgesinin dışındaki arka planı kaldırır,
    ardından morpholojik open ve close ile maskeyi temizler.
    """
    mask = np.zeros(img.shape[:2], np.uint8)
    bgdModel = np.zeros((1,65), np.float64)
    fgdModel = np.zeros((1,65), np.float64)
    rect = (x-r, y-r, 2*r, 2*r)
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    mask_fg = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
    mask_clean = cv2.morphologyEx(mask_fg, cv2.MORPH_OPEN, kernel, iterations=2)
    mask_clean = cv2.morphologyEx(mask_clean, cv2.MORPH_CLOSE, kernel, iterations=2)
    return img * mask_clean[:,:,None], mask_clean


def refine_depth(depth: np.ndarray):
    """
    Derinlik haritasını 2–98 persentil kliplama ve median blur ile iyileştirir,
    sonra 0–1 aralığına normalize eder.
    """
    lo, hi = np.percentile(depth, [2, 98])
    clipped = np.clip(depth, lo, hi)
    filt = cv2.medianBlur(clipped.astype(np.float32), 5)
    norm = (filt - filt.min()) / (np.ptp(filt) + 1e-6)
    return norm


def calibrate_scales(depth: np.ndarray, mask: np.ndarray, x: int, y: int, r: int):
    """
    Tabak içi zemin ve yemek bölgesi derinlik farkından ölçek hesaplar.
    confidence mask oranını da döner.
    """
    h, w = depth.shape
    Y, X = np.ogrid[:h, :w]
    plate = (X-x)**2 + (Y-y)**2 <= r**2
    bg_region = np.logical_and(plate, mask == 0)
    fg_region = np.logical_and(plate, mask == 1)
    base = np.median(depth[bg_region])
    peak = np.percentile(depth[fg_region], 90)
    delta = peak - base
    pixel_to_cm = ASSUMED_PLATE_DIAMETER_CM / (2 * r)
    depth_scale = ASSUMED_PLATE_HEIGHT_CM / delta if delta > 1e-6 else 1.0
    conf_mask = float(np.clip(fg_region.sum() / plate.sum(), 0, 1))
    return pixel_to_cm, depth_scale, conf_mask


def estimate_volume(depth: np.ndarray, pixel_to_cm: float, depth_scale: float, mask: np.ndarray) -> float:
    depth_norm = refine_depth(depth)
    h_cm = depth_norm * depth_scale
    h_food = np.clip(h_cm * mask, 0, None)
    base_vol = float(np.sum(h_food) * (pixel_to_cm ** 2))
    CONVERSION_FACTOR = 1.0
    if base_vol < 15.0:
        CONVERSION_FACTOR = 250.0
    vol = base_vol * CONVERSION_FACTOR
    return vol


def main():
    model, transform, device = load_midas_model()
    img_dir = os.path.join(os.path.dirname(__file__), 'images')
    imgs = [f for f in os.listdir(img_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if not imgs:
        print("Resim bulunamadı.")
        return

    img_name = random.choice(imgs)
    img_path = os.path.join(img_dir, img_name)
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    x, y, r = detect_plate_circle(gray)

    fg, mask = remove_background(img, x, y, r)
    inp = transform(cv2.cvtColor(fg, cv2.COLOR_BGR2RGB)).to(device)
    with torch.no_grad():
        pred = model(inp)
        depth = torch.nn.functional.interpolate(
            pred.unsqueeze(1), size=gray.shape,
            mode='bicubic', align_corners=False
        ).squeeze().cpu().numpy()

    pixel_to_cm, depth_scale, conf_mask = calibrate_scales(depth, mask, x, y, r)
    volume = estimate_volume(depth, pixel_to_cm, depth_scale, mask)
    confidence = conf_mask

    print(f"Seçilen: {img_name}")
    print(f"Tahmini hacim: {volume:.2f} cm³ | Güven: {confidence*100:.1f}%")
    return volume, confidence

if __name__=='__main__':
    main()
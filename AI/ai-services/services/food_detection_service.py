import os
import tempfile
from models.food_model import predict_food

def detect_food_from_stream(file_stream, filename="tmp.jpg"):
    """
    - Orijinal uzantıyı kullanır (filename’den ayrıştırılır).
    - Stream’i başa sarar, bytes okur, temp dosyaya yazar.
    - Model predict_food(tmp_path) çağırır.
    - Debug log’lar: label ve confidence.
    - %50 altında False döner.
    """
    _, ext = os.path.splitext(filename)
    if not ext:
        ext = ".jpg"

    try:
        file_stream.seek(0)
    except Exception:
        pass

    data = file_stream.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        label, confidence = predict_food(tmp_path)
        print(f"[DEBUG] predict_food -> label: {label}, confidence: {confidence}")
    finally:
    
        os.unlink(tmp_path)

  
    if confidence < 0.50:
        print(f"[DEBUG] confidence ({confidence}) < 0.50 → returning False")
        return None, False

    return label, confidence

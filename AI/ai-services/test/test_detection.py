import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.food_model import predict_food  # Bu satır eksikti, unutma!

test_folder = "test/images"
valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')

image_files = [f for f in os.listdir(test_folder) if f.lower().endswith(valid_extensions)]

print(f"\n🖼 Toplam {len(image_files)} görsel bulundu.\n")

for filename in sorted(image_files):
    image_path = os.path.join(test_folder, filename)
    print(f"🔎 İşleniyor: {filename}...")
    try:
        label, confidence = predict_food(image_path)
        print(f"✅ Tahmin: {label}, Güven: %{confidence * 100:.2f}\n")
    except Exception as e:
        print(f"⚠️ Hata ({filename}): {e}\n")

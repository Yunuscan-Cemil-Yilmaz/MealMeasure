import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.food_model import predict_food
from services.ai_api_fallback_detection import ask_gpt_about_image
from PIL import Image

# Klasor ayarlari
image_folder = "test/images"
valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
image_files = [f for f in os.listdir(image_folder) if f.lower().endswith(valid_extensions)]

print(f"\n🖼 Toplam {len(image_files)} görsel bulundu.\n")

for filename in sorted(image_files):
    image_path = os.path.join(image_folder, filename)
    print(f"🔎 İşleniyor: {filename}...")
    try:
        label, confidence = predict_food(image_path)
        print(f"✅ Model tahmini: {label}, Güven: %{confidence * 100:.2f}")

        if confidence < 0.50:
            print("⚠️ Güven düşük, GPT'ye gönderiliyor...")
            try:
                gpt_response = ask_gpt_about_image(image_path)
                print(f"🤖 GPT tahmini: {gpt_response}\n")
            except Exception as e:
                print(f"❌ GPT isteğinde hata: {e}\n")
        else:
            print()

    except Exception as e:
        print(f"❌ Tahmin hatası ({filename}): {e}\n")

import os
import shutil
from rembg import remove
from PIL import Image

# Klasör tanımlamaları
INPUT_FOLDER = "test/images"
OUTPUT_FOLDER = "test/removed_bg"

# Klasör varsa sil ve yeniden oluştur
if os.path.exists(OUTPUT_FOLDER):
    shutil.rmtree(OUTPUT_FOLDER)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Geçerli görsel uzantıları
valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')

# Görsel dosyalarını topla
image_files = [f for f in os.listdir(INPUT_FOLDER) if f.lower().endswith(valid_extensions)]

print(f"\n🔍 Toplam {len(image_files)} görsel işlenecek...\n")

# Her bir görsel için işlem yap
for filename in sorted(image_files):
    input_path = os.path.join(INPUT_FOLDER, filename)
    output_path = os.path.join(OUTPUT_FOLDER, os.path.splitext(filename)[0] + ".png")  # RGBA destekli format

    try:
        with Image.open(input_path).convert("RGBA") as input_img:
            output_img = remove(input_img)
            output_img.save(output_path)
            print(f"✅ Arka plan kaldırıldı: {filename}")
    except Exception as e:
        print(f"❌ Hata ({filename}): {e}")

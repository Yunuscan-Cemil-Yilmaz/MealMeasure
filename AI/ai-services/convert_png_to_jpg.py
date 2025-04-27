from PIL import Image
import os

# Dataset klasörünün yolu
dataset_dir = "dataset"

# Eski .png dosyalarını silmek istiyor musun? (True yaparsan png dosyaları silinir)
delete_original_png = True

# Bütün klasörleri tarar
for root, dirs, files in os.walk(dataset_dir):
    for file in files:
        if file.lower().endswith(".png"):
            png_path = os.path.join(root, file)
            
            # Yeni jpg yolu
            jpg_file = os.path.splitext(file)[0] + ".jpg"
            jpg_path = os.path.join(root, jpg_file)
            
            # PNG dosyasını aç
            with Image.open(png_path) as img:
                # Eğer alpha channel (şeffaflık) varsa RGB'ye çevir
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                img.save(jpg_path, "JPEG")
            
            print(f"Çevrildi: {png_path} -> {jpg_path}")

            # Eski PNG dosyasını sil
            if delete_original_png:
                os.remove(png_path)
                print(f"Silindi: {png_path}")

print("Tüm PNG dosyaları JPEG'e dönüştürüldü!")

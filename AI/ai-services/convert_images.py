from PIL import Image
import os

def convert_image(image_path, delete_original=True):
    ext = os.path.splitext(image_path)[1].lower()
    target_path = os.path.splitext(image_path)[0] + ".jpg"
    
    try:
        with Image.open(image_path) as img:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(target_path, "JPEG")
        print(f"✅ Çevrildi: {image_path} -> {target_path}")
        
        if delete_original:
            os.remove(image_path)
            print(f"🗑 Silindi: {image_path}")
    except Exception as e:
        print(f"❌ Hata: {image_path} dönüştürülemedi. {e}")

def process_folder(folder_path, delete_original=True):
    for root, _, files in os.walk(folder_path):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in [".png", ".webp", ".jpeg", ".jpg"]:
                if not file.lower().endswith(".jpg"):
                    image_path = os.path.join(root, file)
                    convert_image(image_path, delete_original)

def main():
    dataset_dir = "dataset"
    delete_original_files = True

    while True:
        print("\n=== Görsel Format Dönüştürücü Menü ===")
        print("1 - Tüm klasörlerdeki resimleri dönüştür")
        print("2 - Belirli bir klasördeki resimleri dönüştür")
        print("-1 - Çıkış")

        choice = input("Seçiminiz: ").strip()

        if choice == "1":
            process_folder(dataset_dir, delete_original_files)
            break
        elif choice == "2":
            while True:
                folder_name = input("İşlem yapmak istediğiniz klasörün adını girin (-1 ile iptal): ").strip()
                if folder_name == "-1":
                    print("İşlem iptal edildi.")
                    return
                specific_path = os.path.join(dataset_dir, folder_name)
                if os.path.isdir(specific_path):
                    process_folder(specific_path, delete_original_files)
                    return
                else:
                    print("❌ Hatalı klasör ismi, tekrar deneyin.")
        elif choice == "-1":
            print("Çıkış yapılıyor.")
            return
        else:
            print("❌ Hatalı giriş, lütfen geçerli bir seçenek girin.")

if __name__ == "__main__":
    main()

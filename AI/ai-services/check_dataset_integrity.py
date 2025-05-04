from PIL import Image
import os
import hashlib
from collections import defaultdict

def calculate_hash(file_path):
    with open(file_path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def check_missing_images(folder_path, expected_count):
    print(f"\n📂 Klasör: {folder_path}")
    existing_files = sorted([
        f for f in os.listdir(folder_path)
        if f.lower().endswith(('.jpg', '.jpeg'))
    ])
    existing_numbers = set()
    for fname in existing_files:
        base = os.path.splitext(fname)[0]
        if base.isdigit():
            existing_numbers.add(int(base))

    missing = [f"{i:06d}" for i in range(1, expected_count + 1) if i not in existing_numbers]
    if missing:
        print(f"❌ Eksik görseller ({len(missing)} adet): {', '.join(missing)}")
    else:
        print("✅ Eksik görsel yok.")

def check_duplicate_images(folder_path):
    print(f"\n🔍 Aynı içerikli görseller kontrol ediliyor: {folder_path}")
    hash_map = defaultdict(list)
    for root, _, files in os.walk(folder_path):
        for fname in files:
            if fname.lower().endswith((".jpg", ".jpeg")):
                full_path = os.path.join(root, fname)
                try:
                    file_hash = calculate_hash(full_path)
                    hash_map[file_hash].append(full_path)
                except Exception as e:
                    print(f"Hata ({fname}): {e}")

    has_duplicates = False
    for file_hash, paths in hash_map.items():
        if len(paths) > 1:
            has_duplicates = True
            print(f"\n🔁 Duplicate içerik bulundu ({len(paths)} kopya):")
            for p in paths:
                print(f"  → {p}")

    if not has_duplicates:
        print("✅ Aynı içerikte görsel bulunamadı.")

def check_duplicate_filenames(folder_path):
    print(f"\n🧾 Aynı isimli dosya kontrol ediliyor: {folder_path}")
    name_map = defaultdict(list)

    for fname in os.listdir(folder_path):
        if fname.lower().endswith((".jpg", ".jpeg")):
            base_name = os.path.splitext(fname)[0].lower()  # örn: 000022
            name_map[base_name].append(fname)

    has_duplicates = False
    for base, files in name_map.items():
        if len(files) > 1:
            has_duplicates = True
            print(f"❗ Aynı isimli farklı uzantılı dosyalar bulundu: {base}")
            for f in files:
                print(f"  → {f}")
    
    if not has_duplicates:
        print("✅ Aynı isimli dosya bulunamadı.")

def main():
    dataset_dir = "dataset"

    while True:
        print("\n=== Görsel Dosya Kontrol Aracı ===")
        print("1 - Tüm klasörleri kontrol et")
        print("2 - Belirli bir klasörü kontrol et")
        print("-1 - Çıkış")
        secim = input("Seçiminiz: ").strip()

        if secim == "-1":
            print("Çıkış yapılıyor.")
            break

        elif secim in ["1", "2"]:
            try:
                expected = int(input("Klasör başına kaç görsel olması gerekiyor? (örn: 75): ").strip())
            except ValueError:
                print("❌ Geçersiz sayı girdiniz.")
                continue

            if secim == "1":
                for subfolder in sorted(os.listdir(dataset_dir)):
                    full_path = os.path.join(dataset_dir, subfolder)
                    if os.path.isdir(full_path):
                        check_missing_images(full_path, expected)
                        check_duplicate_images(full_path)
                        check_duplicate_filenames(full_path)
            else:
                folder_name = input("Klasör adı (-1 ile iptal): ").strip()
                if folder_name == "-1":
                    print("İşlem iptal edildi.")
                    break
                full_path = os.path.join(dataset_dir, folder_name)
                if os.path.isdir(full_path):
                    check_missing_images(full_path, expected)
                    check_duplicate_images(full_path)
                    check_duplicate_filenames(full_path)
                else:
                    print("❌ Geçersiz klasör ismi.")
        else:
            print("❌ Geçersiz seçim, tekrar deneyin.")

if __name__ == "__main__":
    main()

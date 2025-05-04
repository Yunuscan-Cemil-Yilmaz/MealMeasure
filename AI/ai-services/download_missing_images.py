import os
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

def search_google_images(query, existing_paths, max_results=20):
    def is_duplicate_url_content(url):
        try:
            resp = requests.get(url, timeout=5)
            img = Image.open(BytesIO(resp.content))
            new_hash = img.tobytes()
            for img_path in existing_paths:
                with Image.open(img_path) as existing:
                    if existing.tobytes() == new_hash:
                        return True
            return False
        except:
            return True  # Eğer bir hata olursa bu resmi geç

    url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    image_elements = soup.find_all("img")

    image_urls = []
    for img in image_elements:
        src = img.get("src")
        if src and src.startswith("http"):
            if not is_duplicate_url_content(src):
                image_urls.append(src)
        if len(image_urls) >= max_results:
            break

    return image_urls

def main():
    dataset_dir = "dataset"
    folder = input("Klasör adı (örnek: Lahmacun): ").strip()
    search_term = input("Google'da aramak için bir kelime veya cümle girin: ").strip()
    try:
        expected_count = int(input("Bu klasörde kaç resim olması gerekiyor?: ").strip())
    except ValueError:
        print("❌ Geçersiz sayı girdiniz.")
        return

    folder_path = os.path.join(dataset_dir, folder)
    if not os.path.isdir(folder_path):
        print("❌ Klasör bulunamadı.")
        return

    # Mevcut dosyaları kontrol et
    existing_files = sorted([
        f for f in os.listdir(folder_path)
        if f.lower().endswith(('.jpg', '.jpeg'))
    ])
    existing_numbers = set()
    for fname in existing_files:
        base = os.path.splitext(fname)[0]
        if base.isdigit():
            existing_numbers.add(int(base))

    missing_numbers = [i for i in range(1, expected_count + 1) if i not in existing_numbers]
    if not missing_numbers:
        print("✅ Eksik görsel yok.")
        return

    print(f"🟡 {len(missing_numbers)} eksik görsel bulundu.")
    print(f"🔍 '{search_term}' için Google'da resim aranıyor...")
    image_urls = search_google_images(search_term, existing_paths, max_results=len(missing_numbers)*2)

    existing_paths = [os.path.join(folder_path, f) for f in existing_files]
    downloaded = 0
    idx = 0

    for missing_num in missing_numbers:
        saved = False
        while not saved and idx < len(image_urls):
            url = image_urls[idx]
            try:
                response = requests.get(url, timeout=5)
                img = Image.open(BytesIO(response.content))
                img.show()
                print(f"💡 Eksik görsel için öneri (sıra: {missing_num:06d})")

                while True:
                    decision = input("Resmi kaydetmek için (y) | Geçmek için (n): ").strip().lower()
                    if decision == 'y':
                        if is_image_duplicate(img, existing_paths):
                            print("⚠️ Bu resim dataset içinde zaten mevcut, atlanıyor.")
                        else:
                            save_name = f"{missing_num:06d}.jpg"
                            save_path = os.path.join(folder_path, save_name)
                            img.convert("RGB").save(save_path)
                            print(f"✅ Kaydedildi: {save_path}")
                            downloaded += 1
                        saved = True
                        break
                    elif decision == 'n':
                        print("⏭ Geçildi.")
                        break
                    else:
                        print("❌ Hatalı giriş. y/n giriniz.")
                img.close()
            except Exception as e:
                print(f"⚠️ Resim indirilemedi: {url} | Hata: {e}")
            idx += 1

    print(f"\n🎉 İşlem tamamlandı. {downloaded} yeni resim indirildi.")

if __name__ == "__main__":
    main()

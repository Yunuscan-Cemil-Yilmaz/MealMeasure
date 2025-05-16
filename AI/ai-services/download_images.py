from icrawler.builtin import GoogleImageCrawler
import os

# Türkçe karakter düzeltici
def clean_filename(name):
    replacements = {
        "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
        "Ç": "C", "Ğ": "G", "İ": "I", "Ö": "O", "Ş": "S", "Ü": "U"
    }
    for src, target in replacements.items():
        name = name.replace(src, target)
    return name.replace(" ", "_").replace("-", "_")

# Yemek listesi
food_list = [
    "Adana Kebap", "Baklava", "Bulgur Pilavı", "Çiğ Köfte",
    "Döner", "İçli Köfte", "İskender Kebap", "Karnıyarık", "Kısır",
    "Lahmacun", "Mantı", "Menemen", "Mercimek Çorbası", "Pilav",
    "Pide", "Simit", "Yaprak Sarması", "Domates Çorbası", "Ezo Gelin Çorbası",
    "Yayla Çorbası", "Taze Fasulye", "Kabak Dolması", "Güveç",
    "Kumpir", "Su Böreği", "Çikolatalı Pasta", "Cacık", "Yeşil Salata",
    "Fırın Tavuk", "Pişi", "Kuymak", "Balık Izgara", "Balık Tava", "Köfte",
    "Aşure", "Sütlaç", "Künefe", "Tulumba Tatlısı", "Patates Kızartması", "Kuru Fasulye",
    "Et Sote"
]

dataset_dir = "dataset"
num_images_per_food = 75

# İndirme işlemi
for food in food_list:
    food_folder = clean_filename(food)
    save_dir = os.path.join(dataset_dir, food_folder)

    os.makedirs(save_dir, exist_ok=True)

    google_crawler = GoogleImageCrawler(
        storage={"root_dir": save_dir},
        downloader_threads=2  # ❗ Doğru yerde ayarlandı
    )
    google_crawler.crawl(keyword=food, max_num=num_images_per_food)

    print(f"{food} için resimler indirildi → {save_dir}")

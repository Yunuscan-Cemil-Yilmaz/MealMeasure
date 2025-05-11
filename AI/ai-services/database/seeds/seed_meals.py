import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.database_connection import get_db_connection

def seed():
    data = [
        {"meal_label": "Adana_Kebap", "volume_cal": 2.5},
        {"meal_label": "Asure", "volume_cal": 1.2},
        {"meal_label": "Baklava", "volume_cal": 5.2},
        {"meal_label": "Balik_Izgara", "volume_cal": 1.7},
        {"meal_label": "Balik_Tava", "volume_cal": 2.3},
        {"meal_label": "Bulgur_Pilavi", "volume_cal": 1.2},
        {"meal_label": "Cacik", "volume_cal": 0.4},
        {"meal_label": "Cig_Kofte", "volume_cal": 2.2},
        {"meal_label": "Cikolatali_Pasta", "volume_cal": 3.8},
        {"meal_label": "Domates_Corbasi", "volume_cal": 0.4},
        {"meal_label": "Doner", "volume_cal": 3.0},
        {"meal_label": "Et_Sote", "volume_cal": 2.8},
        {"meal_label": "Eza_Gelin_Corbasi", "volume_cal": 0.6},
        {"meal_label": "Firin_Tavuk", "volume_cal": 2.5},
        {"meal_label": "Guvec", "volume_cal": 1.6},
        {"meal_label": "Icli_Kofte", "volume_cal": 3.1},
        {"meal_label": "Iskender_Kebap", "volume_cal": 3.6},
        {"meal_label": "Kabak_Dolmasi", "volume_cal": 1.0},
        {"meal_label": "Karniyarik", "volume_cal": 2.1},
        {"meal_label": "Kisir", "volume_cal": 2.0},
        {"meal_label": "Kofte", "volume_cal": 3.2},
        {"meal_label": "Kumpir", "volume_cal": 2.3},
        {"meal_label": "Kunefe", "volume_cal": 5.3},
        {"meal_label": "Kuru_Fasulye", "volume_cal": 1.7},
        {"meal_label": "Kuymak", "volume_cal": 5.7},
        {"meal_label": "Lahmacun", "volume_cal": 1.6},
        {"meal_label": "Manti", "volume_cal": 3.0},
        {"meal_label": "Menemen", "volume_cal": 1.1},
        {"meal_label": "Mercimek_Corbasi", "volume_cal": 0.8},
        {"meal_label": "Patates_Kizartmasi", "volume_cal": 3.9},
        {"meal_label": "Pide", "volume_cal": 3.2},
        {"meal_label": "Pilav", "volume_cal": 1.5},
        {"meal_label": "Pisi", "volume_cal": 3.5},
        {"meal_label": "Simit", "volume_cal": 4.0},
        {"meal_label": "Su_Boregi", "volume_cal": 4.5},
        {"meal_label": "Sutlac", "volume_cal": 1.3},
        {"meal_label": "Taze_Fasulye", "volume_cal": 1.2},
        {"meal_label": "Tulumba_Tatlisi", "volume_cal": 4.9},
        {"meal_label": "Yaprak_Sarmasi", "volume_cal": 2.4},
        {"meal_label": "Yayla_Corbasi", "volume_cal": 0.7},
        {"meal_label": "Yesil_Salata", "volume_cal": 0.2},
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    for item in data:
        cursor.execute("SELECT COUNT(*) FROM meals_calculate WHERE meal_label = %s", (item["meal_label"],))
        exists = cursor.fetchone()[0]

        if exists == 0:
            cursor.execute("INSERT INTO meals_calculate (meal_label, volume_cal) VALUES (%s, %s)",
                           (item["meal_label"], item["volume_cal"]))
            print(f"✅ Eklendi: {item['meal_label']}")
        else:
            print(f"⏭️ Zaten var: {item['meal_label']}")

    conn.commit()
    cursor.close()
    conn.close()

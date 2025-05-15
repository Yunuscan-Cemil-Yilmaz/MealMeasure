import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from database.migrations.create_meals_table import migrate
from database.seeds.seed_meals import seed

def run():
    print("🚀 Migration başlatılıyor...")
    migrate()
    print("🚀 Seed işlemi başlatılıyor...")
    seed()
    print("🎉 Tamamlandı.")

if __name__ == "__main__":
    run()

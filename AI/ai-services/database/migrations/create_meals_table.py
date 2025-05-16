import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.database_connection import get_db_connection

def migrate():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = %s AND table_name = 'meals_calculate'
    """, (conn.database,))
    exists = cursor.fetchone()[0]

    if exists == 0:
        cursor.execute("""
            CREATE TABLE meals_calculate (
                id INT AUTO_INCREMENT PRIMARY KEY,
                meal_label VARCHAR(255) UNIQUE,
                volume_cal FLOAT
            )
        """)
        print("✅ Tablo oluşturuldu: meals_calculate")
    else:
        print("ℹ️ Tablo zaten mevcut: meals_calculate")

    cursor.close()
    conn.close()

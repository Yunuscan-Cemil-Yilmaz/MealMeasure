import sys, os
sys.path.append(os.path.dirname(__file__))
from config.database_connection import get_db_connection

def get_calorie_per_cm3(meal_label: str):
    """
    meals_calculate tablosundan tek bir volume_cal değeri çeker.
    Bulamazsa None döner.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        sql = """
            SELECT volume_cal
            FROM meals_calculate
            WHERE meal_label = %s
            LIMIT 1
        """
        cursor.execute(sql, (meal_label,))
        row = cursor.fetchone()
        if row:
            return float(row[0])
        return None
    finally:
        cursor.close()
        conn.close()

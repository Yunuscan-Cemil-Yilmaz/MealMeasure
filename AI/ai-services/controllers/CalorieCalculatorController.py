from flask import Blueprint, request, jsonify
from services.food_detection_service import detect_food_from_stream
from services.volume_detection_services import detect_volume_from_stream
from services.calorie_db_service import get_calorie_per_cm3
import io

calorieCalculator = Blueprint('calorie_calculator', __name__)

@calorieCalculator.route('/calculate', methods=['POST'])
def calculate():
    if 'image' not in request.files:
        return jsonify({
            "status": "error",
            "message": "No image provided!",
            "response": None,
            "volume": None,
            "cal_per_cm3": None,
            "total_calories": None,
            "conf_food": None,
            "conf_volume": None
        }), 400

    file = request.files['image']
    filename = file.filename

    # Aynı bytes’ı iki kez kullanabilmek için BytesIO’ya al
    data = file.read()
    img1 = io.BytesIO(data)
    img2 = io.BytesIO(data)

    # 1) Food detection
    label, conf_food = detect_food_from_stream(img1, filename)
    # 2) Volume detection
    volume, conf_vol   = detect_volume_from_stream(img2, filename)

    # Eğer birinde düşük güven varsa fallback yapılacak
    if not conf_food or not conf_vol:
        return jsonify({
            "status": "fallback",
            "message": "Low confidence; delegating to GPT fallback.",
            "response": {
                "food": label,
                "volume_cm3": volume
            },
            "conf_food": conf_food,
            "conf_volume": conf_vol
        }), 200

    # 3) Veritabanından birim hacim başına kalori al
    cal_per_cm3 = get_calorie_per_cm3(label)
    if cal_per_cm3 is None:
        # DB’de yoksa da fallback davranışı ya da error dönülebilir
        return jsonify({
            "status": "error",
            "message": f"No calorie info in DB for label '{label}'",
            "response": None,
            "conf_food": conf_food,
            "conf_volume": conf_vol
        }), 404

    # 4) Toplam kalori = birim hacim kalori * volume
    total_cal = cal_per_cm3 * volume

    return jsonify({
        "status": "success",
        "message": "Detection + DB lookup successful.",
        "response": {
            "food": label,
            "volume_cm3": round(volume, 2),
            "cal_per_cm3": round(cal_per_cm3, 2),
            "total_calories": round(total_cal, 2)
        },
        "conf_food": round(conf_food * 100, 2),
        "conf_volume": round(conf_vol * 100, 2)
    }), 200

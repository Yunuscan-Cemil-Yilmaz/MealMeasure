# controllers/CalorieCalculatorController.py

from flask import Blueprint, request, jsonify
from services.food_detection_service import detect_food_from_stream
from services.volume_detection_services import detect_volume_from_stream
from services.calorie_db_service import get_calorie_per_cm3
from services.ai_api_fallback_detection import ask_gpt_about_calories
import io, tempfile, os

calorieCalculator = Blueprint('calorie_calculator', __name__)

@calorieCalculator.route('/calculate', methods=['POST'])
def calculate():
    if 'image' not in request.files:
        return jsonify({
            "status": "error",
            "message": "No image provided!",
            "response": None,
            "from": "system"
        }), 400, {'Content-Type': 'application/json'}

    file = request.files['image']
    data = file.read()


    img1 = io.BytesIO(data)
    img2 = io.BytesIO(data)

    try:
        label, conf_food = detect_food_from_stream(img1, file.filename)
        volume, conf_vol = detect_volume_from_stream(img2, file.filename)

        if not conf_food or not conf_vol:
            raise RuntimeError("Low detector confidence")

        cal_per_cm3 = get_calorie_per_cm3(label)
        if cal_per_cm3 is None:
            raise RuntimeError(f"No DB record for '{label}'")

        total_cal = cal_per_cm3 * volume

        return jsonify({
            "status": "success",
            "message": "Calculated by system.",
            "response": round(total_cal, 2),
            "from": "system"
        }), 200, {'Content-Type': 'application/json'}

    except Exception as e:
        suffix = os.path.splitext(file.filename)[1] or ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(data)
            tmp_path = tmp.name

        try:
            gpt_cal = ask_gpt_about_calories(tmp_path)
        finally:
            os.unlink(tmp_path)

        return jsonify({
            "status": "fallback",
            "message": "Calculated by GPT.",
            "response": gpt_cal,
            "from": "gpt"
        }), 200, {'Content-Type': 'application/json'}

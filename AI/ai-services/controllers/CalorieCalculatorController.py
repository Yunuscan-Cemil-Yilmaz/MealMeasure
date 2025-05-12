from flask import Blueprint, request, jsonify
from services.food_detection_service import detect_food_from_stream
import io

calorieCalculator = Blueprint('calorie_calculator', __name__)

@calorieCalculator.route('/calculate', methods=['POST'])
def calculate():
    print("Calorie Calculator API is working...")

    if 'image' not in request.files:
        return jsonify({
            "status": "error",
            "message": "No image provided!",
            "response": None,
            "confidence": None
        }), 400

    file = request.files['image']
    print(f"[CONTROLLER] File received: {file.filename}")

    try:
        # filename da geçiyoruz ki uzantı korunsun
        label, confidence = detect_food_from_stream(file.stream, file.filename)
        print(f"[CONTROLLER] Service returned → label: {label}, confidence: {confidence}")

        if confidence is False:
            return jsonify({
                "status": "error",
                "message": "Could not confidently detect the food.",
                "response": None,
                "confidence": confidence
            }), 200

        return jsonify({
            "status": "success",
            "message": "Detection success.",
            "response": label,
            "confidence": round(confidence * 100, 2)
        }), 200

    except Exception as e:
        print(f"[CONTROLLER][ERROR] {e}")
        return jsonify({
            "status": "error",
            "message": "Exception occurred during detection.",
            "response": None,
            "confidence": None
        }), 500

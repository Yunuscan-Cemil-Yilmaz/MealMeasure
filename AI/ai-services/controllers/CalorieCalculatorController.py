from flask import Blueprint, request, jsonify

calorieCalculator = Blueprint('calorie_calculator', __name__)


@calorieCalculator.route('/calculate', methods=['POST'])
def calculate():
    print("Calorie Calculator API is working...")
    
    # Örnek veri (normalde burada hesaplama olur)
    return jsonify({
        "status": "success",
        "message": "Calorie calculated!"
    })
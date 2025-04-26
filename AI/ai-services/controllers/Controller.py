from controllers.CalorieCalculatorController import calorieCalculator
from flask import request, jsonify
from utils.Security import verify_appkey_hash

def api_routes(app):
    @calorieCalculator.before_request
    def check_api_key():
        client_key_hash = request.headers.get('x-api-key') or (
            request.json.get('x-api-key') if request.is_json else None
        )
        if not client_key_hash or not verify_appkey_hash(client_key_hash):
            return jsonify({"error": "Unauthorized"}), 401

    app.register_blueprint(calorieCalculator, url_prefix='/api/calorie-calculator');
from controllers.CalorieCalculatorController import calorieCalculator

def api_routes(app):
    app.register_blueprint(calorieCalculator, url_prefix='/api/calorie-calculator')
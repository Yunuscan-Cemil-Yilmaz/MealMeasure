from flask import Blueprint, request, jsonify;
from PIL import Image;
import io;

calorieCalculator = Blueprint('calorie_calculator', __name__)


@calorieCalculator.route('/calculate', methods=['POST'])
def calculate():
    print("Calorie Calculator API is working...");

    if( 'image' not in request.files):
        return jsonify({
            "status": "error",
            "message": "No image provided!"
        });

    file = request.files['image']; # read the image file
    print(f"File received: {file.filename}");

    try: 
        img = Image.open(file.stream); # open the image file 
        img.show(); # display the image
    except Exception as e:
        print(f"Error opening image: {e}");
    
    
    # Örnek veri (normalde burada hesaplama olur)
    return jsonify({
        "status": "success",
        "message": "Calorie calculated!"
    });
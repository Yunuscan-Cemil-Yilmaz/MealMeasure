import sys
import os

# Proje kök dizinine ulaş
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# predict_food fonksiyonunu çağır
from models.food_model import predict_food

# Test etmek istediğin resmin yolu
image_path = "test/images/manti1.jpeg"  # (Resmin doğru yerde olduğuna dikkat et)

# Tahmin yap ve sonucu yazdır
predicted_food = predict_food(image_path)
print(f"Predicted food class: {predicted_food}")

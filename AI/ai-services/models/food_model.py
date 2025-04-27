from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import torch


model_name = "eslamxm/vit-base-food101"


feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
model = AutoModelForImageClassification.from_pretrained(model_name)


def predict_food(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = feature_extractor(images=image, return_tensors="pt")


    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class_idx = logits.argmax(-1).item()
    predicted_class = model.config.id2label[predicted_class_idx]

    return predicted_class

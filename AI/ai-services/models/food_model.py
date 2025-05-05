import torch
from torchvision import transforms
from PIL import Image
import os
from models.resnet_finetune import get_resnet50_model

# model and class names
model_path = "outputs/checkpoints/resnet50_finetuned.pth"
class_names = sorted(os.listdir("dataset"))  # get labels from folder names

# image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

# load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = get_resnet50_model(len(class_names)).to(device)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

def predict_food(image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probs, dim=1)
        predicted_label = class_names[predicted_idx.item()]
        return predicted_label, confidence.item()

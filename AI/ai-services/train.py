import torch
import torch.nn as nn
import torch.optim as optim
from utils.dataset_loader import get_dataloaders
from model.resnet_finetune import get_resnet50_model
import os

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

data_dir = "dataset"
batch_size = 16
epochs = 10
lr = 1e-4

train_loader, num_classes = get_dataloaders(data_dir, batch_size=batch_size)

model = get_resnet50_model(num_classes).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=lr)

for epoch in range(epochs):
    model.train()
    total_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"Epoch [{epoch+1}/{epochs}], Loss: {total_loss:.4f}")

torch.save(model.state_dict(), os.path.join("outputs", "checkpoints", "resnet50_finetuned.pth"))

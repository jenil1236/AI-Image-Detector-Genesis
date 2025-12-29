import torch
import torch.nn as nn
import timm
from torchvision import transforms
from PIL import Image
from pathlib import Path

# Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.Lambda(lambda x: x.convert('RGB')),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# Setup
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(device)
# Create ConvNeXt-Large
model = timm.create_model("convnext_large", pretrained=True)
n_features = model.head.fc.in_features
model.head.fc = nn.Sequential(
    nn.Dropout(0.2),
    nn.Linear(n_features, 2)
)
model = model.to(device)

# Load weights
checkpoint = torch.load('model.pth', map_location=device)
model.load_state_dict(checkpoint['model_state_dict'] if 'model_state_dict' in checkpoint else checkpoint)
model.eval()
print("Model loaded.")
# Predict
img_dir = Path('image')
for img_path in img_dir.glob('*.[jp][pn]g'):
    try:
        img = transform(Image.open(img_path)).unsqueeze(0).to(device)
        with torch.no_grad():
            pred = torch.argmax(torch.softmax(model(img), dim=1), dim=1).item()
        print(f"{img_path.name}: {'AI-Generated' if pred == 0 else 'Real'}")
    except:
        print(f"{img_path.name}: Error")
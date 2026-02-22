import requests
import binascii

# ============================
# CONFIG
# ============================
API_URL = "https://jenil1236-genesis2-0.hf.space/predict"
IMAGE_PATH = "ai2.jpeg"          # path to your image
OUTPUT_IMAGE = "gradcam.png"     # output heatmap file

# ============================
# SEND REQUEST
# ============================
with open(IMAGE_PATH, "rb") as f:
    files = {
        "file": ("image.jpg", f, "image/jpeg")
    }
    response = requests.post(API_URL, files=files)

# ============================
# CHECK RESPONSE
# ============================
response.raise_for_status()
data = response.json()

print("Prediction:", data["prediction"])

# ============================
# UNHEXIFY HEATMAP
# ============================
hex_heatmap = data["heatmap"]          # hex string
png_bytes = binascii.unhexlify(hex_heatmap)

with open(OUTPUT_IMAGE, "wb") as f:
    f.write(png_bytes)

print(f"🔥 Grad-CAM saved as {OUTPUT_IMAGE}")
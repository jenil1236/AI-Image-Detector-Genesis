# 🖼️ AI Image Authenticity Detector

<div align="center">

**A cutting-edge deep learning system for detecting AI-generated images using ConvNeXt architecture with Grad-CAM visualization**

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=flat&logo=pytorch)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)

[Live Demo](https://huggingface.co/spaces/jenil1236/convnext-gradcam-api) • [Research Paper](#-research-paper) • [Documentation](#-features)

</div>

---

## 🎯 Problem Statement

In the era of generative AI, distinguishing between authentic and AI-generated images has become increasingly challenging. With tools like DALL-E, Midjourney, and Stable Diffusion producing photorealistic images, there's a critical need for reliable detection systems to:

- **Combat Misinformation**: Prevent the spread of fake news and manipulated media
- **Protect Digital Authenticity**: Verify the genuineness of online content
- **Support Content Moderation**: Help platforms identify synthetic media
- **Preserve Trust**: Maintain credibility in digital communications and journalism

Traditional detection methods struggle with modern generative models. Our solution leverages state-of-the-art ConvNeXt architecture with explainable AI (Grad-CAM) to provide accurate, interpretable detection with **92.89% accuracy**.

---

## 🚀 Key Features

### 🧠 Advanced ML Model
- **ConvNeXt Architecture**: Modern CNN with 92.89% accuracy (outperforms ResNet, ViT, EfficientNet)
- **Grad-CAM Visualization**: Highlights image regions influencing AI vs Real predictions
- **Transfer Learning**: Pre-trained on ImageNet, fine-tuned on CIFAKE + Hemg datasets
- **Deployed API**: Production-ready model on [Hugging Face Spaces](https://huggingface.co/spaces/jenil1236/convnext-gradcam-api)

### 🌐 Full-Stack Application
- **React Frontend**: Modern, responsive UI with real-time image analysis
- **Firebase Authentication**: Secure user management and session handling
- **Cloud Storage**: Cloudinary integration for image uploads
- **Analysis History**: Track and review past detections with timestamps

### 🔍 Explainable AI
- **Grad-CAM Heatmaps**: Visual explanations of model decisions
- **Confidence Scores**: Probability metrics for each prediction
- **Comparative Analysis**: Side-by-side original and heatmap views

---

## 📊 Model Performance

### Accuracy Comparison

| Model | Accuracy (%) |
|-------|-------------|
| **ConvNeXt** | **92.89** |
| Swin Transformer | 87.0 |
| ResNet | 86.4 |
| EfficientNet | 88.1 |
| ViT-B/16 | 85.42 |

### Classification Metrics

```
Dataset: CIFAKE + Hemg (20,000 images)

Classification Report:
                precision    recall    f1-score    support
Real (0)          0.90       0.95       0.92       10000
Fake (1)          0.95       0.90       0.92       10000

accuracy                                 0.93       20000
macro avg         0.93       0.93       0.92       20000
weighted avg      0.93       0.93       0.92       20000
```

### Grad-CAM Insights
- **Real Images**: Model focuses on natural textures, lighting, and organic patterns
- **AI-Generated**: Highlights artifacts, unnatural symmetry, and synthetic features

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  • Image Upload  • Firebase Auth  • History Dashboard   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                 Backend (Node.js/Express)                │
│  • API Routes  • Cloudinary  • Firebase Admin           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│          ML Model API (Hugging Face Spaces)              │
│  • ConvNeXt Inference  • Grad-CAM Generation            │
│  https://huggingface.co/spaces/jenil1236/convnext-gradcam-api
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
- **React** 18.2 - UI framework
- **Vite** 4.4 - Build tool
- **React Router** 6.20 - Navigation
- **Axios** 1.6 - HTTP client
- **Tailwind CSS** 3.3 - Styling

### Backend
- **Node.js** 18+ - Runtime
- **Express** 5.2 - Web framework
- **Firebase Admin** 13.6 - Authentication
- **Cloudinary** 1.41 - Image storage
- **Multer** 1.4 - File uploads

### Machine Learning
- **PyTorch** 2.0+ - Deep learning framework
- **TorchVision** - Computer vision utilities
- **ConvNeXt** - Model architecture
- **Grad-CAM** - Explainability
- **Hugging Face** - Model deployment

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- Firebase project
- Cloudinary account

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/ai-image-detector.git
cd ai-image-detector
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
# Add Firebase credentials, Cloudinary config

npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install

# Create .env file
# Add Firebase config

npm run dev
```

### 4️⃣ ML Model
The model is deployed on Hugging Face Spaces and accessible via API:
```
POST https://huggingface.co/spaces/jenil1236/convnext-gradcam-api/predict
```

---

## 🎯 Usage

1. **Upload Image**: Select or drag-drop an image
2. **Analyze**: Click "Detect" to send to ML model
3. **View Results**: 
   - Prediction: Real or AI-generated
   - Confidence score
   - Grad-CAM heatmap visualization
4. **History**: Access past analyses from dashboard

---

## 🔬 Research Paper

Our work builds upon modern CNN architectures and explainable AI techniques:

### Key Contributions
- **ConvNeXt Superiority**: Demonstrated 92.89% accuracy vs 86.4% (ResNet)
- **Transfer Learning**: Leveraged ImageNet pretraining for better generalization
- **Explainability**: Integrated Grad-CAM for interpretable predictions
- **Robustness**: Higher resilience to advanced AI generators

### Comparison with Prior Work

| Aspect | Prior CNN Research | Our Work (ConvNeXt) |
|--------|-------------------|---------------------|
| Model Backbone | Custom shallow CNN | ConvNeXt (modern architecture) |
| Training Strategy | Training from scratch | Transfer learning (ImageNet) |
| Feature Learning | Local, low-level patterns | Hierarchical + global semantic |
| Robustness | Limited for advanced generators | Higher generalization |

**📄 Research Paper**: [Link to be added upon publication]

---

## 📈 Model Training Details

### Dataset
- **CIFAKE**: 60,000 real images + 60,000 AI-generated (DALL-E, Midjourney)
- **Hemg**: Additional 20,000 diverse synthetic images
- **Total**: 140,000 images (70k real, 70k fake)

### Training Configuration
```python
Model: ConvNeXt-Base
Input Size: 224×224×3
Batch Size: 32
Optimizer: AdamW
Learning Rate: 1e-4
Epochs: 50
Loss: Binary Cross-Entropy
```

### Data Augmentation
- Random horizontal flip
- Random rotation (±15°)
- Color jitter
- Random crop and resize

---

## 👥 Team - The DOMinators

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ayushman-svnit">
        <img src="https://github.com/ayushman-svnit.png" width="100px;" alt="Ayushman Singh"/><br />
        <sub><b>Ayushman Singh</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Krishna11098">
        <img src="https://github.com/Krishna11098.png" width="100px;" alt="Krishna Tahiliani"/><br />
        <sub><b>Krishna Tahiliani</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/jenil1236">
        <img src="https://github.com/jenil1236.png" width="100px;" alt="Jenil Prajapati"/><br />
        <sub><b>Jenil Prajapati</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Hugging Face** for model hosting infrastructure
- **CIFAKE Dataset** creators for training data
- **PyTorch** team for the deep learning framework
- **ConvNeXt** authors for the architecture

---

## 📧 Contact

For questions or collaboration:
- Open an issue on GitHub
- Email: [Your team email]

---

<div align="center">

**Made with ❤️ by The DOMinators**

⭐ Star this repo if you find it useful!

</div>

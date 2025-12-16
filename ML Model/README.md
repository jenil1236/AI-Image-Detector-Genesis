# AI Generated Image Detector 🔍

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A deep learning system that detects AI-generated images with **98% accuracy** using a hybrid ResNet50 + Vision Transformer feature fusion approach.

## ✨ Features

- **Dual Model Architecture**: Combines ResNet50 (texture features) + ViT (structure features)
- **High Accuracy**: 97.79% accuracy on CIFAKE dataset
- **Two Classifiers**: MLP (98% accuracy) and XGBoost (95% accuracy)
- **Pre-trained Models**: Leverages transfer learning from ImageNet
- **Easy Deployment**: Pre-trained weights included (`best.pth`)

## 📊 Performance Metrics

| Model             | Accuracy | Precision | Recall | F1-Score | MSE    |
| ----------------- | -------- | --------- | ------ | -------- | ------ |
| MLP (Recommended) | 97.79%   | 97.38%    | 98.23% | 97.80%   | 0.0179 |
| XGBoost           | 95.45%   | 95.65%    | 95.23% | 95.44%   | 0.0359 |

## 🏗️ Architecture

    Input Image (224×224×3)
            ↓
    ┌─────────────────────┐
    │   Dual Processing   │
    │ ResNet50 │ ViT-B/16 │
    └──────────┴──────────┘
            ↓
    2816 Fused Features
            ↓
    ┌─────────────────────┐
    │   MLP Classifier    │
    │  512 → 128 → 1      │
    └─────────────────────┘
            ↓
    [0.0-1.0] Probability
    (AI-generated if >0.5)

    
## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ai-image-detector.git
cd ai-image-detector

# Install dependencies
pip install -r requirements.txt
```

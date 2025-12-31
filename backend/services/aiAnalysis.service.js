const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');

class AIAnalysisService {
  constructor() {
    this.API_URL = "https://jenil1236-convnext-gradcam-api.hf.space/predict";
  }

  /**
   * Analyze image using external AI API
   */
  async analyzeImage(imageBuffer, originalName) {
    try {
      // Create form data for the API request
      const formData = new FormData();
      console.log(formData);
      formData.append('file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });
      console.log("before");
      // Make request to external API
      const response = await axios.post(this.API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 seconds timeout
      });
      console.log("after");
      const { prediction, heatmap } = response.data;
      console.log("API Response:", { prediction, heatmap });
      // Convert hex heatmap to buffer
      const heatmapBuffer = Buffer.from(heatmap, 'hex');

      return {
        prediction,
        heatmapBuffer,
        originalImageBuffer: imageBuffer,
      };
    } catch (error) {
      console.error('AI Analysis Error:', error.message);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Upload images to Cloudinary
   */
  async uploadToCloudinary(imageBuffer, folder, publicId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: publicId,
            resource_type: 'image',
            format: 'jpg',
            quality: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        uploadStream.end(imageBuffer);
      });
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      
      return {
        width: metadata.width,
        height: metadata.height,
        sizeKB: Math.round(imageBuffer.length / 1024),
        format: metadata.format,
      };
    } catch (error) {
      throw new Error(`Failed to get image metadata: ${error.message}`);
    }
  }

  /**
   * Generate simple reasoning based on prediction
   */
  // generateReasoning(prediction, confidence = null) {
  //   const isAI = prediction.toLowerCase().includes('ai') || 
  //                prediction.toLowerCase().includes('generated') ||
  //                prediction.toLowerCase().includes('fake');

  //   if (isAI) {
  //     return "The model detected patterns typical of AI-generated images, such as unusual textures, inconsistent lighting, or artifacts commonly produced by generative models.";
  //   } else {
  //     return "The image appears to be authentic with natural characteristics consistent with real photography, including proper lighting, realistic textures, and coherent details.";
  //   }
  // }

  /**
   * Process complete image analysis workflow
   */
  async processImageAnalysis(imageBuffer, originalName, userId) {
    try {
      // Step 1: Analyze image with AI API
      const { prediction, heatmapBuffer, originalImageBuffer } = await this.analyzeImage(imageBuffer, originalName);

      // Step 2: Get image metadata
      const imageMeta = await this.getImageMetadata(originalImageBuffer);

      // Step 3: Generate unique IDs for Cloudinary
      const timestamp = Date.now();
      const originalImageId = `${userId}_original_${timestamp}`;
      const heatmapImageId = `${userId}_heatmap_${timestamp}`;

      // Step 4: Upload both images to Cloudinary
      const [originalImageUrl, heatmapImageUrl] = await Promise.all([
        this.uploadToCloudinary(originalImageBuffer, 'ai-detector/originals', originalImageId),
        this.uploadToCloudinary(heatmapBuffer, 'ai-detector/heatmaps', heatmapImageId),
      ]);

      // Step 5: Generate reasoning
      // const llmReasoning = this.generateReasoning(prediction);

      // Step 6: Create timestamp
      const now = new Date();
      const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

      return {
        uploadImageUrl: originalImageUrl,
        modelResult: prediction,
        modelGradCamPng: heatmapImageUrl,
        // llmReasoning,
        imageMeta,
        date,
        time,
      };
    } catch (error) {
      console.error('Image processing error:', error.message);
      throw error;
    }
  }
}

module.exports = new AIAnalysisService();
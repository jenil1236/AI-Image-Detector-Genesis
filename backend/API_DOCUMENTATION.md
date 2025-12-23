# AI Image Detector API Documentation

## Overview
This API provides image analysis capabilities to detect AI-generated images using machine learning models. It includes user authentication, image upload, analysis, and history management.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Firebase JWT token in the Authorization header:
```
Authorization: Bearer <firebase-jwt-token>
```

## Endpoints

### Health Check
```http
GET /
```
Returns API status.

### Authentication

#### Get Current User
```http
GET /auth/me
```
**Headers:** Authorization required
**Response:**
```json
{
  "uid": "user-id",
  "email": "user@example.com"
}
```

### Image Analysis & History

#### Analyze Image
```http
POST /history/analyze
```
**Headers:** Authorization required, Content-Type: multipart/form-data
**Body:** Form data with `image` field containing the image file
**Response:**
```json
{
  "success": true,
  "message": "Image analyzed successfully",
  "data": {
    "id": "history-entry-id",
    "prediction": "Real" | "AI Generated",
    "originalImageUrl": "https://cloudinary-url/original.jpg",
    "heatmapImageUrl": "https://cloudinary-url/heatmap.png",
    "reasoning": "Detailed explanation of the analysis",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "sizeKB": 245,
      "format": "jpeg"
    },
    "analyzedAt": {
      "date": "2024-01-15",
      "time": "14:30:25"
    }
  }
}
```

#### Get Analysis History
```http
GET /history?limit=10&page=1
```
**Headers:** Authorization required
**Query Parameters:**
- `limit` (optional): Number of entries per page (default: 10)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "entry-id",
        "uploadImageUrl": "https://cloudinary-url/original.jpg",
        "modelResult": "Real",
        "modelGradCamPng": "https://cloudinary-url/heatmap.png",
        "llmReasoning": "Analysis explanation",
        "imageMeta": {
          "width": 1920,
          "height": 1080,
          "sizeKB": 245,
          "format": "jpeg"
        },
        "date": "2024-01-15",
        "time": "14:30:25",
        "createdAt": "2024-01-15T14:30:25.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 10,
      "hasMore": false,
      "total": 5
    }
  }
}
```

#### Get Specific History Entry
```http
GET /history/:id
```
**Headers:** Authorization required
**Response:** Single history entry object

#### Get User Statistics
```http
GET /history/stats
```
**Headers:** Authorization required
**Response:**
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 25,
    "aiGenerated": 12,
    "realImages": 13,
    "lastAnalysis": "2024-01-15T14:30:25.000Z"
  }
}
```

#### Delete History Entry
```http
DELETE /history/:id
```
**Headers:** Authorization required
**Response:**
```json
{
  "success": true,
  "message": "History entry deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "No image file provided"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "History entry not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error during image analysis"
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "message": "AI analysis service is currently unavailable. Please try again later."
}
```

## File Upload Requirements
- **Supported formats:** JPEG, PNG, GIF, WebP, and other image formats
- **Maximum file size:** 10MB
- **Field name:** `image`
- **Content-Type:** `multipart/form-data`

## Environment Variables Required
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env` and fill in values)

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## External Dependencies
- **AI Analysis API:** `https://jenil1236-convnext-gradcam-api.hf.space/predict`
- **Cloudinary:** For image storage
- **Firebase:** For authentication and database
/**
 * @typedef History
 * One image analysis entry
 */

const HistoryModel = {
  uploadImageUrl: "",        // Firebase Storage URL of uploaded image
  modelResult: "",           // "Real" | "AI Generated"
  modelGradCamPng: "",       // URL or filename of grad-cam image

  // llmReasoning: "",          // simple natural language explanation

  imageMeta: {
    width: 0,               // px
    height: 0,              // px
    sizeKB: 0,              // image size
    format: "",             // jpg / png / webp
  },

  date: "",                 // YYYY-MM-DD
  time: "",                 // HH:MM:SS
};

module.exports = HistoryModel;

/**
 * @typedef User
 * Application user model (Firebase Auth + Firestore)
 */

const HistoryModel = require("./history.model");

const UserModel = {
  uid: "",                  // Firebase Auth UID
  username: "",             // display name
  email: "",                // email (from Auth)

  // ⚠️ password exists only in Firebase Auth
  password: "",             // for reference only (NOT stored)

  totalAIGen: 0,            // count of AI-generated detections
  totalRealGen: 0,          // count of Real detections

  history: [HistoryModel],  // analysis history (MVP)

  dailyUploads: 3,          // uploads allowed per day
  lastUploadDate: "",       // YYYY-MM-DD (for rate limiting)

  role: "user",             // user | admin
  isActive: true,           // soft-ban support

  createdAt: "",            // account creation time
  lastLogin: "",            // last login timestamp
};

module.exports = UserModel;

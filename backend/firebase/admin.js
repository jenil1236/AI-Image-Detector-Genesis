const admin = require("firebase-admin");

// 🔐 Service account key (downloaded from Firebase Console)
const serviceAccount = require("../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage().bucket();

module.exports = {
  admin,
  db,
  auth,
  storage,
};

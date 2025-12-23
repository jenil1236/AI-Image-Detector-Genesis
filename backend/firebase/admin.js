const admin = require("firebase-admin");

// 🔐 Service account key (downloaded from Firebase Console)
const serviceAccount = require("../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};
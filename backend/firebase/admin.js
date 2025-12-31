const admin = require("firebase-admin");
const {enableNetwork} = require("firebase/firestore");

// 🔐 Service account key (downloaded from Firebase Console)
const serviceAccount = require("../config/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Explicitly set projectId to avoid ambiguity
    projectId: serviceAccount.project_id,
  });
}

const db = admin.firestore();

// Simplest way to check connectivity in Admin SDK
(async () => {
  try {
    // Attempt to list collections (requires a round-trip to the server)
    await db.listCollections();
    console.log("✅ Firestore is connected and reachable.");
  } catch (err) {
    console.error("❌ Firestore connection failed:", err.message);
  }
})();

const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};
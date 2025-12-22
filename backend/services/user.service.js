const { db, admin } = require("../firebase/admin");

const USERS_COLLECTION = "users";

/* =======================
   Create User (Safe)
======================= */
exports.createUser = async (userData) => {
  const { uid } = userData;
  const userRef = db.collection(USERS_COLLECTION).doc(uid);

  const doc = await userRef.get();
  if (doc.exists) return; // idempotent

  await userRef.set({
    ...userData,
    totalAIGen: 0,
    totalRealGen: 0,
    history: [],
    dailyUploads: 3,
    lastUploadDate: "",
    createdAt: admin.firestore.Timestamp.now(),
    lastLogin: admin.firestore.Timestamp.now(),
  });
};

/* =======================
   Get User
======================= */
exports.getUserByUid = async (uid) => {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  return doc.exists ? doc.data() : null;
};

/* =======================
   Update Last Login
======================= */
exports.updateLastLogin = async (uid) => {
  await db.collection(USERS_COLLECTION).doc(uid).update({
    lastLogin: admin.firestore.Timestamp.now(),
  });
};

/* =======================
   Daily Upload Check
======================= */
exports.canUploadToday = async (uid) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const doc = await userRef.get();
  if (!doc.exists) return false;

  const user = doc.data();
  const today = new Date().toISOString().split("T")[0];

  // First upload ever OR new day
  if (user.lastUploadDate !== today) {
    await userRef.update({
      dailyUploads: 3,
      lastUploadDate: today,
    });
    return true;
  }

  return user.dailyUploads > 0;
};

/* =======================
   Decrement Upload Count
======================= */
exports.decrementDailyUpload = async (uid) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) return;

  const { dailyUploads } = doc.data();
  if (dailyUploads <= 0) return;

  await userRef.update({
    dailyUploads: admin.firestore.FieldValue.increment(-1),
  });
};

/* =======================
   Increment AI / Real Count
======================= */
exports.incrementResultCounter = async (uid, result) => {
  const field =
    result === "AI Generated" ? "totalAIGen" : "totalRealGen";

  await db.collection(USERS_COLLECTION).doc(uid).update({
    [field]: admin.firestore.FieldValue.increment(1),
  });
};

/* =======================
   Add History Entry
======================= */
exports.addHistoryEntry = async (uid, historyEntry) => {
  await db.collection(USERS_COLLECTION).doc(uid).update({
    history: admin.firestore.FieldValue.arrayUnion(historyEntry),
  });
};

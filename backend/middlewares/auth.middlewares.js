const { auth } = require("../firebase/admin");
const userService = require("../services/user.service");

exports.verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await auth.verifyIdToken(token);

    const { uid, email } = decodedToken;

    // Ensure user exists in Firestore
    await userService.createUser({
      uid,
      email,
      username: email?.split("@")[0] || "user",
    });

    // Attach user to request
    req.user = { uid, email };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

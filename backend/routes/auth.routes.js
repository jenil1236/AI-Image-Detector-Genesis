const express = require("express");
const { verifyFirebaseToken } = require("../middlewares/auth.middlewares");
const authController = require("../controllers/auth.controllers");

const router = express.Router();

router.get("/me", verifyFirebaseToken, authController.me);

module.exports = router;

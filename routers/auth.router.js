const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");

router.post("/login", authController.Login);

router.post("/register", authController.Register);

router.post(
  "/send-verification-code",
  authenticate,
  authController.sendVerificationCode
);

router.patch("/verify-email", authenticate, authController.verifyEmail);

module.exports = router;

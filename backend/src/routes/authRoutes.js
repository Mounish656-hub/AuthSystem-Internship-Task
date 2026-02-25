// src/routes/authRoutes.js
const express = require("express");
const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP
} = require("../controllers/authController");

const router = express.Router();

// -------------------- Signup --------------------
router.post("/signup", signupUser);

// -------------------- Login --------------------
router.post("/login", loginUser);

// -------------------- Forgot Password --------------------
router.post("/forgot-password", forgotPassword);

// -------------------- Reset Password --------------------
router.post("/reset-password/:token", resetPassword);

// -------------------- Email OTP --------------------
router.post("/send-email-otp", sendEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);

// -------------------- Phone OTP --------------------
router.post("/send-phone-otp", sendPhoneOTP);
router.post("/verify-phone-otp", verifyPhoneOTP);

module.exports = router;
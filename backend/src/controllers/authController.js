// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// -------------------- Signup Controller --------------------
const signupUser = async (req, res) => {
  const { firstName, lastName, username, phone, email, password } = req.body;
  console.log("Signup request body:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      username,
      phone,
      email,
      password: hashedPassword,
      role: "user",
      accountStatus: "active",
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Login Controller --------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        lastLogin: user.lastLogin
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Forgot Password --------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({
      message: "Password reset token generated",
      resetToken, // for testing purposes
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Reset Password --------------------
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- OTP Generation --------------------
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// -------------------- Email OTP --------------------
const sendEmailOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    user.emailOTP = otp;
    user.emailOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("sendEmailOTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.emailOTP || user.emailOTP !== otp || user.emailOTPExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.emailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmailOTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Phone OTP --------------------
const sendPhoneOTP = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    user.phoneOTP = otp;
    user.phoneOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: user.phone
    });

    res.json({ message: "OTP sent to phone" });
  } catch (error) {
    console.error("sendPhoneOTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyPhoneOTP = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.phoneOTP || user.phoneOTP !== otp || user.phoneOTPExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.phoneVerified = true;
    user.phoneOTP = undefined;
    user.phoneOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Phone verified successfully" });
  } catch (error) {
    console.error("verifyPhoneOTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Exports --------------------
module.exports = {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP
};
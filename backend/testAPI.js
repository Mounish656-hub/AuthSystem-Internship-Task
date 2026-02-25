// testApi.js
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const User = require("./src/models/User"); // adjust path if needed
require("dotenv").config(); // load .env variables

// -------------------- Connect to MongoDB --------------------
async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
}

// -------------------- Signup --------------------
async function testSignup(email, password) {
  const res = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Test",
      lastName: "User",
      username: "testuser_" + Date.now(),
      phone: "1234567890",
      email,
      password
    })
  });
  const data = await res.json();
  console.log("Signup Response:", data);
}

// -------------------- Send Email OTP --------------------
async function testSendEmailOTP(email) {
  const res = await fetch("http://localhost:5000/api/auth/send-email-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  console.log("Send Email OTP Response:", data);
}

// -------------------- Verify Email OTP --------------------
async function testVerifyEmailOTP(email) {
  const user = await User.findOne({ email });
  if (!user || !user.emailOTP) {
    console.log("No Email OTP found in DB for this user");
    return;
  }

  const otp = user.emailOTP;
  console.log("Fetched Email OTP from DB:", otp);

  const res = await fetch("http://localhost:5000/api/auth/verify-email-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json();
  console.log("Verify Email OTP Response:", data);
}

// -------------------- Send Phone OTP --------------------
async function testSendPhoneOTP(phone) {
  const res = await fetch("http://localhost:5000/api/auth/send-phone-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  console.log("Send Phone OTP Response:", data);
}

// -------------------- Verify Phone OTP --------------------
async function testVerifyPhoneOTP(phone) {
  const user = await User.findOne({ phone });
  if (!user || !user.phoneOTP) {
    console.log("No Phone OTP found in DB for this user");
    return;
  }

  const otp = user.phoneOTP;
  console.log("Fetched Phone OTP from DB:", otp);

  const res = await fetch("http://localhost:5000/api/auth/verify-phone-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp })
  });
  const data = await res.json();
  console.log("Verify Phone OTP Response:", data);
}

// -------------------- Login --------------------
async function testLogin(email, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  console.log("Login Response:", data);
}

// -------------------- Forgot Password --------------------
async function testForgotPassword(email) {
  const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  console.log("Forgot Password Response:", data);
  return data.resetToken; // return reset token for next step
}

// -------------------- Reset Password --------------------
async function testResetPassword(token, newPassword) {
  const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword })
  });
  const data = await res.json();
  console.log("Reset Password Response:", data);
}

// -------------------- Run Tests --------------------
(async () => {
  try {
    await connectDB();

    const testEmail = "testuser" + Date.now() + "@gmail.com"; // unique email each run
    const testPassword = "Password123!";
    const newPassword = "NewPassword123!";
    const testPhone = "1234567890"; // static test phone

    // Signup
    await testSignup(testEmail, testPassword);

    // Email OTP flow
    await testSendEmailOTP(testEmail);
    await testVerifyEmailOTP(testEmail);

    // Phone OTP flow
    await testSendPhoneOTP(testPhone);
    await testVerifyPhoneOTP(testPhone);

    // Login with original password
    await testLogin(testEmail, testPassword);

    // Forgot/reset password flow
    const resetToken = await testForgotPassword(testEmail);
    if (resetToken) {
      await testResetPassword(resetToken, newPassword);
      await testLogin(testEmail, newPassword); // login with new password
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("Error running tests:", err);
    mongoose.connection.close();
  }
})();
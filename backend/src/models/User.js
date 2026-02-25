const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String, unique: true, required: true }, // NEW
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // NEW
  accountStatus: { type: String, enum: ["active", "suspended"], default: "active" }, // NEW
  emailVerified: { type: Boolean, default: false }, // NEW
  phoneVerified: { type: Boolean, default: false }, // NEW
  createdAt: { type: Date, default: Date.now }, // NEW
  lastLogin: { type: Date }, // NEW
  resetToken: { type: String }, // already used in forgot/reset
  resetTokenExpiry: { type: Date }, // already used in forgot/reset
  emailOTP: { type: String },
  emailOTPExpiry: { type: Date },
  phoneOTP: { type: String },
  phoneOTPExpiry: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
// Switch to your database (case-sensitive!)
use("authSystem")

// 1List all users
// db.users.find().pretty()

// // Show only emails and OTPs
// db.users.find(
//   {},
//   { email: 1, emailOTP: 1, phoneOTP: 1, _id: 0 }
// )
// db.users.find({}, { email: 1, emailOTP: 1, phone: 1, phoneOTP: 1, _id: 0 })

// // Show only emails and reset tokens
// db.users.find(
//   {},
//   { email: 1, resetToken: 1, _id: 0 }
// )

// Find a specific user by email
// db.users.find({ email: "test@gmail.com" })


db.users.find({}, {
  email: 1,
  emailOTP: 1,
  phoneOTP: 1,
  resetToken: 1,
  emailVerified: 1,
  phoneVerified: 1,
  lastLogin: 1,
  _id: 0
})
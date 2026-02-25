```markdown
# AuthSystem Backend

A simple Node.js + Express + MongoDB authentication system built for learning purposes.  
Features include **Signup, Login, Forgot/Reset Password, JWT Authentication, and a Protected Dashboard route**.

---

## 🚀 Features
- User Signup & Login
- Password hashing with bcrypt
- Forgot/Reset password flow with token
- JWT authentication & middleware
- Protected dashboard route
- Modular project structure

---

## 📂 Project Structure
```
backend/
 └── src/
     ├── config/
     │    └── db.js
     ├── controllers/
     │    └── authController.js
     ├── middleware/
     │    ├── authMiddleware.js
     │    └── errorMiddleware.js
     ├── models/
     │    └── User.js
     ├── routes/
     │    ├── authRoutes.js
     │    └── dashboardRoutes.js
     ├── utils/
     │    └── generateToken.js
     └── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/AuthSystem.git
cd AuthSystem/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/authSystem
JWT_SECRET=your_jwt_secret_key_here
```

*(Use MongoDB Atlas URI if you prefer cloud instead of local MongoDB.)*

### 4. Run the Server
```bash
node src/server.js
```
or (if nodemon is installed):
```bash
npm run dev
```

---

## 🧪 API Endpoints

### Auth Routes
- `POST /api/auth/signup` → Register new user
- `POST /api/auth/login` → Login existing user
- `POST /api/auth/forgot-password` → Generate reset token
- `POST /api/auth/reset-password/:token` → Reset password

### Dashboard Route
- `GET /api/dashboard` → Protected route (requires JWT in header)

---

## 🔑 Usage Example

### Login → Get Token
```json
{
  "email": "ranjith@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "12345",
    "name": "Ranjith",
    "email": "ranjith@example.com"
  }
}
```

### Access Dashboard
Send request with header:
```
Authorization: Bearer <jwt_token_here>
```

---

## ✅ Testing Checklist

1. **Start Services**
   - Run MongoDB (`mongod` or Atlas cluster).
   - Start backend server (`node src/server.js`).

2. **Signup**
   - `POST /api/auth/signup` → expect user created + JWT.

3. **Login**
   - `POST /api/auth/login` → expect login success + JWT.

4. **Forgot Password**
   - `POST /api/auth/forgot-password` → expect reset token.

5. **Reset Password**
   - `POST /api/auth/reset-password/:token` → expect success.

6. **Dashboard**
   - `GET /api/dashboard` with JWT → expect welcome message + user info.

7. **Negative Tests**
   - Duplicate signup → error.
   - Wrong password → error.
   - Dashboard without token → error.
   - Expired/invalid reset token → error.

---

## 🔄 Authentication Flow

```
[ Client (Thunder Client / Browser / PowerShell) ]
        |
        v
+-------------------+
|   Signup Request  |
| POST /api/auth/signup |
+-------------------+
        |
        v
[ Backend Controller -> User Model -> MongoDB ]
        |
        v
{ Response: User created + JWT token }

--------------------------------------------------

[ Client ]
        |
        v
+-------------------+
|   Login Request   |
| POST /api/auth/login |
+-------------------+
        |
        v
[ Backend Controller -> Verify password -> Generate JWT ]
        |
        v
{ Response: Login successful + JWT token }

--------------------------------------------------

[ Client ]
        |
        v
+-------------------+
|   JWT Middleware  |
| Protect Routes    |
+-------------------+
        |
        v
[ Middleware checks "Authorization: Bearer <token>" ]
        |
        +--> Valid token → attach user → continue
        |
        +--> Invalid/missing token → error response

--------------------------------------------------

[ Client ]
        |
        v
+-------------------+
| Dashboard Request |
| GET /api/dashboard |
+-------------------+
        |
        v
[ JWT Middleware verifies token ]
        |
        v
{ Response: "Welcome to your dashboard", user info }
```

---

## 🔄 Forgot/Reset Password Flow

```
[ Client (Thunder Client / Browser / PowerShell) ]
        |
        v
+---------------------------+
| Forgot Password Request   |
| POST /api/auth/forgot-password |
+---------------------------+
        |
        v
[ Backend Controller -> User Model -> MongoDB ]
        |
        v
{ Response: Reset token generated (returned in JSON for testing) }

--------------------------------------------------

[ Client ]
        |
        v
+---------------------------+
| Reset Password Request    |
| POST /api/auth/reset-password/:token |
+---------------------------+
        |
        v
[ Backend Controller -> Verify token + expiry -> Hash new password ]
        |
        v
{ Response: "Password reset successful" }

--------------------------------------------------

[ Client ]
        |
        v
+---------------------------+
| Login with New Password   |
| POST /api/auth/login      |
+---------------------------+
        |
        v
[ Backend Controller -> Verify new password -> Generate JWT ]
        |
        v
{ Response: Login successful + new JWT token }
```



import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthModal.css";

function AuthModal() {
  const [mode, setMode] = useState("signin"); // signup | signin | forgot | reset
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",   // NEW FIELD
    email: "",
    phone: "",
    password: "",
  });

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      let url = "";
      let payload = {};

      if (mode === "signup") {
        url = "http://localhost:5000/api/auth/signup";
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,   // include username
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        };
      } else if (mode === "signin") {
        url = "http://localhost:5000/api/auth/login";
        payload = { email: formData.email, password: formData.password };
      } else if (mode === "forgot") {
        url = "http://localhost:5000/api/auth/forgot-password";
        payload = { email: formData.email };
      } else if (mode === "reset") {
        url = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
        payload = { password: newPassword };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${mode} successful!`);
        if (data.token) localStorage.setItem("token", data.token);
        console.log("Response:", data);
        console.log("Token:", data.token);
        console.log("User:", data.user);
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error(`${mode} failed:`, error);
      alert(`${mode} failed. Check console for details.`);
    }
  };

  return (
    <div className="background">
      <div className="modal">
        <div className="switch">
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
          <button
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            className={mode === "forgot" ? "active" : ""}
            onClick={() => setMode("forgot")}
          >
            Forgot Password
          </button>
          <button
            className={mode === "reset" ? "active" : ""}
            onClick={() => setMode("reset")}
          >
            Reset Password
          </button>
        </div>

        {/* Signup UI */}
        {mode === "signup" && (
          <>
            <h2>Create an account</h2>
            <div className="row">
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
            />
            <div className="phone">
              <span>🇺🇸</span>
              <input
                type="text"
                name="phone"
                placeholder="(775) 351-6501"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button className="create-btn" onClick={handleSubmit}>
              Create an account
            </button>
            <div className="divider">
              <span>OR SIGN IN WITH</span>
            </div>
            <div className="social">
              <button className="social-btn">G</button>
              <button className="social-btn"></button>
            </div>
            <p className="terms">
              By creating an account, you agree to our Terms & Service
            </p>
          </>
        )}

        {/* Signin UI */}
        {mode === "signin" && (
          <>
            <h2>Sign in to your account</h2>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button className="create-btn" onClick={handleSubmit}>
              Sign in
            </button>
            <p>
              Forgot your password?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setMode("forgot")}
              >
                Click here
              </span>
            </p>
          </>
        )}

        {/* Forgot Password UI */}
        {mode === "forgot" && (
          <>
            <h2>Forgot Password</h2>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            <button className="create-btn" onClick={handleSubmit}>
              Send reset link
            </button>
          </>
        )}

        {/* Reset Password UI */}
        {mode === "reset" && (
          <>
            <h2>Reset Password</h2>
            <input
              type="text"
              placeholder="Enter reset token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="create-btn" onClick={handleSubmit}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Reset token generated! (for testing): " + data.resetToken);
        console.log("Forgot Password Response:", data);
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Forgot password failed:", error);
      alert("Forgot password failed. Check console for details.");
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Send reset link</button>
    </div>
  );
}

export default ForgotPassword;
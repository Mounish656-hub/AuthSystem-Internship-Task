import { useState } from "react";

function ResetPassword() {
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${resetToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successful!");
        console.log("Reset Password Response:", data);
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Reset password failed:", error);
      alert("Reset password failed. Check console for details.");
    }
  };

  return (
    <div className="reset-password">
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
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
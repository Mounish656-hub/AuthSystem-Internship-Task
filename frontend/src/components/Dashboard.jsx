import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login first.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          setError(data.error || data.message);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Dashboard fetch failed. Check console for details.");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      <h2>Welcome to your dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </>
      ) : (
        !error && <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Dashboard;
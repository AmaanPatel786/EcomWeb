import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // for navigation after login success

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before a new attempt

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email: email, // Changed to "email" to match your backend
        password: password,
      });

      const {token: accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleLogin} style={{ width: "300px" }}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
          }}
        >
          Login
        </button>
        <p>
          Don't have an account? <Link to="/signup">Signup here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

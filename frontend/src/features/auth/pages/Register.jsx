import React from "react";
import "../auth.form.css";
import "../../../style/button.css";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await handleRegister(username, email, password);
      navigate("/");
    } catch (err) {
      console.error("Registration failed", err);
      setErrorMsg(
        err.response?.data?.message || 
        err.message || 
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <main>
      <div className="form-container">
        <h1 className="form-title">Register</h1>

        {errorMsg && (
          <div style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #f87171",
            borderRadius: "6px",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={loading} className="btn-primary" type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

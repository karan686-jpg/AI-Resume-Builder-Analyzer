import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth.context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await handleLogin(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
      <div className="w-full max-w-sm bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h1 className="text-xl font-bold mb-4">Sign In</h1>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-lg text-xs mb-3">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-blue-500"
              placeholder="karan@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail("karan.datta@example.com");
              setPassword("password123");
            }}
            className="w-full py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
          >
            Demo Credentials Fill
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

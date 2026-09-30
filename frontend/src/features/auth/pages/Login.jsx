import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

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
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setErrorMsg(
        err.response?.data?.message || 
        err.message || 
        "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090e] px-4 py-8">
      <div className="w-full max-w-[420px] bg-black/95 text-white p-8 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-tight text-white">Login</h1>
        
        {errorMsg && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-400 px-4 py-2.5 rounded-lg mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-red-500 hover:bg-red-600 active:bg-[#e37312] text-white font-medium rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 hover:underline font-medium transition-colors">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

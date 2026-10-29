import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/auth.context";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between">
      {/* Navbar */}
      <nav className="max-w-4xl w-full mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div
          onClick={() => navigate("/")}
          className="font-bold text-base text-white tracking-tight cursor-pointer"
        >
          ✦ ResumeCraft
        </div>

        <button
          onClick={() => navigate(user ? "/dashboard" : "/login")}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          {user ? "Dashboard" : "Sign In"}
        </button>
      </nav>

      {/* Main Hero & Portals */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
          AI Resume Builder &amp; ATS Preparation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          In-browser Web Worker ATS scanner (0 LLM tokens) and Gemini AI interview roadmap generator for Tier-1 SDE CDC placements.
        </p>

        {/* 2 Core Action Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Pillar 1: Resume Builder & ATS */}
          <div
            onClick={() => navigate("/builder")}
            className="p-5 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer transition-colors"
          >
            <div className="text-blue-400 font-bold text-sm mb-1">🛠️ Resume Builder &amp; ATS</div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Build your resume with live preview, clean print export, and instant Web Worker ATS scoring against target job descriptions.
            </p>
            <span className="text-xs font-semibold text-blue-400">Open Builder →</span>
          </div>

          {/* Pillar 2: AI Analyzer */}
          <div
            onClick={() => navigate("/analyze")}
            className="p-5 bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-xl cursor-pointer transition-colors"
          >
            <div className="text-purple-400 font-bold text-sm mb-1">🎯 AI Resume &amp; Interview Prep</div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Upload a resume PDF to extract text via pdf-parse and generate custom technical Q&amp;A, skill-gap analysis, and a 7-day study roadmap.
            </p>
            <span className="text-xs font-semibold text-purple-400">Analyze PDF →</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-500 border-t border-slate-800">
        IIT Kharagpur CDC Placement 2026 • AI Resume &amp; ATS Engine
      </footer>
    </div>
  );
};

export default Home;

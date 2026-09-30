import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { FileText, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#060614] text-slate-200 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Animated background glow blobs */}
      <div className="fixed -top-36 -left-48 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 -right-36 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />

      {/* ---- Navbar strip ---- */}
      <nav className="relative z-20 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-lg text-white tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <FileText size={18} />
          </div>
          <span>ResumeCraft</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors hidden sm:inline">How it works</a>
          <a href="#features" className="hover:text-white transition-colors hidden sm:inline">Features</a>
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
            onClick={() => navigate(user ? "/builder" : "/register")}
          >
            {user ? "Go to Builder" : "Get Started Free"}
          </button>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <div className="relative z-10 max-w-4xl mx-auto text-center pt-16 pb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 font-medium mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          ATS-Optimized • 100% Free • No Credit Card
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
          Land Your Dream Job with an{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            ATS-Optimized
          </span>{" "}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
            Resume
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-10">
          Identify skill gaps against real job postings or build an employer-ready
          resume from scratch with recruiter-tested templates.
        </p>

        {/* Stats strip */}
        <div className="inline-flex items-center justify-center gap-6 sm:gap-10 p-3.5 sm:px-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">50+</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">ATS Heuristics</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">0 Tokens</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Web Worker</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">3-Tier</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">AI Gateway</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">7-Day</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Prep Roadmap</span>
          </div>
        </div>
      </div>

      {/* ---- Two Feature Cards ---- */}
      <div id="features" className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        {/* Card 1: Analyze */}
        <div
          className="group relative p-8 rounded-3xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
          onClick={() => navigate("/analyze")}
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              <span>🔍</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-purple-300 transition-colors">
              Resume Analyzer
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-light">
              Upload your resume and paste a target job description. Identify missing
              competencies, anticipate interview questions, and follow a clear preparation roadmap.
            </p>
            <ul className="space-y-2.5 mb-8 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">✓</span> Targeted skill gap analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">✓</span> Role-specific interview questions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">✓</span> Keyword &amp; ATS compatibility score
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">✓</span> PDF format extraction
              </li>
            </ul>
          </div>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer">
            Analyze My Resume <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 2: Build */}
        <div
          className="group relative p-8 rounded-3xl bg-slate-900/60 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
          onClick={() => navigate("/builder")}
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
              <span>🛠️</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors">
              Resume Builder
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-light">
              Create a professional resume in minutes. Pick from proven executive
              templates, customize accents and typography, and export clean PDFs.
            </p>
            <ul className="space-y-2.5 mb-8 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</span> Recruiter-tested Modern layout
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</span> In-browser ATS scoring (0 tokens)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</span> 56 powerhouse action verbs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</span> One-click PDF export
              </li>
            </ul>
          </div>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer">
            Build My Resume <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ---- How it works ---- */}
      <div id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">How It Works</h2>
        <p className="text-sm text-slate-400 mb-12">Three simple steps to your interview-ready resume</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-xs font-mono font-bold text-slate-500 mb-2">01</div>
            <div className="text-2xl mb-3">📝</div>
            <h3 className="text-base font-bold text-white mb-2">Fill Your Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Enter your experience, education, and skills using our clean, structured editor.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-xs font-mono font-bold text-slate-500 mb-2">02</div>
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-base font-bold text-white mb-2">Scan with Web Worker</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Evaluate your resume against 50+ heuristic checks in a background thread with zero token cost.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="text-xs font-mono font-bold text-slate-500 mb-2">03</div>
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-base font-bold text-white mb-2">Download &amp; Apply</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Refine your bullet points with action verbs, then export a crisp PDF ready for job applications.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="font-bold text-slate-400">ResumeCraft</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Help</a>
        </div>
        <div>© 2025 ResumeCraft. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;

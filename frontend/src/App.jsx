import { useState } from "react";
import ResumeBuilder from "./components/ResumeBuilder";
import InterviewAnalyzer from "./components/InterviewAnalyzer";

export default function App() {
  const [view, setView] = useState("builder"); // "builder" | "analyzer"

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-slate-900">
      <header className="border-b border-slate-800 bg-slate-950/60 px-6 py-3 print:hidden">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="font-bold text-sm text-white tracking-tight">
            AI Resume Builder &amp; Interview Gateway
          </div>
          <nav className="flex gap-2">
            <button
              onClick={() => setView("builder")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer ${
                view === "builder"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Resume Builder &amp; Web Worker ATS
            </button>
            <button
              onClick={() => setView("analyzer")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer ${
                view === "analyzer"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              AI PDF Analyzer &amp; Prep
            </button>
          </nav>
        </div>
      </header>

      <main>{view === "builder" ? <ResumeBuilder /> : <InterviewAnalyzer />}</main>
    </div>
  );
}

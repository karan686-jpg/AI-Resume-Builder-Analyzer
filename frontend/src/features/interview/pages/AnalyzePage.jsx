import React, { useState, useEffect, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

import { LoadingScreen } from "../../../components/ui/LoadingScreen";

// Resume Analyzer: uploads resume + job description to generate interview plan
const AnalyzePage = () => {
  const { loading, generateReport, reports, getReports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, [getReports]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setErrorMsg(""); // clear error on new file
    }
  };

  const handleGenerateReport = async () => {
    try {
      setErrorMsg("");
      const selectedFile = resumeInputRef.current?.files[0];

      if (!selectedFile && !selfDescription.trim()) {
        setErrorMsg(
          "Please either upload a resume OR provide a self description!"
        );
        return;
      }

      if (!jobDescription.trim()) {
        setErrorMsg("Please provide a Target Job Description!");
        return;
      }

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: selectedFile,
      });

      navigate(`/interview/${data._id}`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate report."
      );
    }
  };

  if (loading) {
    return <LoadingScreen message="Generating your AI interview strategy & roadmap..." />;
  }

  return (
    <div className="min-h-screen bg-[#09090e] text-white pb-16 font-sans relative overflow-x-hidden">
      {/* Background glow accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HERO */}
      <header className="text-center pt-14 pb-8 px-4 max-w-4xl mx-auto relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 text-xs font-medium mb-6 transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-white">
          Resume{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Analyzer
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
          Upload your resume and paste the job description. Our AI generates
          interview questions, skill gap analysis, and a study roadmap
          instantly.
        </p>

        {errorMsg && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-5 py-2.5 rounded-xl mt-5 inline-block text-xs shadow-lg">
            ⚠️ {errorMsg}
          </div>
        )}
      </header>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto my-6 px-4 relative z-10">
        <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT PANEL */}
          <div className="flex flex-col">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-300 mb-2">
              Target Job Description
            </h2>
            <textarea
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={5000}
              className="w-full h-56 p-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all leading-relaxed"
            />
            <div className="text-right text-[11px] font-mono text-slate-500 mt-1.5">
              {jobDescription.length} / 5000
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-300 mb-2">
              Your Profile
            </h2>

            {/* UPLOAD */}
            <label className="block cursor-pointer">
              <input
                type="file"
                hidden
                ref={resumeInputRef}
                accept=".pdf"
                onChange={handleFileChange}
              />
              <div
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center min-h-[110px] ${
                  resumeFile
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-white/15 bg-white/[0.02] hover:border-pink-500/50 hover:bg-white/[0.04]"
                }`}
              >
                {resumeFile ? (
                  <>
                    <p className="text-sm font-bold text-emerald-400">{resumeFile.name}</p>
                    <span className="text-[11px] text-slate-400 mt-1">Click to change file</span>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-200">Upload Resume</p>
                    <span className="text-[11px] text-slate-400 mt-0.5">PDF Format (Max 5MB)</span>
                  </>
                )}
              </div>
            </label>

            <div className="flex items-center justify-center my-3 relative">
              <div className="w-full h-[1px] bg-white/10" />
              <span className="absolute px-3 text-[10px] font-bold text-slate-400 bg-[#09090e] border border-white/10 rounded-full uppercase">
                OR
              </span>
            </div>

            {/* SELF DESCRIPTION */}
            <textarea
              placeholder="Write a short self description..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              className="w-full h-28 p-3.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-center px-4 relative z-10">
        <button
          className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-semibold text-sm rounded-2xl shadow-xl shadow-pink-500/25 transition-all cursor-pointer"
          onClick={handleGenerateReport}
        >
          🎯 Generate Interview Strategy
        </button>
      </div>

      {/* RECENT REPORTS */}
      {reports.length > 0 && (
        <section className="max-w-4xl mx-auto mt-12 px-4 relative z-10">
          <h2 className="text-lg font-bold text-white mb-4 tracking-tight">Recent Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                    {report.title || "Untitled Role"}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      report.matchScore >= 80
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                        : report.matchScore >= 60
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
                        : "text-rose-400 bg-rose-500/10 border-rose-500/25"
                    }`}
                  >
                    {report.matchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="flex justify-center gap-6 mt-16 text-xs text-slate-500 relative z-10">
        <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
        <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
        <a href="#" className="hover:text-slate-300 transition-colors">Help</a>
      </footer>
    </div>
  );
};

export default AnalyzePage;

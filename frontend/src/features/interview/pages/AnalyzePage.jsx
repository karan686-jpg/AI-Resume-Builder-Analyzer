import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../interview.context";

export const AnalyzePage = () => {
  const { generateReport, loading } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setErrorMsg("");
    const file = fileInputRef.current?.files?.[0];

    if (!file && !selfDescription.trim()) {
      setErrorMsg("Please upload a resume PDF or provide a self-description.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMsg("Please paste a target job description.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: file,
      });
      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to generate report");
    }
  };

  const handleLoadSample = () => {
    setJobDescription(
      "Full Stack Developer proficient in React, Node.js, Express, MongoDB, and REST APIs. Experience with Docker, Redis, CI/CD pipelines, Git, and automated unit testing is a plus. Strong problem-solving and communication skills required."
    );
    setSelfDescription(
      "Results-driven Full Stack Engineer with experience building performant web apps in React, Node.js, and Express. Built an in-browser ATS scoring engine using Web Workers and engineered an Express 5 AI gateway with JSON schema validation."
    );
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h1 className="text-xl font-bold">Resume Analyzer &amp; Interview Prep</h1>
            <p className="text-xs text-slate-400">
              Upload a resume PDF to run automated text extraction and generate custom Q&amp;A + 7-day roadmap.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer"
          >
            ← Workspace
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl mb-4">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Demo Fill */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer"
          >
            ⚡ Quick Fill Sample Profile &amp; Role
          </button>
        </div>

        {/* Main Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Target Job Description */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col">
            <label className="text-xs font-bold text-slate-300 uppercase mb-2">
              Target Job Description
            </label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description requirements here..."
              className="w-full flex-1 text-xs p-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Profile Input: Upload PDF or Self-Description */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase">
              Candidate Resume
            </label>

            <div className="border border-dashed border-slate-600 rounded-lg p-4 text-center bg-slate-900/50">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white cursor-pointer"
              />
              {resumeFile && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">Selected: {resumeFile.name}</p>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-500 uppercase font-bold">OR</div>

            <textarea
              rows={3}
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Paste self-description or key technical projects..."
              className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Generating AI Interview Strategy..." : "🎯 Generate Interview Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;

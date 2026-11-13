import { useState, useRef } from "react";
import { SAMPLE_JD, SAMPLE_RESUME } from "../data/sampleResume";
import { resumeToText } from "../ats/atsEngine";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function InterviewAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [report, setReport] = useState(null);
  const fileInputRef = useRef(null);

  const handleQuickFill = () => {
    setJobDescription(SAMPLE_JD);
    setSelfDescription(
      `${SAMPLE_RESUME.professionalSummary}\n\nProjects:\n${SAMPLE_RESUME.projects
        .map((p) => `${p.title} (${p.techStack}): ${p.description}`)
        .join("\n")}`
    );
    setErrorMsg("");
  };

  const handleUseBuilderResume = () => {
    try {
      const saved = localStorage.getItem("resume_builder_data");
      const resumeObj = saved ? JSON.parse(saved) : SAMPLE_RESUME;
      setSelfDescription(resumeToText(resumeObj));
      if (!jobDescription.trim()) setJobDescription(SAMPLE_JD);
      setErrorMsg("");
    } catch {
      handleQuickFill();
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const file = fileInputRef.current?.files?.[0] || resumeFile;
    if (!jobDescription.trim()) {
      setErrorMsg("Please paste a target job description.");
      return;
    }
    if (!file && !selfDescription.trim()) {
      setErrorMsg("Please upload a resume PDF or enter a candidate summary.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      formData.append("selfDescription", selfDescription);

      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate interview plan");
      }
      setReport(data.interviewReport);
    } catch (err) {
      setErrorMsg(err.message || "Unable to reach Express 5 AI Gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Quick Fill */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">AI PDF Analyzer &amp; Interview Prep</h2>
          <p className="text-xs text-slate-400">
            In-memory pdf-parse extraction + Express 5 Gemini AI gateway with JSON Schema validation &amp; 3-tier fallback.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUseBuilderResume}
            className="text-xs px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/20 cursor-pointer"
          >
            Use Current Builder Resume
          </button>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/20 cursor-pointer"
          >
            Quick Fill Sample
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex flex-col">
            <label className="text-xs font-bold uppercase text-slate-300 mb-2">
              Target Job Description
            </label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description here..."
              className="w-full flex-1 text-xs p-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex flex-col space-y-3">
            <label className="text-xs font-bold uppercase text-slate-300">
              Candidate Resume (PDF or Text)
            </label>
            <div className="border border-dashed border-slate-600 rounded-lg p-4 text-center bg-slate-900/60">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white cursor-pointer"
              />
              {resumeFile && (
                <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                  <span className="text-emerald-400 font-medium">
                    Selected PDF: {resumeFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <textarea
              rows={4}
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Optional: Paste summary or extra project context..."
              className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl cursor-pointer disabled:opacity-50"
          >
            {loading ? "Extracting PDF & Generating AI Strategy..." : "Generate AI Interview Plan"}
          </button>
        </div>
      </form>

      {/* Generated AI Report */}
      {report && (
        <div className="space-y-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{report.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Custom Q&amp;A, Skill-Gap Analysis &amp; 7-Day Preparation Roadmap
              </p>
            </div>
            <span
              className={`text-xl font-bold font-mono px-3 py-1 rounded-lg ${
                report.matchScore >= 80
                  ? "text-emerald-400 bg-emerald-500/10"
                  : report.matchScore >= 60
                  ? "text-amber-400 bg-amber-500/10"
                  : "text-rose-400 bg-rose-500/10"
              }`}
            >
              {report.matchScore}% Match
            </span>
          </div>

          {report.skillGaps?.length > 0 && (
            <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase text-slate-300 mb-3">Skill-Gap Analysis</h4>
              <div className="flex flex-wrap gap-2">
                {report.skillGaps.map((gap, i) => (
                  <div
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-md border ${
                      gap.severity === "high"
                        ? "text-rose-300 bg-rose-500/10 border-rose-500/30"
                        : gap.severity === "low"
                        ? "text-blue-300 bg-blue-500/10 border-blue-500/30"
                        : "text-amber-300 bg-amber-500/10 border-amber-500/30"
                    }`}
                  >
                    <span className="font-semibold">{gap.skillName}</span>
                    {gap.description && <span className="opacity-80 ml-1">({gap.description})</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {report.preparationPlan?.length > 0 && (
            <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase text-slate-300 mb-3">
                7-Day Preparation Roadmap
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.preparationPlan.map((day, i) => (
                  <div key={i} className="p-3 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <div className="text-xs font-bold text-purple-300 mb-1">
                      Day {day.day}: {day.focus || day.title}
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      {(day.tasks || []).map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {[
            ["Technical Interview Q&A", report.technicalQuestions],
            ["Behavioral Q&A (STAR)", report.behavioralQuestions],
          ].map(([heading, items]) =>
            items?.length > 0 ? (
              <section key={heading} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <h4 className="text-xs font-bold uppercase text-slate-300 mb-3">
                  {heading} ({items.length})
                </h4>
                <div className="space-y-3">
                  {items.map((q, i) => (
                    <div key={i} className="p-3 bg-slate-900/70 border border-slate-700 rounded-lg space-y-1.5 text-xs">
                      <div className="font-bold text-white">
                        Q{i + 1}: {q.question}
                      </div>
                      <div className="text-indigo-300">
                        <span className="font-semibold">Intention:</span> {q.intention}
                      </div>
                      <div className="text-slate-300 bg-black/30 p-2 rounded border border-slate-800">
                        <span className="font-semibold text-emerald-400">Model Answer:</span> {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}


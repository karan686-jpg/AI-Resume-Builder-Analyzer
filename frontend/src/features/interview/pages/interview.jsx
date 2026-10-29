import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useInterview } from "../interview.context";

export const Interview = () => {
  const { report, getReportById, loading } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  if (loading || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300 text-sm">
        Loading interview plan...
      </div>
    );
  }

  const score = report.matchScore ?? 0;
  const preparationPlan = (report.preparationPlan || []).filter(Boolean);
  const skillGaps = (report.skillGaps || []).filter(Boolean);
  const technicalQuestions = (report.technicalQuestions || []).filter(Boolean);
  const behavioralQuestions = (report.behavioralQuestions || []).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer"
          >
            ← Workspace
          </button>
        </div>


        {/* Overview Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{report.title || "Interview Strategy Plan"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated AI Interview Preparation &amp; Roadmap</p>
          </div>
          <div className="text-right">
            <span
              className={`text-2xl font-bold font-mono px-3 py-1 rounded-lg ${
                score >= 80 ? "text-emerald-400 bg-emerald-500/10" : score >= 60 ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"
              }`}
            >
              {score}% Match
            </span>
          </div>
        </div>

        {/* Skill Gaps */}
        {skillGaps.length > 0 && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xs font-bold text-slate-300 uppercase mb-3">Identified Skill Gaps</h2>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((gap, i) => (
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
                  <span className="font-semibold">{gap.skillName || gap.skill || "Skill"}</span>
                  {gap.description && <span className="opacity-75 ml-1">({gap.description})</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7-Day Roadmap */}
        {preparationPlan.length > 0 && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xs font-bold text-slate-300 uppercase mb-3">7-Day Preparation Roadmap</h2>
            <div className="space-y-3">
              {preparationPlan.map((day, i) => (
                <div key={day.day || i} className="p-3 bg-slate-900/60 border border-slate-700 rounded-lg">
                  <div className="text-xs font-bold text-purple-300 mb-1">
                    Day {day.day || i + 1}: {day.focus || day.title}
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {(day.tasks || []).map((t, idx) => (
                      <li key={idx}>{typeof t === "string" ? t : t.task || JSON.stringify(t)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Questions */}
        {technicalQuestions.length > 0 && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xs font-bold text-slate-300 uppercase mb-3">Technical Questions ({technicalQuestions.length})</h2>
            <div className="space-y-3">
              {technicalQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-slate-900/60 border border-slate-700 rounded-lg space-y-1.5 text-xs">
                  <div className="font-bold text-white">Q{i + 1}: {q.question || q.title}</div>
                  <div className="text-indigo-300"><span className="font-semibold">Intention:</span> {q.intention}</div>
                  <div className="text-slate-300 bg-black/30 p-2 rounded border border-slate-800"><span className="font-semibold text-emerald-400">Model Answer:</span> {q.answer}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Behavioral Questions */}
        {behavioralQuestions.length > 0 && (
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xs font-bold text-slate-300 uppercase mb-3">Behavioral Questions ({behavioralQuestions.length})</h2>
            <div className="space-y-3">
              {behavioralQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-slate-900/60 border border-slate-700 rounded-lg space-y-1.5 text-xs">
                  <div className="font-bold text-white">Q{i + 1}: {q.question || q.title}</div>
                  <div className="text-indigo-300"><span className="font-semibold">Intention:</span> {q.intention}</div>
                  <div className="text-slate-300 bg-black/30 p-2 rounded border border-slate-800"><span className="font-semibold text-emerald-400">Model Answer:</span> {q.answer}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Interview;

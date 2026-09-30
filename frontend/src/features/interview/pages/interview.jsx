import React, { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams } from "react-router";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import QuestionSection from "../components/QuestionSection";
import RoadmapDayCard from "../components/RoadmapDayCard";
import { Code2, Users, Compass, Download } from "lucide-react";

const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: Users },
  { id: "roadmap", label: "Road Map", icon: Compass },
];

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  if (loading || !report) {
    return <LoadingScreen message="Loading your customized interview plan..." />;
  }

  const scoreHigh = report.matchScore >= 80;
  const scoreMid = report.matchScore >= 60 && report.matchScore < 80;

  return (
    <div className="min-h-screen bg-[#09090e] text-white p-4 sm:p-8 font-sans selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6 p-6 sm:p-8 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
        {/* ── Left Nav ── */}
        <nav className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-3 px-1">
              Sections
            </p>
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeNav === item.id
                        ? "bg-gradient-to-r from-pink-500/15 to-rose-500/15 border border-pink-500/30 text-pink-300 font-semibold shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => getResumePdf(interviewId)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
          >
            <Download size={14} />
            Download Resume
          </button>
        </nav>

        {/* ── Center Content ── */}
        <main className="min-w-0 border-t lg:border-t-0 lg:border-x border-white/10 lg:px-6 pt-6 lg:pt-0">
          {activeNav === "technical" && (
            <QuestionSection
              title="Technical Questions"
              questions={report.technicalQuestions}
            />
          )}

          {activeNav === "behavioral" && (
            <QuestionSection
              title="Behavioral Questions"
              questions={report.behavioralQuestions}
            />
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white tracking-tight">Preparation Road Map</h2>
                <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  {(report.preparationPlan || []).filter(Boolean).length}-day plan
                </span>
              </div>
              <div>
                {(report.preparationPlan || []).filter(Boolean).length === 0 ? (
                  <p className="text-xs text-slate-500 p-4">No preparation plan recorded yet.</p>
                ) : (
                  (report.preparationPlan || [])
                    .filter(Boolean)
                    .map((day, i) => (
                      <RoadmapDayCard key={day.day || i} day={day} index={i} />
                    ))
                )}
              </div>
            </section>
          )}
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="flex flex-col gap-6 border-t lg:border-t-0 pt-6 lg:pt-0">
          {/* Match Score */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center text-center">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-3">Match Score</p>
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-3 shadow-lg ${
                scoreHigh
                  ? "border-emerald-500 text-emerald-400 shadow-emerald-500/10"
                  : scoreMid
                  ? "border-amber-500 text-amber-400 shadow-amber-500/10"
                  : "border-rose-500 text-rose-400 shadow-rose-500/10"
              }`}
            >
              <span className="text-3xl font-extrabold font-mono">{report.matchScore ?? 75}</span>
              <span className="text-sm font-bold ml-0.5">%</span>
            </div>
            <p className="text-xs text-slate-400">
              {scoreHigh
                ? "Strong match for this role"
                : scoreMid
                ? "Moderate match — review gaps below"
                : "Needs preparation"}
            </p>
          </div>

          {/* Skill Gaps */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-3">Skill Gaps</p>
            <div>
              {(report.skillGaps || []).filter(Boolean).length === 0 ? (
                <span className="text-xs text-slate-500">None identified</span>
              ) : (
                (report.skillGaps || []).filter(Boolean).map((gap, i) => (
                  <span
                    key={i}
                    className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-lg border mr-1.5 mb-1.5 ${
                      gap.severity === "high"
                        ? "text-rose-300 bg-rose-500/10 border-rose-500/30"
                        : gap.severity === "low"
                        ? "text-blue-300 bg-blue-500/10 border-blue-500/30"
                        : "text-amber-300 bg-amber-500/10 border-amber-500/30"
                    }`}
                    title={gap.description || ""}
                  >
                    {gap.skillName || gap.skill || gap.name || "Skill Gap"}
                  </span>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;

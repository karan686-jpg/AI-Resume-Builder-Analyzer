import React, { useState, useMemo } from "react";
import { X, Sparkles, FileText, Briefcase, Zap, Info } from "lucide-react";
import { calculateATSScore } from "../utils/atsEngine";
import ATSScoreGauge from "./ATSScoreGauge";
import ATSKeywordAnalysis from "./ATSKeywordAnalysis";
import ATSChecklist from "./ATSChecklist";

const SAMPLE_JOB_ROLES = [
  {
    title: "Full Stack Developer",
    jd: "Looking for a Full Stack Developer proficient in React, Node.js, Express, MongoDB, and REST APIs. Experience with Docker, Redis, CI/CD pipelines, Git, and automated unit testing is a plus. Strong problem-solving and communication skills required.",
  },
  {
    title: "Frontend React Engineer",
    jd: "Seeking a Frontend Engineer with deep expertise in React.js, Tailwind CSS, modern JavaScript (ES6+), State Management (Redux/Context), responsive design, web performance optimization, and accessibility. Experience integrating REST APIs and GraphQL.",
  },
  {
    title: "Backend Node.js Engineer",
    jd: "Hiring a Backend Engineer skilled in Node.js, Express, MongoDB, database indexing, caching with Redis, BullMQ message queues, microservices architecture, Docker containerization, and writing robust scalable APIs.",
  },
];

const ATSScannerModal = ({ isOpen, onClose, resumeData, initialJobDescription = "" }) => {
  const [jobDescription, setJobDescription] = useState(initialJobDescription || "");
  const [activeTab, setActiveTab] = useState("keywords"); // "keywords" | "breakdown"

  // Sync if initialJobDescription is passed from parent page
  React.useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription, isOpen]);

  // Real-time zero-latency ATS calculation (0 AI tokens)
  const results = useMemo(() => {
    return calculateATSScore(resumeData, jobDescription);
  }, [resumeData, jobDescription]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Zap size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 leading-tight">
                Real-Time ATS Resume Scanner
              </h3>
              <p className="text-xs text-slate-500">
                0-latency algorithmic keyword & impact matcher • 0 AI tokens used
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Top: Score Overview & JD Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            {/* Left: Score Gauge */}
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4 flex justify-center">
              <ATSScoreGauge score={results.score} />
            </div>

            {/* Right: Job Description Target */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={13} className="text-blue-600" />
                  Target Job Description
                </label>
                <span className="text-[11px] text-slate-400">
                  {jobDescription ? `${jobDescription.split(/\s+/).length} words` : "Paste below"}
                </span>
              </div>

              {/* Preset quick buttons */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium self-center mr-1">
                  Preset:
                </span>
                {SAMPLE_JOB_ROLES.map((role, idx) => (
                  <button
                    key={idx}
                    onClick={() => setJobDescription(role.jd)}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 transition-colors"
                  >
                    + {role.title}
                  </button>
                ))}
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description requirements here to see keyword matches..."
                rows={3}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Sub-tabs: Keyword Analysis vs Detailed Checklist */}
          <div className="border-b border-slate-200 flex gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("keywords")}
              className={`pb-2 transition-all flex items-center gap-1.5 ${
                activeTab === "keywords"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles size={14} />
              Keyword & Skills Match ({results.matchedKeywords.length})
            </button>
            <button
              onClick={() => setActiveTab("breakdown")}
              className={`pb-2 transition-all flex items-center gap-1.5 ${
                activeTab === "breakdown"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText size={14} />
              Detailed Breakdown & Action Tips
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "keywords" ? (
            <ATSKeywordAnalysis
              matchedKeywords={results.matchedKeywords}
              missingKeywords={results.missingKeywords}
            />
          ) : (
            <ATSChecklist
              breakdown={results.breakdown}
              suggestions={results.suggestions}
              detectedMetrics={results.detectedMetrics}
              foundActionVerbs={results.foundActionVerbs}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Info size={13} className="text-blue-500" />
            Analyzed {results.totalWordCount} words in your resume instantly.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSScannerModal;

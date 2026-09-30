import React, { useState } from "react";
import { Target, FileText, Briefcase, Zap, Info } from "lucide-react";
import { calculateATSScore } from "../utils/atsEngine";
import ATSScoreGauge from "./ATSScoreGauge";
import ATSKeywordAnalysis from "./ATSKeywordAnalysis";
import ATSChecklist from "./ATSChecklist";
import { Modal, Button } from "../../../components/ui";

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

  const [results, setResults] = useState(() => calculateATSScore(resumeData, initialJobDescription || ""));
  const [_isCalculating, setIsCalculating] = useState(false);

  // Sync if initialJobDescription is passed from parent page
  React.useEffect(() => {
    if (initialJobDescription) {
      setJobDescription(initialJobDescription);
    }
  }, [initialJobDescription, isOpen]);

  // Offload 50+ heuristic ATS checks to Web Worker (avoids main-thread UI jank)
  React.useEffect(() => {
    if (!isOpen) return;

    let worker = null;
    try {
      worker = new Worker(
        new URL("../workers/ats.worker.js", import.meta.url),
        { type: "module" }
      );

      setIsCalculating(true);
      worker.postMessage({ resumeData, jobDescription });

      worker.onmessage = (event) => {
        if (event.data?.success) {
          setResults(event.data.result);
        }
        setIsCalculating(false);
      };

      worker.onerror = (err) => {
        console.warn("[ATS Worker] Fallback to main-thread:", err);
        setResults(calculateATSScore(resumeData, jobDescription));
        setIsCalculating(false);
      };
    } catch (_err) {
      setResults(calculateATSScore(resumeData, jobDescription));
      setIsCalculating(false);
    }

    return () => {
      if (worker) worker.terminate();
    };
  }, [resumeData, jobDescription, isOpen]);

  if (!isOpen || !results) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Real-Time ATS Resume Scanner"
      subtitle="0-latency algorithmic keyword & impact matcher • Web Worker powered (0 AI tokens)"
      icon={Zap}
      footer={
        <>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info size={13} className="text-blue-500" />
            Analyzed {results.totalWordCount} words via dedicated Web Worker thread.
          </span>
          <Button variant="dark" size="sm" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
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
              <Target size={14} />
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
    </Modal>
  );
};

export default ATSScannerModal;

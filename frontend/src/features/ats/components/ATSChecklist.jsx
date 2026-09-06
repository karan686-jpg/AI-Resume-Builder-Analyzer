import React from "react";
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

const ATSChecklist = ({ breakdown, suggestions = [], detectedMetrics = [], foundActionVerbs = [] }) => {
  const items = [
    {
      title: "Keyword & Skills Match",
      score: breakdown?.keywords?.score || 0,
      max: breakdown?.keywords?.max || 40,
      description: "Match with target technical skills and job requirements.",
    },
    {
      title: "Quantifiable Impact (XYZ Formula)",
      score: breakdown?.impact?.score || 0,
      max: breakdown?.impact?.max || 25,
      description: `${detectedMetrics.length} measurable metrics (%, $, numbers) found.`,
    },
    {
      title: "Action Verbs Strength",
      score: breakdown?.verbs?.score || 0,
      max: breakdown?.verbs?.max || 20,
      description: `${foundActionVerbs.length} powerful action verbs identified.`,
    },
    {
      title: "Completeness & Formatting",
      score: breakdown?.completeness?.score || 0,
      max: breakdown?.completeness?.max || 15,
      description: "Contact links, section structure, and clean length.",
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        Scoring Breakdown
      </h4>

      {/* Progress Bars */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const pct = Math.round((item.score / item.max) * 100);
          const isGood = pct >= 75;
          return (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {isGood ? (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={13} className="text-amber-500" />
                  )}
                  {item.title}
                </span>
                <span className="font-bold text-slate-700">
                  {item.score} / {item.max} pts
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 80 ? "bg-emerald-500" : pct >= 55 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Actionable Recommendations */}
      {suggestions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
            <Lightbulb size={14} className="text-amber-600" />
            <span>High-Impact Recommendations</span>
          </div>

          <div className="space-y-2">
            {suggestions.map((sug, i) => (
              <div
                key={i}
                className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-xs"
              >
                <p className="font-semibold text-amber-900">{sug.title}</p>
                <p className="text-amber-800 text-[11px] mt-0.5">{sug.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSChecklist;

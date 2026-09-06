import React, { useState } from "react";
import { Check, Plus, Search } from "lucide-react";

const ATSKeywordAnalysis = ({ matchedKeywords = [], missingKeywords = [] }) => {
  const [filter, setFilter] = useState("all"); // "all" | "matched" | "missing"
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMatched = matchedKeywords.filter((k) =>
    k.term.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMissing = missingKeywords.filter((k) =>
    k.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = matchedKeywords.length + missingKeywords.length;
  const matchRate = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Keyword Match
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            {matchRate}% Overlap
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded-md font-medium transition-all ${
              filter === "all"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All ({total})
          </button>
          <button
            onClick={() => setFilter("matched")}
            className={`px-2 py-1 rounded-md font-medium transition-all ${
              filter === "matched"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Matched ({matchedKeywords.length})
          </button>
          <button
            onClick={() => setFilter("missing")}
            className={`px-2 py-1 rounded-md font-medium transition-all ${
              filter === "missing"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Missing ({missingKeywords.length})
          </button>
        </div>
      </div>

      {/* Search keywords */}
      {total > 10 && (
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Badges Container */}
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
        {(filter === "all" || filter === "matched") &&
          filteredMatched.map((k, i) => (
            <span
              key={`match-${i}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
            >
              <Check size={11} className="text-emerald-600 shrink-0" />
              <span>{k.term}</span>
              {k.jobCount > 1 && (
                <span className="text-[10px] text-emerald-600 opacity-75">
                  ×{k.jobCount}
                </span>
              )}
            </span>
          ))}

        {(filter === "all" || filter === "missing") &&
          filteredMissing.map((k, i) => (
            <span
              key={`miss-${i}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs"
              title={`Mentioned ${k.jobCount}x in job description`}
            >
              <Plus size={11} className="text-amber-600 shrink-0" />
              <span>{k.term}</span>
              {k.jobCount > 1 && (
                <span className="text-[10px] text-amber-600 opacity-75">
                  ×{k.jobCount}
                </span>
              )}
            </span>
          ))}

        {total === 0 && (
          <p className="text-xs text-slate-400 py-3 text-center w-full">
            Paste a target Job Description above to see keyword matches!
          </p>
        )}
      </div>
    </div>
  );
};

export default ATSKeywordAnalysis;

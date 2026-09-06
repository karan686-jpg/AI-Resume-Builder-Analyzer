import React from "react";

const ATSScoreGauge = ({ score = 0, size = 130 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let color = "#ef4444"; // Red
  let label = "Needs Optimization";
  let badgeBg = "bg-rose-50 text-rose-700 border-rose-200";

  if (safeScore >= 80) {
    color = "#10b981"; // Emerald
    label = "Strong ATS Match";
    badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (safeScore >= 60) {
    color = "#f59e0b"; // Amber
    label = "Good Potential";
    badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {safeScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      <span
        className={`mt-2.5 px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeBg}`}
      >
        {label}
      </span>
    </div>
  );
};

export default ATSScoreGauge;

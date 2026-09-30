import React from "react";
import { Badge } from "../../../components/ui";

const ATSScoreGauge = ({ score = 0, size = 130 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let color = "#ef4444"; // Red
  let label = "Needs Optimization";
  let badgeVariant = "danger";

  if (safeScore >= 80) {
    color = "#10b981"; // Emerald
    label = "Strong ATS Match";
    badgeVariant = "success";
  } else if (safeScore >= 60) {
    color = "#f59e0b"; // Amber
    label = "Good Potential";
    badgeVariant = "warning";
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

      <Badge variant={badgeVariant} className="mt-2.5 font-bold">
        {label}
      </Badge>
    </div>
  );
};

export default ATSScoreGauge;

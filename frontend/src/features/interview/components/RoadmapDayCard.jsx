import React from "react";

/**
 * Reusable Card component for individual days in the 7-day interview preparation roadmap.
 */
export const RoadmapDayCard = ({ day, index = 0 }) => {
  if (!day) return null;
  const dayNumber = day.day || index + 1;
  const dayFocus = day.focus || day.title || "Key Concepts & Review";
  const tasks = Array.isArray(day.tasks) ? day.tasks : [];

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all mb-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-sm shadow-pink-500/20">
          Day {dayNumber}
        </span>
        <h3 className="text-sm font-bold text-white">{dayFocus}</h3>
      </div>
      <ul className="space-y-2 text-xs text-slate-300">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
            <span>{typeof task === "string" ? task : task?.task || JSON.stringify(task)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoadmapDayCard;

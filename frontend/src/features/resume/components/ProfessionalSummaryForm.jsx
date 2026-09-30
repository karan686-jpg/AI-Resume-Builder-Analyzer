import React, { useRef } from "react";
import FormatToolbar from "./FormatToolbar";

const ProfessionalSummaryForm = ({ summary, onChange }) => {
  const textareaRef = useRef(null);

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Professional Summary
        </h2>
      </div>

      <p className="text-sm text-gray-500">
        Write a concise, impactful 2-3 sentence summary highlighting your core expertise and career achievements.
      </p>

      <div className="flex justify-between items-center">
        <FormatToolbar textareaRef={textareaRef} value={summary} onChange={onChange} />
      </div>

      <textarea
        ref={textareaRef}
        rows="5"
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
        placeholder="E.g., I am a software engineer with 5 years experience in building web apps..."
      />
    </div>
  );
};

export default ProfessionalSummaryForm;

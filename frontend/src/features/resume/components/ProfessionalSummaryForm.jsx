import React, { useState } from "react";
import { enhanceSummary } from "../services/resume.api";
import { Sparkles, Loader2 } from "lucide-react";

const ProfessionalSummaryForm = ({ summary, onChange }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!summary || summary.trim().length < 10) return;

    setIsEnhancing(true);
    try {
      const improvedText = await enhanceSummary(summary);
      onChange(improvedText);
    } catch (error) {
      console.error("Failed to enhance summary", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Professional Summary
        </h2>
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !summary}
          className="flex items-center text-sm px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {isEnhancing ? (
            <Loader2 className="animate-spin mr-2" size={16} />
          ) : (
            <Sparkles className="mr-2" size={16} />
          )}
          {isEnhancing ? "Enhancing..." : "Enhance with AI"}
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Write a short draft of your professional summary, then click the AI
        button to polish it.
      </p>

      <textarea
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

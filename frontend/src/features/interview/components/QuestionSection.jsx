import React from "react";
import QuestionCard from "./QuestionCard";

/**
 * Reusable section container for Question lists with question counter and empty state.
 */
export const QuestionSection = ({ title, questions }) => {
  const validQuestions = (questions || []).filter(Boolean);
  return (
    <section>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          {validQuestions.length} questions
        </span>
      </div>
      <div>
        {validQuestions.length === 0 ? (
          <p className="text-xs text-slate-500 p-4">No questions recorded yet.</p>
        ) : (
          validQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)
        )}
      </div>
    </section>
  );
};

export default QuestionSection;

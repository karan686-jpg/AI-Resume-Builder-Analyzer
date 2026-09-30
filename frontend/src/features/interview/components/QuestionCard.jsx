import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Reusable collapsible Accordion Card for Technical & Behavioral Interview Questions.
 * Displays question number, intention, and recommended model answer.
 */
export const QuestionCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!item) return null;

  const question = item.question || item.title || `Question ${index + 1}`;
  const intention = item.intention || "Evaluate domain expertise and problem-solving framework.";
  const answer = item.answer || item.modelAnswer || "";

  return (
    <div className="bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-2xl mb-3 overflow-hidden transition-all duration-200">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-lg flex-shrink-0">
          Q{index + 1}
        </span>
        <p className="text-sm font-semibold text-white flex-1 leading-snug">
          {question}
        </p>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-pink-400" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="p-4 pt-3 border-t border-white/5 bg-black/30 flex flex-col gap-3 text-xs leading-relaxed">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mb-1">
              Intention
            </span>
            <p className="text-slate-300 mt-1">{intention}</p>
          </div>
          {answer && (
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mb-1">
                Model Answer
              </span>
              <p className="text-slate-300 mt-1">{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

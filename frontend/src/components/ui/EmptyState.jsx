import React from "react";

/**
 * Reusable dashed empty state container with icon, message, and optional action button.
 */
export const EmptyState = ({
  icon: Icon,
  message,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.02] flex flex-col items-center justify-center ${className}`}
    >
      {Icon && <Icon size={32} className="text-slate-500 mb-2.5 opacity-60" />}
      <p className="text-sm text-slate-400 mb-3">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

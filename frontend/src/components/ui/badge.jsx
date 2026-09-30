import React from "react";

/**
 * Reusable Badge / Tag / Pill component.
 */
export const Badge = ({
  variant = "neutral",
  size = "sm",
  children,
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center font-medium rounded-full transition-colors select-none";

  const variants = {
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs",
    warning: "bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  const sizes = {
    xs: "text-[10px] px-2 py-0.5 gap-1",
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-xs font-semibold px-3 py-1.5 gap-2",
  };

  return (
    <span
      className={`${base} ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

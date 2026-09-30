import React from "react";

/**
 * Reusable Button component with multiple variants & sizes (shadcn-style).
 */
export const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20",
    gradient:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/25",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    outline:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs",
    danger:
      "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    dark:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-sm",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-xs font-semibold px-4 py-2 gap-2",
    lg: "text-sm font-semibold px-5 py-2.5 gap-2.5",
    icon: "p-2 rounded-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

import React from "react";
import { Bold, Underline, Italic } from "lucide-react";

/**
 * FormatToolbar: Quick formatting buttons (Bold, Italic, Underline) for textarea inputs
 * @param {React.RefObject} textareaRef - Ref to the target HTML textarea
 * @param {string} value - Current text value
 * @param {function} onChange - Callback to update parent text state
 */
export const FormatToolbar = ({ textareaRef, textareaIndex, value = "", onChange }) => {
  const insertTag = (prefix, suffix = prefix) => {
    // Support both: a plain ref object {current: el} OR a ref map + index
    const textarea =
      textareaIndex !== undefined
        ? textareaRef?.current?.[textareaIndex]
        : textareaRef?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || "";

    const selectedText = currentVal.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const updated =
      currentVal.substring(0, start) +
      replacement +
      currentVal.substring(end);

    onChange(updated);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText
        ? start + replacement.length
        : start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos + (selectedText ? 0 : 4));
    }, 10);
  };

  return (
    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 w-fit mb-1.5 shadow-xs">
      <button
        type="button"
        onClick={() => insertTag("**")}
        title="Bold (**text**)"
        className="p-1.5 rounded hover:bg-white hover:text-blue-600 hover:shadow-xs text-slate-600 transition-all cursor-pointer"
      >
        <Bold size={13} className="stroke-[2.5]" />
      </button>

      <button
        type="button"
        onClick={() => insertTag("*")}
        title="Italic (*text*)"
        className="p-1.5 rounded hover:bg-white hover:text-blue-600 hover:shadow-xs text-slate-600 transition-all cursor-pointer"
      >
        <Italic size={13} className="stroke-[2.5]" />
      </button>

      <button
        type="button"
        onClick={() => insertTag("<u>", "</u>")}
        title="Underline (<u>text</u>)"
        className="p-1.5 rounded hover:bg-white hover:text-blue-600 hover:shadow-xs text-slate-600 transition-all cursor-pointer"
      >
        <Underline size={13} className="stroke-[2.5]" />
      </button>

      <span className="text-[10px] text-slate-400 font-medium px-1.5 border-l border-slate-200 select-none">
        Highlight & click to format
      </span>
    </div>
  );
};

export default FormatToolbar;

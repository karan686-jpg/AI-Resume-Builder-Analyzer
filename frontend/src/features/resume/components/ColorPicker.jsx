import React from "react";
import { Check, Type, Sparkles } from "lucide-react";

const PRESET_COLORS = [
  { hex: "#2563eb", name: "Blue" },
  { hex: "#0f766e", name: "Teal" },
  { hex: "#7c3aed", name: "Purple" },
  { hex: "#dc2626", name: "Red" },
  { hex: "#ea580c", name: "Orange" },
  { hex: "#0f172a", name: "Slate" },
];

const FONT_OPTIONS = [
  { value: "'Inter', sans-serif", label: "Inter (Modern)" },
  { value: "'Roboto', sans-serif", label: "Roboto (Clean)" },
  { value: "Georgia, serif", label: "Georgia (Classic)" },
  { value: "'Playfair Display', serif", label: "Playfair (Editorial)" },
];

const ColorPicker = ({
  selectedColor,
  onChange,
  selectedFont,
  onFontChange,
  selectedSpacing = "medium",
  onSpacingChange,
}) => {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs">
      {/* Colors */}
      <div className="flex items-center gap-1.5">
        {PRESET_COLORS.map(({ hex, name }) => (
          <button
            key={hex}
            onClick={() => onChange(hex)}
            title={name}
            className="relative flex items-center justify-center rounded-full transition-transform hover:scale-115 cursor-pointer"
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: hex,
              boxShadow: selectedColor === hex ? `0 0 0 2px #fff, 0 0 0 4px ${hex}` : "none",
            }}
          >
            {selectedColor === hex && <Check size={10} color="white" />}
          </button>
        ))}

        {/* Custom color input */}
        <div
          title="Custom color"
          className="relative w-5 h-5 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
        >
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-9 h-9 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full"
            style={{
              background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
            }}
          />
        </div>
      </div>

      <div className="w-[1px] h-4 bg-slate-200" />

      {/* Font selector */}
      {onFontChange && (
        <div className="flex items-center gap-1.5">
          <Type size={13} className="text-slate-400" />
          <select
            value={selectedFont}
            onChange={(e) => onFontChange(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer hover:text-slate-900 pr-1"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Spacing selector */}
      {onSpacingChange && (
        <>
          <div className="w-[1px] h-4 bg-slate-200" />
          <select
            value={selectedSpacing}
            onChange={(e) => onSpacingChange(e.target.value)}
            className="text-xs font-medium text-slate-600 bg-transparent outline-none cursor-pointer hover:text-slate-900"
          >
            <option value="small">Compact</option>
            <option value="medium">Normal</option>
            <option value="large">Spacious</option>
          </select>
        </>
      )}
    </div>
  );
};

export default ColorPicker;

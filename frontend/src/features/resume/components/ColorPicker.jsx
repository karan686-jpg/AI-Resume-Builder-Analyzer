import React from "react";
import { Check } from "lucide-react";

const PRESET_COLORS = [
  { hex: "#2563eb", name: "Blue" },
  { hex: "#16a34a", name: "Green" },
  { hex: "#db2777", name: "Pink" },
  { hex: "#9333ea", name: "Purple" },
  { hex: "#ea580c", name: "Orange" },
  { hex: "#dc2626", name: "Red" },
  { hex: "#475569", name: "Slate" },
  { hex: "#0ea5e9", name: "Sky" },
  { hex: "#0d9488", name: "Teal" },
  { hex: "#ca8a04", name: "Gold" },
  { hex: "#111827", name: "Graphite" },
  { hex: "#7c3aed", name: "Violet" },
];

const FONT_OPTIONS = [
  { value: "'Inter', sans-serif", label: "Inter", preview: "Aa" },
  { value: "'Roboto', sans-serif", label: "Roboto", preview: "Aa" },
  { value: "Georgia, serif", label: "Georgia", preview: "Aa" },
  { value: "'Playfair Display', serif", label: "Playfair", preview: "Aa" },
];

const ColorPicker = ({
  selectedColor,
  onChange,
  selectedFont,
  onFontChange,
  selectedAlignment = "left",
  onAlignmentChange,
  selectedSpacing = "medium",
  onSpacingChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Color row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#64748b",
            marginRight: "2px",
          }}
        >
          Color:
        </span>
        {PRESET_COLORS.map(({ hex }) => (
          <button
            key={hex}
            onClick={() => onChange(hex)}
            title={hex}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: hex,
              border:
                selectedColor === hex
                  ? "2px solid #1e293b"
                  : "2px solid transparent",
              boxShadow:
                selectedColor === hex ? "0 0 0 2px white inset" : "none",
              cursor: "pointer",
              transition: "transform 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {selectedColor === hex && <Check size={10} color="white" />}
          </button>
        ))}
        {/* Custom color input */}
        <div
          style={{
            position: "relative",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              inset: "-6px",
              width: "36px",
              height: "36px",
              cursor: "pointer",
            }}
            title="Custom color"
          />
        </div>
      </div>

      {/* Font row */}
      {onFontChange && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#64748b",
              marginRight: "2px",
            }}
          >
            Font:
          </span>
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFontChange(f.value)}
              title={f.label}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontFamily: f.value,
                fontWeight: "600",
                border:
                  selectedFont === f.value
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background: selectedFont === f.value ? "#eff6ff" : "white",
                color: selectedFont === f.value ? "#2563eb" : "#4b5563",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Alignment row */}
      {onAlignmentChange && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#64748b",
              marginRight: "2px",
            }}
          >
            Align:
          </span>
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => onAlignmentChange(align)}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "capitalize",
                border:
                  selectedAlignment === align
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background: selectedAlignment === align ? "#eff6ff" : "white",
                color: selectedAlignment === align ? "#2563eb" : "#4b5563",
                cursor: "pointer",
              }}
            >
              {align}
            </button>
          ))}
        </div>
      )}

      {/* Spacing row */}
      {onSpacingChange && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#64748b",
              marginRight: "2px",
            }}
          >
            Spacing:
          </span>
          {["small", "medium", "large"].map((spacing) => (
            <button
              key={spacing}
              onClick={() => onSpacingChange(spacing)}
              style={{
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "capitalize",
                border:
                  selectedSpacing === spacing
                    ? "2px solid #2563eb"
                    : "2px solid #e2e8f0",
                background: selectedSpacing === spacing ? "#eff6ff" : "white",
                color: selectedSpacing === spacing ? "#2563eb" : "#4b5563",
                cursor: "pointer",
              }}
            >
              {spacing}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

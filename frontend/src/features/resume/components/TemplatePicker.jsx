import React from "react";

/**
 * TemplatePicker — visual card grid for choosing a template
 */

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Sleek two-column with colored header",
    emoji: "🎯",
    color: "#2563eb",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout",
    emoji: "📄",
    color: "#16a34a",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean typographic black & white",
    emoji: "⬜",
    color: "#111827",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant sidebar with bold color",
    emoji: "🎨",
    color: "#7c3aed",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional two-column layout",
    emoji: "💼",
    color: "#0f172a",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Structured single-column standard",
    emoji: "📝",
    color: "#0284c7",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Name left, details right layout",
    emoji: "🏢",
    color: "#334155",
  },
  {
    id: "simple",
    name: "Simple",
    description: "Clean minimalist typography",
    emoji: "🧾",
    color: "#1f2937",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Centered headers, sophisticated",
    emoji: "🏛️",
    color: "#9f1239",
  },
];

const TemplatePicker = ({ selectedTemplate, onChange }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #f1f5f9",
      }}
    >
      <h2
        style={{
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "#1e293b",
          marginBottom: "6px",
        }}
      >
        🖼️ Choose Template
      </h2>
      <p
        style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "16px" }}
      >
        Pick a layout — preview updates live on the right.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              style={{
                border: isSelected
                  ? `2px solid ${tpl.color}`
                  : "2px solid #e2e8f0",
                borderRadius: "12px",
                padding: "14px 12px",
                background: isSelected ? tpl.color + "10" : "white",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                position: "relative",
                outline: "none",
              }}
            >
              {isSelected && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: tpl.color,
                    color: "white",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  ✓
                </span>
              )}
              <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                {tpl.emoji}
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  color: isSelected ? tpl.color : "#1e293b",
                  marginBottom: "3px",
                }}
              >
                {tpl.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  lineHeight: "1.4",
                }}
              >
                {tpl.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;

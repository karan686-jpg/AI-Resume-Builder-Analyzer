import React, { useState } from "react";
import { X, Check, ChevronDown, Palette } from "lucide-react";

// ─── Data Constants ────────────────────────────────────────────────────────────
const PRESET_COLORS = [
  "#0f172a", "#475569", "#16a34a", "#dc2626", "#2563eb",
  "#7c3aed", "#ea580c", "#0891b2", "#b45309", "#be185d",
  "#4338ca", "#059669",
];

const FONT_OPTIONS = [
  { value: "'Inter', sans-serif",           label: "Inter",           class: "font-sans"  },
  { value: "'Roboto', sans-serif",          label: "Roboto",          class: "font-sans"  },
  { value: "Georgia, serif",               label: "Georgia",         class: "font-serif" },
  { value: "'Playfair Display', serif",    label: "Playfair Display", class: "font-serif" },
  { value: "'Merriweather', serif",        label: "Merriweather",    class: "font-serif" },
  { value: "'Lato', sans-serif",           label: "Lato",            class: "font-sans"  },
];

// Pure-CSS background patterns (SVG data URIs)
const BG_PATTERNS = [
  { id: "none",        label: "None",       style: { backgroundColor: "#ffffff" } },
  { id: "dots",        label: "Dots",       style: { backgroundColor: "#fff", backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "16px 16px" } },
  { id: "grid",        label: "Grid",       style: { backgroundColor: "#fff", backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "20px 20px" } },
  { id: "lines",       label: "Lines",      style: { backgroundColor: "#fff", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 18px, #e5e7eb 18px, #e5e7eb 19px)" } },
  { id: "diagonal",    label: "Diagonal",   style: { backgroundColor: "#fff", backgroundImage: "repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" } },
  { id: "cross",       label: "Cross",      style: { backgroundColor: "#fff", backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "12px 12px", backgroundPosition: "center center" } },
  { id: "zigzag",      label: "Zigzag",     style: { backgroundColor: "#fff", backgroundImage: "linear-gradient(135deg, #e5e7eb 25%, transparent 25%) -10px 0, linear-gradient(225deg, #e5e7eb 25%, transparent 25%) -10px 0, linear-gradient(315deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, #e5e7eb 25%, transparent 25%)", backgroundSize: "20px 20px" } },
  { id: "hexagons",    label: "Hexagons",   style: { backgroundColor: "#fff", backgroundImage: "radial-gradient(circle farthest-side at 0% 50%, #e5e7eb 23.5%, rgba(240, 166, 17, 0) 0) 21px 30px, radial-gradient(circle farthest-side at 0% 50%, #ccc 24%, rgba(240, 166, 17, 0) 0) 19px 30px, linear-gradient(#e5e7eb 14%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 85%, #e5e7eb 0) 0 0, linear-gradient(150deg, #e5e7eb 24%, #fff 0, #fff 26%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 74%, #fff 0, #fff 76%, #e5e7eb 0) 0 0, linear-gradient(30deg, #e5e7eb 24%, #fff 0, #fff 26%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 74%, #fff 0, #fff 76%, #e5e7eb 0) 0 0, linear-gradient(90deg, #ccc 2%, #fff 0, #fff 98%, #ccc 0%) 0 0", backgroundSize: "40px 60px" } },
  { id: "cream",       label: "Cream",      style: { backgroundColor: "#fdf6e3" } },
  { id: "mint",        label: "Mint",       style: { backgroundColor: "#f0fdf4" } },
  { id: "lavender",    label: "Lavender",   style: { backgroundColor: "#f5f3ff" } },
  { id: "blush",       label: "Blush",      style: { backgroundColor: "#fff1f2" } },
];

// ─── Slider Component ──────────────────────────────────────────────────────────
function DesignSlider({ label, value, min, max, step = 1, leftLabel, rightLabel, onChange }) {
  return (
    <div className="dp-slider-group">
      <div className="dp-slider-label-row">
        <span className="dp-slider-label">{label}</span>
        <span className="dp-slider-value">{value}</span>
      </div>
      <div className="dp-slider-row">
        {leftLabel && <span className="dp-slider-edge">{leftLabel}</span>}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="dp-range"
        />
        {rightLabel && <span className="dp-slider-edge">{rightLabel}</span>}
      </div>
    </div>
  );
}

// ─── Main DesignPanel Component ────────────────────────────────────────────────
const DesignPanel = ({
  isOpen,
  onClose,
  // Color
  selectedColor,
  onColorChange,
  // Font
  selectedFont,
  onFontChange,
  // Sliders
  pageMargin,
  onPageMarginChange,
  sectionSpacing,
  onSectionSpacingChange,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  // Background
  selectedBg,
  onBgChange,
}) => {
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [activeSection, setActiveSection] = useState("typography");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="dp-backdrop" onClick={onClose} />

      {/* Panel Drawer */}
      <div className="dp-panel">
        {/* Header */}
        <div className="dp-header">
          <div className="dp-header-title">
            <Palette size={16} />
            <span>Design & Font</span>
          </div>
          <button className="dp-close-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="dp-tabs">
          <button
            className={`dp-tab ${activeSection === "typography" ? "active" : ""}`}
            onClick={() => setActiveSection("typography")}
          >Typography</button>
          <button
            className={`dp-tab ${activeSection === "spacing" ? "active" : ""}`}
            onClick={() => setActiveSection("spacing")}
          >Layout</button>
          <button
            className={`dp-tab ${activeSection === "color" ? "active" : ""}`}
            onClick={() => setActiveSection("color")}
          >Color</button>
          <button
            className={`dp-tab ${activeSection === "background" ? "active" : ""}`}
            onClick={() => setActiveSection("background")}
          >Background</button>
        </div>

        <div className="dp-body">
          {/* ── Typography ── */}
          {activeSection === "typography" && (
            <div className="dp-section">
              {/* Font Family */}
              <div className="dp-field-group">
                <label className="dp-field-label">FONT STYLE</label>
                <div className="dp-font-grid">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      className={`dp-font-btn ${selectedFont === f.value ? "active" : ""}`}
                      style={{ fontFamily: f.value }}
                      onClick={() => onFontChange(f.value)}
                    >
                      {selectedFont === f.value && <Check size={10} className="dp-font-check" />}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dp-divider" />

              {/* Font Size */}
              <DesignSlider
                label="FONT SIZE"
                value={fontSize}
                min={8}
                max={14}
                step={1}
                leftLabel="− A"
                rightLabel="+ A"
                onChange={onFontSizeChange}
              />

              <div className="dp-divider" />

              {/* Line Height */}
              <DesignSlider
                label="LINE HEIGHT"
                value={lineHeight}
                min={1}
                max={5}
                step={1}
                leftLabel="condensed"
                rightLabel="spacious"
                onChange={onLineHeightChange}
              />
            </div>
          )}

          {/* ── Layout / Spacing ── */}
          {activeSection === "spacing" && (
            <div className="dp-section">
              {/* Page Margin */}
              <DesignSlider
                label="PAGE MARGINS"
                value={pageMargin}
                min={1}
                max={5}
                step={1}
                leftLabel="narrow"
                rightLabel="wide"
                onChange={onPageMarginChange}
              />

              <div className="dp-divider" />

              {/* Section Spacing */}
              <DesignSlider
                label="SECTION SPACING"
                value={sectionSpacing}
                min={1}
                max={5}
                step={1}
                leftLabel="compact"
                rightLabel="more space"
                onChange={onSectionSpacingChange}
              />
            </div>
          )}

          {/* ── Color ── */}
          {activeSection === "color" && (
            <div className="dp-section">
              <label className="dp-field-label">COLORS</label>
              <div className="dp-color-grid">
                {PRESET_COLORS.map((hex) => (
                  <button
                    key={hex}
                    className={`dp-color-swatch ${selectedColor === hex ? "active" : ""}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => onColorChange(hex)}
                    title={hex}
                  >
                    {selectedColor === hex && <Check size={10} color="white" />}
                  </button>
                ))}
              </div>

              <div className="dp-divider" />

              {/* Custom Color */}
              <label className="dp-field-label">CUSTOM COLOR</label>
              <div className="dp-custom-color-row">
                <div className="dp-custom-swatch" style={{ backgroundColor: selectedColor }} />
                <span className="dp-custom-hex">{selectedColor}</span>
                <div className="dp-custom-picker-wrap">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="dp-color-input"
                  />
                  <span className="dp-custom-picker-label">Use custom color</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Background ── */}
          {activeSection === "background" && (
            <div className="dp-section">
              <label className="dp-field-label">BACKGROUNDS</label>
              <div className="dp-bg-grid">
                {BG_PATTERNS.map((bg) => (
                  <button
                    key={bg.id}
                    className={`dp-bg-swatch ${selectedBg === bg.id ? "active" : ""}`}
                    style={bg.style}
                    onClick={() => onBgChange(bg.id)}
                    title={bg.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { BG_PATTERNS };
export default DesignPanel;

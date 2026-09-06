import React, { useState, useEffect, useRef } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import CustomSectionForm from "../components/CustomSectionForm";
import ResumePreview from "../components/ResumePreview";
import TemplatePicker from "../components/TemplatePicker";
import DesignPanel, { BG_PATTERNS } from "../components/DesignPanel";
import {
  Download,
  ChevronLeft,
  Save,
  Check,
  Loader2,
  Printer,
  Layout,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Layers,
  SlidersHorizontal,
  Zap,
  FlaskConical,
  UploadCloud,
  DownloadCloud,
  Eye,
  EyeOff,
  GripVertical,
  Palette,
  LayoutTemplate,
  Wand2,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import ATSScannerModal from "../../ats/components/ATSScannerModal";
import ImportResumeModal from "../components/ImportResumeModal";
import { saveResume, updateResume, getResumeById } from "../services/resume.api";
import { SAMPLE_RESUME } from "../data/sampleResume";
import { exportResumeToJson, importResumeFromJson } from "../utils/jsonBackup";
import "./ResumeBuilder.css";
import "../components/DesignPanel.css";

// ─── Section registry ──────────────────────────────────────────────────────────
const ALL_SECTIONS = [
  { id: "template",   label: "Templates",    icon: Layout        },
  { id: "personal",   label: "Personal Info", icon: User          },
  { id: "summary",    label: "Summary",       icon: FileText      },
  { id: "experience", label: "Experience",    icon: Briefcase     },
  { id: "education",  label: "Education",     icon: GraduationCap },
  { id: "skills",     label: "Skills",        icon: Wrench        },
  { id: "custom",     label: "Custom",        icon: SlidersHorizontal },
];

const DEFAULT_ORDER = ALL_SECTIONS.map((s) => s.id);
const DEFAULT_VISIBILITY = Object.fromEntries(ALL_SECTIONS.map((s) => [s.id, true]));

// Top-level view modes
const VIEW_MODES = [
  { id: "edit",      label: "Edit",      icon: FileText     },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "rearrange", label: "Rearrange", icon: ArrowUpDown  },
  { id: "design",    label: "Design & Font", icon: Palette  },
];

// ─── Drag-and-Drop Section Manager ────────────────────────────────────────────
function SectionManager({ order, visibility, onReorder, onToggle }) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (index) => { dragItem.current = index; setDragging(index); };
  const handleDragEnter = (index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newOrder = [...order];
      const draggedId = newOrder.splice(dragItem.current, 1)[0];
      newOrder.splice(dragOverItem.current, 0, draggedId);
      onReorder(newOrder);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDragging(null);
  };

  return (
    <div className="rb-rearrange-view">
      <div className="rb-rearrange-header">
        <h3>Rearrange Sections</h3>
        <p>Drag sections to reorder. Click the eye to hide/show.</p>
      </div>

      <div className="rb-rearrange-page-card">
        <div className="rb-rearrange-page-label">Page 1 of 1</div>

        {/* Header lock (always top) */}
        <div className="rb-sm-item rb-sm-item--locked">
          <span className="rb-sm-lock">🔒</span>
          <span className="rb-sm-label">Header (Personal Info)</span>
        </div>

        {/* Draggable sections */}
        <ul className="rb-section-manager-list">
          {order.filter(id => id !== "template").map((id, index) => {
            const sec = ALL_SECTIONS.find((s) => s.id === id);
            if (!sec) return null;
            const Icon = sec.icon;
            const isVisible = visibility[id];
            const isDragging = dragging === index;
            return (
              <li
                key={id}
                className={`rb-sm-item ${!isVisible ? "rb-sm-item--hidden" : ""} ${isDragging ? "rb-sm-item--dragging" : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <span className="rb-sm-grip"><GripVertical size={15} /></span>
                <Icon size={14} className="rb-sm-icon" />
                <span className="rb-sm-label">{sec.label}</span>
                <button
                  className={`rb-sm-eye ${isVisible ? "" : "rb-sm-eye--off"}`}
                  onClick={() => onToggle(id)}
                  title={isVisible ? "Hide section" : "Show section"}
                >
                  {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ─── Main ResumeBuilder ────────────────────────────────────────────────────────
const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("id");

  // Master resume state
  const [resumeData, setResumeData] = useState({
    title: "My Professional Resume",
    themeColor: "#2563eb",
    fontFamily: "'Inter', sans-serif",
    alignment: "left",
    spacing: "medium",
    personalInfo: { name: "", email: "", phone: "", linkedIn: "", imageUrl: "" },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  });

  const [template, setTemplate] = useState("modern");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(resumeId);
  const [activeTab, setActiveTab] = useState("all");
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("edit");

  // Design panel state
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [pageMargin, setPageMargin] = useState(3);
  const [sectionSpacing, setSectionSpacing] = useState(2);
  const [fontSize, setFontSize] = useState(11);
  const [lineHeight, setLineHeight] = useState(2);
  const [selectedBg, setSelectedBg] = useState("none");

  // Drag-and-drop state
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState(DEFAULT_VISIBILITY);

  // Load existing resume
  useEffect(() => {
    if (resumeId) {
      const loadResume = async () => {
        try {
          const fetched = await getResumeById(resumeId);
          if (fetched) {
            setResumeData((prev) => ({ ...prev, ...fetched, personalInfo: fetched.personalInfo || prev.personalInfo }));
            if (fetched.activeTemplate) setTemplate(fetched.activeTemplate);
            setCurrentResumeId(fetched._id);
          }
        } catch (err) { console.error("Failed to load resume:", err); }
      };
      loadResume();
    }
  }, [resumeId]);

  // Helpers
  const updatePersonalInfo = (data) => setResumeData((p) => ({ ...p, personalInfo: data }));
  const updateSummary     = (text) => setResumeData((p) => ({ ...p, professionalSummary: text }));
  const updateExperience  = (list) => setResumeData((p) => ({ ...p, experience: list }));
  const updateEducation   = (list) => setResumeData((p) => ({ ...p, education: list }));
  const updateSkills      = (list) => setResumeData((p) => ({ ...p, skills: list }));
  const updateCustom      = (list) => setResumeData((p) => ({ ...p, customSections: list }));
  const updateThemeColor  = (color) => setResumeData((p) => ({ ...p, themeColor: color }));
  const updateFont        = (font)  => setResumeData((p) => ({ ...p, fontFamily: font }));

  // Section reorder/toggle
  const handleReorder = (newOrder) => setSectionOrder(newOrder);
  const handleToggle  = (id) => setSectionVisibility((prev) => ({ ...prev, [id]: !prev[id] }));

  // Sample data
  const handleLoadSample = () => {
    if (window.confirm("This will replace all current data with sample data. Continue?")) {
      const { title, themeColor, fontFamily, alignment, spacing, ...rest } = SAMPLE_RESUME;
      setResumeData({ title, themeColor, fontFamily, alignment, spacing, ...rest });
      setSectionOrder(DEFAULT_ORDER);
      setSectionVisibility(DEFAULT_VISIBILITY);
    }
  };

  // JSON Export/Import
  const handleAutoFormatImport = (parsed) => {
    setResumeData((prev) => ({
      ...prev,
      title: parsed.personalInfo?.name ? `${parsed.personalInfo.name}'s Resume` : prev.title,
      personalInfo: {
        ...prev.personalInfo,
        ...(parsed.personalInfo || {}),
      },
      professionalSummary: parsed.professionalSummary || prev.professionalSummary,
      experience: parsed.experience?.length > 0 ? parsed.experience : prev.experience,
      education: parsed.education?.length > 0 ? parsed.education : prev.education,
      skills: parsed.skills?.length > 0 ? parsed.skills : prev.skills,
      customSections: parsed.customSections?.length > 0
        ? parsed.customSections
        : prev.customSections,
    }));

    // Ensure custom section is visible if custom sections were found
    if (parsed.customSections?.length > 0) {
      setSectionVisibility((prev) => ({ ...prev, custom: true }));
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportJson = () => exportResumeToJson({ ...resumeData, activeTemplate: template });
  const handleImportJson = () => {
    importResumeFromJson(
      (parsed) => {
        const { activeTemplate, ...rest } = parsed;
        setResumeData((prev) => ({ ...prev, ...rest }));
        if (activeTemplate) setTemplate(activeTemplate);
        alert("Resume imported successfully!");
      },
      (errMsg) => alert("Import failed: " + errMsg)
    );
  };

  // Save to cloud
  const handleSaveToCloud = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      const payload = { ...resumeData, activeTemplate: template };
      if (currentResumeId) {
        await updateResume(currentResumeId, payload);
      } else {
        const response = await saveResume(payload);
        if (response?.resume?._id) setCurrentResumeId(response.resume._id);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save resume. Please make sure you are logged in!");
    } finally { setIsSaving(false); }
  };

  const handlePrint = () => window.print();

  // Background style for preview
  const bgPattern = BG_PATTERNS.find((b) => b.id === selectedBg);
  const previewBgStyle = bgPattern?.style || {};

  // Design values to pass to preview
  const designValues = { pageMargin, sectionSpacing, fontSize, lineHeight, bgStyle: previewBgStyle };

  // Render section by id
  const renderSection = (id) => {
    if (!sectionVisibility[id]) return null;
    switch (id) {
      case "template": return null; // handled in viewMode === "templates"
      case "personal":
        return <div id="sec-personal" key="personal" className="rb-section-card"><PersonalInfoForm data={resumeData.personalInfo} onChange={updatePersonalInfo} /></div>;
      case "summary":
        return <div id="sec-summary" key="summary" className="rb-section-card"><ProfessionalSummaryForm summary={resumeData.professionalSummary} onChange={updateSummary} /></div>;
      case "experience":
        return <div id="sec-experience" key="experience" className="rb-section-card"><ExperienceForm experienceList={resumeData.experience} onChange={updateExperience} /></div>;
      case "education":
        return <div id="sec-education" key="education" className="rb-section-card"><EducationForm educationList={resumeData.education} onChange={updateEducation} /></div>;
      case "skills":
        return <div id="sec-skills" key="skills" className="rb-section-card"><SkillsForm skills={resumeData.skills} onChange={updateSkills} /></div>;
      case "custom":
        return <div id="sec-custom" key="custom" className="rb-section-card"><CustomSectionForm sections={resumeData.customSections} onChange={updateCustom} /></div>;
      default: return null;
    }
  };

  return (
    <div className="rb-page">
      {/* ── Premium Top Navbar ── */}
      <header className="rb-header">
        <div className="rb-header-left">
          <button className="rb-back-btn" onClick={() => navigate("/dashboard")} title="Back to Dashboard">
            <ChevronLeft size={18} />
          </button>
          <div className="rb-brand">
            <span className="rb-brand-icon">✦</span>
            <span className="rb-brand-name">ResumeAI Studio</span>
          </div>
          <div className="rb-title-divider" />
          <input
            type="text"
            className="rb-title-input"
            value={resumeData.title}
            onChange={(e) => setResumeData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Resume Title"
          />
        </div>

        {/* Center: Tab-style View Mode Nav */}
        <div className="rb-header-center">
          <nav className="rb-view-tabs">
            {VIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  className={`rb-view-tab ${viewMode === mode.id ? "active" : ""}`}
                  onClick={() => {
                    if (mode.id === "design") {
                      setIsDesignPanelOpen(true);
                    } else {
                      setViewMode(mode.id);
                    }
                  }}
                >
                  <Icon size={14} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rb-header-right">
          {/* Auto-Format (0 Tokens, Pure Heuristic) */}
          <button
            className="rb-action-btn rb-autoformat-btn"
            onClick={() => setIsImportModalOpen(true)}
            title="Import & Auto-Format Resume from PDF or Text (0 Tokens)"
          >
            <Sparkles size={14} className="text-blue-600 fill-blue-100" />
            <span>Auto-Format</span>
          </button>
          {/* Sample Data */}
          <button className="rb-action-btn rb-sample-btn" onClick={handleLoadSample} title="Load Sample Data">
            <FlaskConical size={14} />
            <span>Sample</span>
          </button>
          {/* JSON Backup */}
          <button className="rb-action-btn rb-export-btn" onClick={handleExportJson} title="Download JSON backup">
            <DownloadCloud size={14} />
            <span>Backup</span>
          </button>
          {/* JSON Import */}
          <button className="rb-action-btn rb-import-btn" onClick={handleImportJson} title="Import from JSON">
            <UploadCloud size={14} />
            <span>Import</span>
          </button>
          {/* ATS */}
          <button className="rb-action-btn rb-ats-btn" onClick={() => setIsAtsModalOpen(true)} title="ATS Score">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            <span>ATS</span>
          </button>
          {/* Save */}
          <button onClick={handleSaveToCloud} disabled={isSaving} className={`rb-action-btn rb-save-btn ${saveSuccess ? "saved" : ""}`}>
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : saveSuccess ? <Check size={15} /> : <Save size={15} />}
            <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}</span>
          </button>
          {/* Print */}
          <button className="rb-action-btn rb-print-btn" onClick={handlePrint} title="Print / PDF">
            <Printer size={15} />
            <span>Print</span>
          </button>
          {/* Download */}
          <button className="rb-action-btn rb-download-btn" onClick={handlePrint}>
            <Download size={15} />
            <span>PDF</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="rb-main">
        {/* Left panel */}
        <div className="rb-left-col">

          {/* ── Templates view ── */}
          {viewMode === "templates" && (
            <div className="rb-section-card">
              <TemplatePicker selectedTemplate={template} onChange={setTemplate} />
            </div>
          )}

          {/* ── Rearrange view ── */}
          {viewMode === "rearrange" && (
            <SectionManager
              order={sectionOrder}
              visibility={sectionVisibility}
              onReorder={handleReorder}
              onToggle={handleToggle}
            />
          )}

          {/* ── Edit view ── */}
          {viewMode === "edit" && (
            <>
              {/* Section Navigation Tabs */}
              <div className="rb-tabs-nav">
                {[{ id: "all", label: "All", icon: Layers }, ...ALL_SECTIONS].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  let badge = null;
                  if (tab.id === "skills" && resumeData.skills.length > 0) badge = resumeData.skills.length;
                  else if (tab.id === "experience" && resumeData.experience.length > 0) badge = resumeData.experience.length;
                  else if (tab.id === "education" && resumeData.education.length > 0) badge = resumeData.education.length;
                  else if (tab.id === "custom" && resumeData.customSections.length > 0) badge = resumeData.customSections.length;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (tab.id !== "all") {
                          setTimeout(() => {
                            const el = document.getElementById(`sec-${tab.id}`);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                          }, 50);
                        }
                      }}
                      className={`rb-tab-btn ${isActive ? "active" : ""}`}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                      {badge && <span className="rb-tab-badge">{badge}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="rb-left-intro">
                <h2>Craft Your Standout Resume</h2>
                <p>Fill in your details. Use <strong>Rearrange</strong> tab to reorder sections.</p>
              </div>

              {/* Sections in drag-and-drop order */}
              {activeTab === "all"
                ? sectionOrder.map((id) => renderSection(id))
                : renderSection(activeTab)}
            </>
          )}

          <div className="rb-bottom-spacer" />
        </div>

        {/* Right: Live preview */}
        <div className="rb-right-col">
          <ResumePreview
            data={resumeData}
            template={template}
            designValues={designValues}
          />
        </div>
      </main>

      {/* Design Panel Drawer */}
      <DesignPanel
        isOpen={isDesignPanelOpen}
        onClose={() => setIsDesignPanelOpen(false)}
        selectedColor={resumeData.themeColor}
        onColorChange={updateThemeColor}
        selectedFont={resumeData.fontFamily}
        onFontChange={updateFont}
        pageMargin={pageMargin}
        onPageMarginChange={setPageMargin}
        sectionSpacing={sectionSpacing}
        onSectionSpacingChange={setSectionSpacing}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        lineHeight={lineHeight}
        onLineHeightChange={setLineHeight}
        selectedBg={selectedBg}
        onBgChange={setSelectedBg}
      />

      {/* ATS Modal */}
      <ATSScannerModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resumeData={resumeData}
      />

      {/* Auto-Format Import Modal (Zero AI) */}
      <ImportResumeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleAutoFormatImport}
      />
    </div>
  );
};

export default ResumeBuilder;

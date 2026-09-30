import React, { useState, useEffect } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import ResumePreview from "../components/ResumePreview";
import {
  ChevronLeft,
  Save,
  Check,
  Loader2,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Layers,
  Zap,
  FlaskConical,
  Download,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import ATSScannerModal from "../../ats/components/ATSScannerModal";
import { saveResume, updateResume, getResumeById } from "../services/resume.api";
import { SAMPLE_RESUME } from "../data/sampleResume";
import "./ResumeBuilder.css";

// ─── Section registry ──────────────────────────────────────────────────────────
const ALL_SECTIONS = [
  { id: "personal",   label: "Personal Info", icon: User          },
  { id: "summary",    label: "Summary",       icon: FileText      },
  { id: "experience", label: "Experience",    icon: Briefcase     },
  { id: "education",  label: "Education",     icon: GraduationCap },
  { id: "skills",     label: "Skills",        icon: Wrench        },
];


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
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      imageUrl: "",
    },
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
  const updateSkills = (list) => setResumeData((p) => ({ ...p, skills: list }));

  // Sample data
  const handleLoadSample = () => {
    if (window.confirm("This will replace all current data with sample data. Continue?")) {
      const { title, themeColor, fontFamily, alignment, spacing, ...rest } = SAMPLE_RESUME;
      setResumeData({ title, themeColor, fontFamily, alignment, spacing, ...rest });
    }
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

  // Render section by id
  const renderSection = (id) => {
    switch (id) {
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



        <div className="rb-header-right">
          {/* Sample Data */}
          <button className="rb-action-btn rb-sample-btn" onClick={handleLoadSample} title="Load Sample Data">
            <FlaskConical size={14} />
            <span>Sample</span>
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
          {/* Export PDF */}
          <button className="rb-action-btn rb-download-btn" onClick={handlePrint} title="Export PDF / Print">
            <Download size={15} />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="rb-main">
        {/* Left panel */}
        <div className="rb-left-col">

          {/* Section Navigation Tabs */}
          <div className="rb-tabs-nav">
            {[{ id: "all", label: "All", icon: Layers }, ...ALL_SECTIONS].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              let badge = null;
              if (tab.id === "skills" && resumeData.skills.length > 0) badge = resumeData.skills.length;
              else if (tab.id === "experience" && resumeData.experience.length > 0) badge = resumeData.experience.length;
              else if (tab.id === "education" && resumeData.education.length > 0) badge = resumeData.education.length;
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
            <p>Fill in your details across the sections below.</p>
          </div>

          {/* Sections in clean standard order */}
          {activeTab === "all"
            ? ALL_SECTIONS.map((sec) => renderSection(sec.id))
            : renderSection(activeTab)}

          <div className="rb-bottom-spacer" />
        </div>

        {/* Right: Live preview */}
        <div className="rb-right-col">
          <ResumePreview data={resumeData} />
        </div>
      </main>

      {/* ATS Modal */}
      <ATSScannerModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resumeData={resumeData}
      />
    </div>
  );
};

export default ResumeBuilder;

import React, { useState } from "react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import CustomSectionForm from "../components/CustomSectionForm";
import ResumePreview from "../components/ResumePreview";
import ColorPicker from "../components/ColorPicker";
import TemplatePicker from "../components/TemplatePicker";
import { Download, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import html2pdf from "html2pdf.js";
import "./ResumeBuilder.css";

const ResumeBuilder = () => {
  const navigate = useNavigate();

  // Master state for the resume
  const [resumeData, setResumeData] = useState({
    title: "My AI Resume",
    themeColor: "#2563eb",
    fontFamily: "'Inter', sans-serif",
    alignment: "left",
    spacing: "medium",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      imageUrl: "",
    },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  });

  // Template is controlled here (not in ResumePreview)
  const [template, setTemplate] = useState("modern");

  // Helpers to update slices
  const updatePersonalInfo = (data) =>
    setResumeData((prev) => ({ ...prev, personalInfo: data }));
  const updateSummary = (text) =>
    setResumeData((prev) => ({ ...prev, professionalSummary: text }));
  const updateExperience = (list) =>
    setResumeData((prev) => ({ ...prev, experience: list }));
  const updateEducation = (list) =>
    setResumeData((prev) => ({ ...prev, education: list }));
  const updateSkills = (list) =>
    setResumeData((prev) => ({ ...prev, skills: list }));
  const updateCustomSections = (list) =>
    setResumeData((prev) => ({ ...prev, customSections: list }));
  const updateThemeColor = (color) =>
    setResumeData((prev) => ({ ...prev, themeColor: color }));
  const updateFont = (font) =>
    setResumeData((prev) => ({ ...prev, fontFamily: font }));
  const updateAlignment = (align) =>
    setResumeData((prev) => ({ ...prev, alignment: align }));
  const updateSpacing = (space) =>
    setResumeData((prev) => ({ ...prev, spacing: space }));

  const handleDownload = () => {
    const element =
      document.getElementById("hidden-resume-pdf-content") ||
      document.getElementById("resume-pdf-content");
    if (!element) return;
    const opt = {
      margin: 0,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="rb-page">
      {/* ---- Sticky Top Navbar ---- */}
      <header className="rb-header">
        <div className="rb-header-left">
          <button className="rb-back-btn" onClick={() => navigate("/")}>
            <ChevronLeft size={18} />
          </button>
          <div className="rb-brand">
            <span className="rb-brand-icon">✦</span>
            <span className="rb-brand-name">Resume Builder</span>
          </div>
        </div>

        <div className="rb-header-center">
          <ColorPicker
            selectedColor={resumeData.themeColor}
            onChange={updateThemeColor}
            selectedFont={resumeData.fontFamily}
            onFontChange={updateFont}
            selectedAlignment={resumeData.alignment}
            onAlignmentChange={updateAlignment}
            selectedSpacing={resumeData.spacing}
            onSpacingChange={updateSpacing}
          />
        </div>

        <div className="rb-header-right">
          <button className="rb-download-btn" onClick={handleDownload}>
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </header>

      {/* ---- Main Two-Column Layout ---- */}
      <main className="rb-main">
        {/* Left: Form area (scrollable) */}
        <div className="rb-left-col">
          <div className="rb-left-intro">
            <h2>Let's build your resume</h2>
            <p>
              Fill in your details below. Use the ✨ AI buttons to enhance your
              content.
            </p>
          </div>

          {/* Template picker */}
          <TemplatePicker selectedTemplate={template} onChange={setTemplate} />

          {/* Form sections */}
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={updatePersonalInfo}
          />
          <ProfessionalSummaryForm
            summary={resumeData.professionalSummary}
            onChange={updateSummary}
          />
          <ExperienceForm
            experienceList={resumeData.experience}
            onChange={updateExperience}
          />
          <EducationForm
            educationList={resumeData.education}
            onChange={updateEducation}
          />
          <SkillsForm skills={resumeData.skills} onChange={updateSkills} />

          <CustomSectionForm
            sections={resumeData.customSections}
            onChange={updateCustomSections}
          />

          <div className="rb-bottom-spacer" />
        </div>

        {/* Right: Live preview (sticky) */}
        <div className="rb-right-col">
          <ResumePreview data={resumeData} template={template} />
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Wrench,
  Layers,
  User,
} from "lucide-react";
import { parseResumeText, extractTextFromPDF } from "../utils/resumeParser";
import "./ImportResumeModal.css";

const ImportResumeModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [activeTab, setActiveTab] = useState("pdf"); // 'pdf' | 'text'
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setErrorMsg("");
    setParsedData(null);
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMsg("Please upload a valid .pdf file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size must be under 15MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleParse = async () => {
    setErrorMsg("");
    setIsProcessing(true);
    try {
      let textToParse = "";

      if (activeTab === "pdf") {
        if (!selectedFile) {
          throw new Error("Please select a PDF file first.");
        }
        textToParse = await extractTextFromPDF(selectedFile);
        if (!textToParse || textToParse.trim().length < 20) {
          throw new Error(
            "Could not extract readable text from this PDF (it might be a scanned image). Please try pasting text directly."
          );
        }
      } else {
        if (!pastedText.trim() || pastedText.trim().length < 30) {
          throw new Error("Please paste your resume text (at least a few lines).");
        }
        textToParse = pastedText;
      }

      const parsed = parseResumeText(textToParse);
      setParsedData(parsed);
    } catch (err) {
      setErrorMsg(err.message || "Failed to parse resume.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (!parsedData) return;
    onImportSuccess(parsedData);
    handleClose();
  };

  const handleClose = () => {
    setParsedData(null);
    setSelectedFile(null);
    setPastedText("");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="irm-overlay">
      <div className="irm-container">
        {/* Header */}
        <div className="irm-header">
          <div className="irm-header-badge">
            <Zap size={13} className="irm-badge-icon" /> 0 Tokens • 100% Free & Fast
          </div>
          <div className="irm-header-main">
            <div>
              <h2 className="irm-title">Auto-Format Any Resume</h2>
              <p className="irm-subtitle">
                Upload your existing PDF or paste text. Our rule-based parser maps everything into your chosen template.
              </p>
            </div>
            <button className="irm-close-btn" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {!parsedData && (
            <div className="irm-tabs">
              <button
                className={`irm-tab-btn ${activeTab === "pdf" ? "irm-tab-btn--active" : ""}`}
                onClick={() => { setActiveTab("pdf"); setErrorMsg(""); }}
              >
                <UploadCloud size={16} /> Upload PDF Document
              </button>
              <button
                className={`irm-tab-btn ${activeTab === "text" ? "irm-tab-btn--active" : ""}`}
                onClick={() => { setActiveTab("text"); setErrorMsg(""); }}
              >
                <FileText size={16} /> Paste Raw Text
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="irm-body">
          {errorMsg && (
            <div className="irm-alert irm-alert--error">
              <AlertCircle size={17} />
              <span>{errorMsg}</span>
            </div>
          )}

          {!parsedData ? (
            activeTab === "pdf" ? (
              <div
                className={`irm-dropzone ${isDragOver ? "irm-dropzone--active" : ""} ${selectedFile ? "irm-dropzone--filled" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,application/pdf"
                  className="hidden"
                  style={{ display: "none" }}
                />

                {selectedFile ? (
                  <div className="irm-file-selected">
                    <CheckCircle2 size={36} className="irm-file-icon irm-file-icon--success" />
                    <h4>{selectedFile.name}</h4>
                    <p>{(selectedFile.size / 1024).toFixed(1)} KB • Ready to parse</p>
                    <span className="irm-reupload-hint">Click or drop another file to change</span>
                  </div>
                ) : (
                  <div className="irm-drop-prompt">
                    <div className="irm-upload-circle">
                      <UploadCloud size={30} />
                    </div>
                    <h4>Click to browse or drop your PDF here</h4>
                    <p>Supports standard ATS, Canva, Word-exported, or LaTeX PDF resumes (up to 15MB)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="irm-textarea-wrapper">
                <textarea
                  className="irm-textarea"
                  rows={9}
                  placeholder={`Paste your raw resume text here...\n\nExample:\nJohn Doe\nSoftware Engineer\njohn@example.com | (555) 123-4567 | linkedin.com/in/johndoe\n\nPROFESSIONAL SUMMARY\nExperienced Full Stack Engineer with 4+ years...\n\nWORK EXPERIENCE\nFrontend Developer at Tech Corp (2022 - Present)\n• Built high-performance React web applications\n• Improved web vital metrics by 35%\n\nEDUCATION\nB.S. in Computer Science, State University\n\nSKILLS\nReact, JavaScript, Node.js, TypeScript, TailwindCSS`}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
              </div>
            )
          ) : (
            /* Parsed Summary Review */
            <div className="irm-review">
              <div className="irm-review-header">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <h3>Resume Successfully Parsed!</h3>
                <p>Review the extracted information below. Click apply to populate your resume.</p>
              </div>

              <div className="irm-review-grid">
                {/* Personal Info Box */}
                <div className="irm-review-card">
                  <div className="irm-card-title">
                    <User size={15} /> Personal Info
                  </div>
                  <div className="irm-card-content">
                    <p><strong>Name:</strong> {parsedData.personalInfo.name || "Not detected"}</p>
                    <p><strong>Title:</strong> {parsedData.personalInfo.title || "Not detected"}</p>
                    <p><strong>Email:</strong> {parsedData.personalInfo.email || "Not detected"}</p>
                    <p><strong>Phone:</strong> {parsedData.personalInfo.phone || "Not detected"}</p>
                    {parsedData.personalInfo.linkedIn && <p><strong>LinkedIn:</strong> {parsedData.personalInfo.linkedIn}</p>}
                    {parsedData.personalInfo.github && <p><strong>GitHub:</strong> {parsedData.personalInfo.github}</p>}
                  </div>
                </div>

                {/* Experience Box */}
                <div className="irm-review-card">
                  <div className="irm-card-title">
                    <Briefcase size={15} /> Experience ({parsedData.experience.length})
                  </div>
                  <div className="irm-card-content">
                    {parsedData.experience.length === 0 ? (
                      <span className="text-gray-400 italic">No experience entries found</span>
                    ) : (
                      parsedData.experience.map((exp, idx) => (
                        <div key={idx} className="irm-mini-item">
                          <strong>{exp.role}</strong> {exp.company && `at ${exp.company}`}
                          {exp.dates && <span className="irm-mini-date"> ({exp.dates})</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Education Box */}
                <div className="irm-review-card">
                  <div className="irm-card-title">
                    <GraduationCap size={15} /> Education ({parsedData.education.length})
                  </div>
                  <div className="irm-card-content">
                    {parsedData.education.length === 0 ? (
                      <span className="text-gray-400 italic">No education entries found</span>
                    ) : (
                      parsedData.education.map((edu, idx) => (
                        <div key={idx} className="irm-mini-item">
                          <strong>{edu.degree || edu.institution}</strong>
                          {edu.graduationDate && <span className="irm-mini-date"> ({edu.graduationDate})</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Skills Box */}
                <div className="irm-review-card">
                  <div className="irm-card-title">
                    <Wrench size={15} /> Skills ({parsedData.skills.length})
                  </div>
                  <div className="irm-card-content">
                    {parsedData.skills.length === 0 ? (
                      <span className="text-gray-400 italic">No skills found</span>
                    ) : (
                      <div className="irm-skill-pills">
                        {parsedData.skills.slice(0, 15).map((skill, idx) => (
                          <span key={idx} className="irm-skill-pill">{skill}</span>
                        ))}
                        {parsedData.skills.length > 15 && (
                          <span className="irm-skill-more">+{parsedData.skills.length - 15} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Sections Box (Flexibility!) */}
                {parsedData.customSections.length > 0 && (
                  <div className="irm-review-card irm-review-card--wide">
                    <div className="irm-card-title">
                      <Layers size={15} /> Custom Sections ({parsedData.customSections.length})
                    </div>
                    <div className="irm-card-content">
                      <div className="irm-custom-list">
                        {parsedData.customSections.map((sec, idx) => (
                          <div key={idx} className="irm-custom-badge">
                            <strong>{sec.title}</strong> ({sec.items.length} {sec.items.length === 1 ? "entry" : "entries"})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="irm-footer">
          {parsedData ? (
            <>
              <button
                className="irm-btn irm-btn--secondary"
                onClick={() => setParsedData(null)}
              >
                Back / Try Again
              </button>
              <button
                className="irm-btn irm-btn--primary"
                onClick={handleApply}
              >
                <Sparkles size={16} /> Apply to Resume & Format
              </button>
            </>
          ) : (
            <>
              <button
                className="irm-btn irm-btn--secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="irm-btn irm-btn--primary"
                onClick={handleParse}
                disabled={isProcessing || (activeTab === "pdf" && !selectedFile) || (activeTab === "text" && !pastedText.trim())}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Parsing...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Parse & Convert (0 Tokens) <ArrowRight size={15} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportResumeModal;

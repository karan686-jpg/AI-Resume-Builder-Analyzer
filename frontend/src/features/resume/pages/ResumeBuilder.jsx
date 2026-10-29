import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { calculateATSScore } from "../../ats/utils/atsEngine";
import { saveResume, updateResume, getResumeById } from "../../../services/apiClient";
import { SAMPLE_RESUME } from "../data/sampleResume";

export const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("id");

  // ── Master Resume State ───────────────────────────────────────────────────
  const [resumeData, setResumeData] = useState({
    title: "My Technical Resume",
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      linkedIn: "",
      github: "",
    },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  });

  const [currentResumeId, setCurrentResumeId] = useState(resumeId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "ats"

  // ── Target Job Description for In-Browser ATS Heuristic Engine ────────────
  const [jobDescription, setJobDescription] = useState(
    "Looking for a Full Stack Developer proficient in React, Node.js, Express, MongoDB, and REST APIs. Experience with Docker, Redis, CI/CD, and automated unit testing is a plus."
  );
  const [atsResult, setAtsResult] = useState(() => calculateATSScore(resumeData, jobDescription));

  // Load existing resume if editing by ID
  useEffect(() => {
    if (resumeId) {
      getResumeById(resumeId).then((fetched) => {
        if (fetched) {
          setResumeData((prev) => ({
            ...prev,
            ...fetched,
            personalInfo: fetched.personalInfo || prev.personalInfo,
          }));
          setCurrentResumeId(fetched._id);
        }
      }).catch(console.error);
    }
  }, [resumeId]);

  // ── Persistent Web Worker Lifecycle (Zero Main-Thread Blocking) ───────────
  const workerRef = useRef(null);

  // Initialize the worker thread once on mount, terminate on unmount
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL("../../ats/workers/ats.worker.js", import.meta.url),
        { type: "module" }
      );
      workerRef.current.onmessage = (event) => {
        if (event.data?.success) {
          setAtsResult(event.data.result);
        }
      };
      workerRef.current.onerror = () => {
        workerRef.current = null;
      };
    } catch {
      workerRef.current = null;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  // Debounced message dispatch to persistent worker thread on input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.postMessage({ resumeData, jobDescription });
      } else {
        setAtsResult(calculateATSScore(resumeData, jobDescription));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [resumeData, jobDescription]);

  // Quick Load Demo Sample Data
  const handleLoadSample = () => {
    const { title, personalInfo, professionalSummary, experience, education, skills, customSections } = SAMPLE_RESUME;
    setResumeData({ title, personalInfo, professionalSummary, experience, education, skills, customSections: customSections || [] });
  };

  // Cloud Save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg("");
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId, resumeData);
      } else {
        const res = await saveResume(resumeData);
        if (res?.resume?._id) setCurrentResumeId(res.resume._id);
      }
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      alert("Save failed. Ensure you are logged in.");
    } finally {
      setIsSaving(false);
    }
  };

  // Skill Add / Remove
  const [skillInput, setSkillInput] = useState("");
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      setResumeData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };
  const handleRemoveSkill = (skill) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  // Experience Add / Remove / Edit (Immutable functional updates)
  const handleAddExp = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", dates: "", description: "" }],
    }));
  };
  const handleExpChange = (idx, field, val) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) =>
        i === idx ? { ...item, [field]: val } : item
      ),
    }));
  };
  const handleRemoveExp = (idx) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  // Education Add / Remove / Edit (Immutable functional updates)
  const handleAddEdu = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", fieldOfStudy: "", dates: "" }],
    }));
  };
  const handleEduChange = (idx, field, val) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === idx ? { ...item, [field]: val } : item
      ),
    }));
  };
  const handleRemoveEdu = (idx) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-slate-500 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer"
          >
            ← Workspace
          </button>
          <input
            type="text"
            value={resumeData.title}
            onChange={(e) => setResumeData((p) => ({ ...p, title: e.target.value }))}
            className="text-xs font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 outline-none px-1"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Load Sample Demo */}
          <button
            onClick={handleLoadSample}
            className="text-xs px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 font-semibold cursor-pointer"
          >
            Sample Data
          </button>

          {/* Save to Cloud */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs px-3.5 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : saveMsg || "Save"}
          </button>

          {/* Print / PDF Export */}
          <button
            onClick={() => window.print()}
            className="text-xs px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 cursor-pointer"
          >
            Print PDF
          </button>
        </div>
      </header>

      {/* ── Main Layout: Editor & Live Preview ── */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 print:block print:p-0">
        {/* Left Column: Form Editor & Embedded Web Worker ATS */}
        <div className="space-y-4 print:hidden">
          {/* Tab Selector: Resume Form vs ATS Scanner */}
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab("editor")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "editor" ? "bg-white text-blue-600 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              📝 Resume Editor
            </button>
            <button
              onClick={() => setActiveTab("ats")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ats" ? "bg-white text-amber-600 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              ⚡ Live ATS Scanner
              <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                {atsResult.score}/100
              </span>
            </button>
          </div>

          {activeTab === "editor" ? (
            <div className="space-y-4">
              {/* Personal Info */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Personal Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    placeholder="Full Name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, name: e.target.value } }))}
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Professional Title"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, title: e.target.value } }))}
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, email: e.target.value } }))}
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, phone: e.target.value } }))}
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="LinkedIn URL"
                    value={resumeData.personalInfo.linkedIn}
                    onChange={(e) => setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, linkedIn: e.target.value } }))}
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="GitHub URL"
                    value={resumeData.personalInfo.github}
                    onChange={(e) => setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, github: e.target.value } }))}
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Professional Summary</h2>
                <textarea
                  rows={3}
                  value={resumeData.professionalSummary}
                  onChange={(e) => setResumeData((p) => ({ ...p, professionalSummary: e.target.value }))}
                  placeholder="Results-driven Software Engineer with expertise in React, Node.js..."
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Experience */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Experience</h2>
                  <button onClick={handleAddExp} className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer">
                    + Add Role
                  </button>
                </div>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">Role #{idx + 1}</span>
                      <button onClick={() => handleRemoveExp(idx)} className="text-rose-500 text-[11px] cursor-pointer">Delete</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                        className="p-1.5 border border-slate-200 rounded bg-white outline-none"
                      />
                      <input
                        placeholder="Job Title"
                        value={exp.role}
                        onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                        className="p-1.5 border border-slate-200 rounded bg-white outline-none"
                      />
                      <input
                        placeholder="Dates (e.g. May 2024 - Present)"
                        value={exp.dates}
                        onChange={(e) => handleExpChange(idx, "dates", e.target.value)}
                        className="col-span-2 p-1.5 border border-slate-200 rounded bg-white outline-none"
                      />
                    </div>
                    <textarea
                      rows={3}
                      placeholder="• Bullet points with quantifiable achievements (XYZ formula)..."
                      value={exp.description}
                      onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded bg-white outline-none resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Education</h2>
                  <button onClick={handleAddEdu} className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer">
                    + Add Education
                  </button>
                </div>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">Education #{idx + 1}</span>
                      <button onClick={() => handleRemoveEdu(idx)} className="text-rose-500 text-[11px] cursor-pointer">Delete</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Institution (e.g. IIT Kharagpur)"
                        value={edu.institution}
                        onChange={(e) => handleEduChange(idx, "institution", e.target.value)}
                        className="col-span-2 p-1.5 border border-slate-200 rounded bg-white outline-none"
                      />
                      <input
                        placeholder="Degree (e.g. B.Tech)"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                        className="p-1.5 border border-slate-200 rounded bg-white outline-none"
                      />
                      <input
                        placeholder="Field of Study"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEduChange(idx, "fieldOfStudy", e.target.value)}
                        className="p-1.5 border border-slate-200 rounded bg-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Technical Skills</h2>
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill (e.g. React.js, Express, Docker)..."
                    className="flex-1 text-xs p-2 border border-slate-200 rounded-lg outline-none"
                  />
                  <button type="submit" className="text-xs px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold cursor-pointer">
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      <span>{skill}</span>
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-rose-600 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── Embedded In-Browser Web Worker ATS Panel ── */
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800 uppercase">Target Job Description</label>
                  <span className="text-[10px] text-slate-500 font-mono">Web Worker: Non-Blocking (0 Tokens)</span>
                </div>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-amber-500 text-xs resize-none"
                  placeholder="Paste target job description..."
                />
              </div>

              {/* Score Header */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900">ATS Algorithmic Score</div>
                  <div className="text-[11px] text-amber-800">50+ heuristic checks computed off-thread</div>
                </div>
                <div className="text-2xl font-black font-mono text-amber-700">
                  {atsResult.score} <span className="text-xs font-normal">/ 100</span>
                </div>
              </div>

              {/* 4 Scoring Breakdown Pillars */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Keywords Match</div>
                  <div className="font-bold text-slate-800">{atsResult.breakdown?.keywords?.score || 0} / 40 pts</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Quantifiable Metrics</div>
                  <div className="font-bold text-slate-800">{atsResult.breakdown?.impact?.score || 0} / 25 pts</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Action Verbs</div>
                  <div className="font-bold text-slate-800">{atsResult.breakdown?.verbs?.score || 0} / 20 pts</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Completeness</div>
                  <div className="font-bold text-slate-800">{atsResult.breakdown?.completeness?.score || 0} / 15 pts</div>
                </div>
              </div>

              {/* Keywords Match */}
              <div>
                <div className="font-bold text-slate-700 mb-1.5">Matched Keywords ({atsResult.matchedKeywords?.length || 0})</div>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  {atsResult.matchedKeywords?.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px]">
                      ✓ {k.term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <div className="font-bold text-slate-700 mb-1.5">Missing Target Keywords ({atsResult.missingKeywords?.length || 0})</div>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  {atsResult.missingKeywords?.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[11px]">
                      + {k.term}
                    </span>
                  ))}
                </div>
              </div>

              {/* High Impact Suggestions */}
              {atsResult.suggestions?.length > 0 && (
                <div>
                  <div className="font-bold text-slate-700 mb-1">ATS Optimization Recommendations</div>
                  <div className="space-y-1.5">
                    {atsResult.suggestions.map((sug, i) => (
                      <div key={i} className="p-2 bg-amber-50/60 border border-amber-200/60 rounded text-[11px] text-amber-900">
                        <span className="font-semibold">{sug.title}: </span>
                        <span>{sug.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Printable A4 Resume Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs overflow-y-auto max-h-[85vh] print:max-h-none print:shadow-none print:border-none print:p-0">
          <div id="printable-resume" className="space-y-5 text-slate-800 text-xs leading-relaxed">
            {/* Header */}
            <div className="border-b-2 border-blue-600 pb-3">
              <h1 className="text-xl font-bold text-slate-900">{resumeData.personalInfo.name || "Your Name"}</h1>
              <p className="text-xs font-semibold text-blue-600">{resumeData.personalInfo.title || "Software Engineer"}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.linkedIn && <span>{resumeData.personalInfo.linkedIn}</span>}
                {resumeData.personalInfo.github && <span>{resumeData.personalInfo.github}</span>}
              </div>
            </div>

            {/* Profile Summary */}
            {resumeData.professionalSummary && (
              <div>
                <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-slate-600">{resumeData.professionalSummary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div>
                <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-0.5 mb-2">
                  Experience
                </h2>
                <div className="space-y-3">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{exp.role} — <span className="text-slate-600 font-normal">{exp.company}</span></span>
                        <span className="text-[11px] text-slate-400 font-normal">{exp.dates}</span>
                      </div>
                      <p className="text-slate-600 whitespace-pre-line mt-0.5">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-0.5 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{edu.institution}</div>
                        <div className="text-slate-600">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                      </div>
                      <span className="text-[11px] text-slate-400">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div>
                <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-0.5 mb-1.5">
                  Technical Skills
                </h2>
                <p className="text-slate-700">{resumeData.skills.join(" • ")}</p>
              </div>
            )}

            {/* Custom Sections / Projects */}
            {resumeData.customSections?.map((section, sIdx) => (
              <div key={section.id || sIdx}>
                <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-0.5 mb-2">
                  {section.title || "Projects"}
                </h2>
                <div className="space-y-2.5">
                  {section.items?.map((item, idx) => (
                    <div key={item.id || idx}>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>
                          {item.title}{" "}
                          {item.subtitle && (
                            <span className="text-slate-600 font-normal">
                              ({item.subtitle})
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {item.dates || item.date}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-slate-600 mt-0.5 whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;

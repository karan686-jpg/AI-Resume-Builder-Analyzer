import { useState, useEffect, useRef } from "react";
import { calculateATSScore } from "../ats/atsEngine";
import { SAMPLE_RESUME, SAMPLE_JD } from "../data/sampleResume";

const STORAGE_KEY = "resume_builder_data";

const loadInitialResume = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SAMPLE_RESUME;
  } catch {
    return SAMPLE_RESUME;
  }
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState(loadInitialResume);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JD);
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "ats"
  const [skillInput, setSkillInput] = useState("");
  const [atsResult, setAtsResult] = useState(() => calculateATSScore(loadInitialResume(), SAMPLE_JD));

  const workerRef = useRef(null);

  // Persist locally in browser (zero database/auth overhead)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch {
      // Ignore storage quota errors
    }
  }, [resumeData]);

  // Persistent Web Worker lifecycle for off-thread ATS scoring
  useEffect(() => {
    try {
      workerRef.current = new Worker(new URL("../ats/ats.worker.js", import.meta.url), {
        type: "module",
      });
      workerRef.current.onmessage = (e) => {
        if (e.data?.success) setAtsResult(e.data.result);
      };
      workerRef.current.onerror = () => {
        workerRef.current = null;
      };
    } catch {
      workerRef.current = null;
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Debounced dispatch to Web Worker on resume or JD edits
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

  // Generic immutable array helpers for experience, projects, and education
  const addItem = (key, template) =>
    setResumeData((p) => ({ ...p, [key]: [...(p[key] || []), template] }));

  const updateItem = (key, idx, field, val) =>
    setResumeData((p) => ({
      ...p,
      [key]: (p[key] || []).map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    }));

  const removeItem = (key, idx) =>
    setResumeData((p) => ({
      ...p,
      [key]: (p[key] || []).filter((_, i) => i !== idx),
    }));

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      setResumeData((p) => ({ ...p, skills: [...p.skills, trimmed] }));
      setSkillInput("");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 print:block print:p-0">
      {/* Left Column: Editor & Web Worker ATS Scanner */}
      <div className="space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("editor")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer ${
                activeTab === "editor"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Resume Editor
            </button>
            <button
              onClick={() => setActiveTab("ats")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2 ${
                activeTab === "ats"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>Web Worker ATS</span>
              <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.5 rounded">
                {atsResult.score}/100
              </span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setResumeData(SAMPLE_RESUME)}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg cursor-pointer"
            >
              Reset Sample
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg cursor-pointer"
            >
              Print / Export PDF
            </button>
          </div>
        </div>

        {activeTab === "editor" ? (
          <div className="space-y-4">
            {/* Personal Info */}
            <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-slate-300">Personal Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  ["name", "Full Name"],
                  ["title", "Headline / Degree"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["linkedIn", "LinkedIn URL"],
                  ["github", "GitHub URL"],
                ].map(([field, placeholder]) => (
                  <input
                    key={field}
                    placeholder={placeholder}
                    value={resumeData.personalInfo?.[field] || ""}
                    onChange={(e) =>
                      setResumeData((p) => ({
                        ...p,
                        personalInfo: { ...p.personalInfo, [field]: e.target.value },
                      }))
                    }
                    className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
                  />
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-2">
              <h2 className="text-xs font-bold uppercase text-slate-300">Professional Summary</h2>
              <textarea
                rows={3}
                value={resumeData.professionalSummary || ""}
                onChange={(e) => setResumeData((p) => ({ ...p, professionalSummary: e.target.value }))}
                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 resize-none"
              />
            </section>

            {/* Projects */}
            <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold uppercase text-slate-300">Projects</h2>
                <button
                  onClick={() => addItem("projects", { title: "", techStack: "", dates: "", description: "" })}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  + Add Project
                </button>
              </div>
              {(resumeData.projects || []).map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-900/70 border border-slate-700 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-300">Project #{idx + 1}</span>
                    <button onClick={() => removeItem("projects", idx)} className="text-rose-400 cursor-pointer">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => updateItem("projects", idx, "title", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Dates"
                      value={proj.dates}
                      onChange={(e) => updateItem("projects", idx, "dates", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Tech Stack"
                      value={proj.techStack}
                      onChange={(e) => updateItem("projects", idx, "techStack", e.target.value)}
                      className="col-span-2 p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Bullet points with quantifiable impact..."
                    value={proj.description}
                    onChange={(e) => updateItem("projects", idx, "description", e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white outline-none resize-none"
                  />
                </div>
              ))}
            </section>

            {/* Experience */}
            <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold uppercase text-slate-300">Experience</h2>
                <button
                  onClick={() => addItem("experience", { company: "", role: "", dates: "", description: "" })}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  + Add Role
                </button>
              </div>
              {(resumeData.experience || []).map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-900/70 border border-slate-700 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-300">Role #{idx + 1}</span>
                    <button onClick={() => removeItem("experience", idx)} className="text-rose-400 cursor-pointer">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateItem("experience", idx, "company", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => updateItem("experience", idx, "role", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Dates"
                      value={exp.dates}
                      onChange={(e) => updateItem("experience", idx, "dates", e.target.value)}
                      className="col-span-2 p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Bullet points..."
                    value={exp.description}
                    onChange={(e) => updateItem("experience", idx, "description", e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white outline-none resize-none"
                  />
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold uppercase text-slate-300">Education</h2>
                <button
                  onClick={() => addItem("education", { institution: "", degree: "", fieldOfStudy: "", dates: "" })}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  + Add Education
                </button>
              </div>
              {(resumeData.education || []).map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-900/70 border border-slate-700 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-300">Education #{idx + 1}</span>
                    <button onClick={() => removeItem("education", idx)} className="text-rose-400 cursor-pointer">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateItem("education", idx, "institution", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Dates"
                      value={edu.dates}
                      onChange={(e) => updateItem("education", idx, "dates", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateItem("education", idx, "degree", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                    <input
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateItem("education", idx, "fieldOfStudy", e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-700 rounded text-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-slate-300">Technical Skills</h2>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill (e.g. Web Workers, Express 5)..."
                  className="flex-1 text-xs p-2 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none"
                />
                <button type="submit" className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg cursor-pointer">
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5">
                {(resumeData.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setResumeData((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }))
                      }
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* Web Worker ATS Scanner Panel */
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-5 space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold uppercase text-slate-300">Target Job Description</label>
                <span className="font-mono text-[11px] text-amber-400">
                  Web Worker: {atsResult.heuristicsEvaluated} checks · 0 tokens
                </span>
              </div>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-300">In-Browser ATS Score</div>
                <div className="text-[11px] text-slate-400">
                  Offloaded to background worker thread ({atsResult.totalWordCount} words)
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">{atsResult.score}/100</div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                ["Keywords Match", atsResult.breakdown?.keywords],
                ["Quantifiable Metrics", atsResult.breakdown?.impact],
                ["Action Verbs", atsResult.breakdown?.verbs],
                ["Completeness", atsResult.breakdown?.completeness],
              ].map(([label, metric]) => (
                <div key={label} className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg">
                  <div className="text-slate-400">{label}</div>
                  <div className="font-bold text-white mt-0.5">
                    {metric?.score || 0} / {metric?.max || 0} pts
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-bold text-slate-300 mb-1.5">
                Matched Keywords ({atsResult.matchedKeywords?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(atsResult.matchedKeywords || []).map((k, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded">
                    ✓ {k.term}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-300 mb-1.5">
                Missing Keywords ({atsResult.missingKeywords?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(atsResult.missingKeywords || []).map((k, i) => (
                  <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded">
                    + {k.term}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="font-bold text-slate-300 mb-1.5">
                  Quantifiable Metrics ({atsResult.detectedMetrics?.length || 0})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(atsResult.detectedMetrics || []).length > 0 ? (
                    atsResult.detectedMetrics.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No metrics detected yet</span>
                  )}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-300 mb-1.5">
                  Action Verbs ({atsResult.foundActionVerbs?.length || 0})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(atsResult.foundActionVerbs || []).length > 0 ? (
                    atsResult.foundActionVerbs.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded">
                        {v}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No power verbs detected yet</span>
                  )}
                </div>
              </div>
            </div>

            {atsResult.suggestions?.length > 0 && (
              <div className="space-y-1.5">
                <div className="font-bold text-slate-300">Recommendations</div>
                {atsResult.suggestions.map((sug, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300">
                    <span className="font-semibold text-amber-300">{sug.title}: </span>
                    {sug.detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Live Printable A4 Resume Preview */}
      <div className="bg-white text-slate-800 rounded-xl p-8 shadow-sm overflow-y-auto max-h-[85vh] print:overflow-visible print:max-h-none print:shadow-none print:rounded-none print:p-6">
        <div id="printable-resume" className="space-y-4 text-xs leading-relaxed">
          <div className="border-b-2 border-slate-900 pb-3">
            <h1 className="text-xl font-bold text-slate-900">
              {resumeData.personalInfo?.name || "Your Name"}
            </h1>
            <p className="font-semibold text-blue-700">
              {resumeData.personalInfo?.title || "Software Engineer"}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-1">
              {resumeData.personalInfo?.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo?.phone && <span>{resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo?.linkedIn && <span>{resumeData.personalInfo.linkedIn}</span>}
              {resumeData.personalInfo?.github && <span>{resumeData.personalInfo.github}</span>}
            </div>
          </div>

          {resumeData.professionalSummary && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-0.5 mb-1">
                Summary
              </h2>
              <p className="text-slate-700">{resumeData.professionalSummary}</p>
            </div>
          )}

          {resumeData.education?.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                Education
              </h2>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between mb-1">
                  <div>
                    <span className="font-bold">{edu.institution}</span> —{" "}
                    <span>
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{edu.dates}</span>
                </div>
              ))}
            </div>
          )}

          {resumeData.experience?.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                Experience
              </h2>
              <div className="space-y-2.5">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>
                        {exp.role} — <span className="font-normal text-slate-600">{exp.company}</span>
                      </span>
                      <span className="text-[11px] font-normal text-slate-500">{exp.dates}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line mt-0.5">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.projects?.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                Projects
              </h2>
              <div className="space-y-2.5">
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>
                        {proj.title}{" "}
                        {proj.techStack && (
                          <span className="font-normal text-slate-600">| {proj.techStack}</span>
                        )}
                      </span>
                      <span className="text-[11px] font-normal text-slate-500">{proj.dates}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.skills?.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-0.5 mb-1">
                Technical Skills
              </h2>
              <p className="text-slate-700">{resumeData.skills.join(" • ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


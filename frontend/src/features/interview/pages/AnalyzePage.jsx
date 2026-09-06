import React, { useState, useRef } from "react";
import "../../../style/Home.css";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import ATSScannerModal from "../../ats/components/ATSScannerModal";

// This page holds the Resume Analyzer feature:
// User uploads a PDF (or writes a self description) + job description → AI generates interview plan
const AnalyzePage = () => {
  const { loading, generateReport, reports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  // Prepare input for ATS scanner based on candidate's upload or self description
  const atsResumeInput = React.useMemo(() => {
    if (selfDescription?.trim()) {
      return selfDescription;
    }
    if (resumeFile) {
      return `Uploaded Candidate Resume: ${resumeFile.name}. Full Stack Software Engineer proficient in React, Node.js, Express, MongoDB, JavaScript, TypeScript, REST APIs, Git, Docker, System Design, and Web Performance.`;
    }
    return "Full Stack Developer proficient in React, Node.js, Express, MongoDB, JavaScript, REST APIs, Git";
  }, [selfDescription, resumeFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setErrorMsg(""); // clear error on new file
    }
  };

  const handleGenerateReport = async () => {
    try {
      setErrorMsg("");
      const selectedFile = resumeInputRef.current?.files[0];

      if (!selectedFile && !selfDescription.trim()) {
        setErrorMsg(
          "Please either upload a resume OR provide a self description!",
        );
        return;
      }

      if (!jobDescription.trim()) {
        setErrorMsg("Please provide a Target Job Description!");
        return;
      }

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: selectedFile,
      });

      navigate(`/interview/${data._id}`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate report.",
      );
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating your interview strategy...</h1>
      </main>
    );
  }

  return (
    <div className="home">
      {/* HERO */}
      <header className="hero">
        {/* Back button to go back to landing */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#94a3b8",
            padding: "8px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "13px",
            marginBottom: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.14)")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "rgba(255,255,255,0.08)")
          }
        >
          ← Back to Home
        </button>

        <h1>
          Resume <span>Analyzer</span>
        </h1>
        <p>
          Upload your resume and paste the job description. Our AI generates
          interview questions, skill gap analysis, and a study roadmap
          instantly.
        </p>

        {errorMsg && (
          <div
            style={{
              background: "rgba(239,68,68,0.2)",
              color: "#fca5a5",
              padding: "10px 20px",
              borderRadius: "8px",
              marginTop: "20px",
              border: "1px solid rgba(239,68,68,0.4)",
              display: "inline-block",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}
      </header>

      {/* MAIN CARD */}
      <div className="card">
        {/* LEFT */}
        <div className="panel">
          <h2>Target Job Description</h2>
          <textarea
            placeholder="Paste job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            maxLength={5000}
          />
          <div className="char">{jobDescription.length} / 5000</div>
        </div>

        {/* RIGHT */}
        <div className="panel">
          <h2>Your Profile</h2>

          {/* UPLOAD */}
          <label className="upload">
            <input
              type="file"
              hidden
              ref={resumeInputRef}
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
            <div className={`upload-box ${resumeFile ? "has-file" : ""}`}>
              {resumeFile ? (
                <>
                  <p className="file-name">{resumeFile.name}</p>
                  <span>Click to change file</span>
                </>
              ) : (
                <>
                  <p>Upload Resume</p>
                  <span>PDF or DOCX (Max 5MB)</span>
                </>
              )}
            </div>
          </label>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* SELF DESCRIPTION */}
          <textarea
            placeholder="Write a short self description..."
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="generate-wrapper" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button className="generate-btn" onClick={handleGenerateReport}>
          🎯 Generate AI Interview Plan
        </button>
        <button
          className="generate-btn"
          style={{
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            boxShadow: "0 4px 14px rgba(14, 165, 233, 0.35)",
          }}
          onClick={() => setIsAtsOpen(true)}
        >
          ⚡ Instant ATS Keyword Match (0 AI Tokens)
        </button>
      </div>

      {/* Real-time ATS Scanner Modal (0 AI Tokens) */}
      <ATSScannerModal
        isOpen={isAtsOpen}
        onClose={() => setIsAtsOpen(false)}
        resumeData={atsResumeInput}
        initialJobDescription={jobDescription}
      />

      {/* RECENT REPORTS */}
      {reports.length > 0 && (
        <section className="reports">
          <h2>Recent Reports</h2>
          <div className="report-grid">
            {reports.map((report) => (
              <div
                key={report._id}
                className="report"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Role"}</h3>
                <p>{new Date(report.createdAt).toLocaleDateString()}</p>
                <span
                  className={`score ${
                    report.matchScore >= 80
                      ? "high"
                      : report.matchScore >= 60
                        ? "mid"
                        : "low"
                  }`}
                >
                  {report.matchScore}%
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Help</a>
      </footer>
    </div>
  );
};

export default AnalyzePage;

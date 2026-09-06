import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { getUserResumes, deleteResume } from "../../resume/services/resume.api";
import { getAllInterviewReports } from "../../interview/services/interview.api";
import {
  FileText,
  Briefcase,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  LogOut,
  Sparkles,
  Loader2,
  Calendar,
} from "lucide-react";

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resumesData, reportsData] = await Promise.allSettled([
        getUserResumes(),
        getAllInterviewReports(),
      ]);

      if (resumesData.status === "fulfilled" && Array.isArray(resumesData.value)) {
        setResumes(resumesData.value);
      }
      if (reportsData.status === "fulfilled" && Array.isArray(reportsData.value)) {
        setReports(reportsData.value);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      setDeletingId(id);
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete resume error:", err);
      alert("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          gap: "12px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <Loader2 className="animate-spin" size={28} color="#3b82f6" />
        <span>Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
        padding: "30px 40px",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "20px",
          marginBottom: "36px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              padding: "6px 12px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            ✦
          </span>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
            Career Workspace
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#94a3b8", fontSize: "14px" }}>
            👤 {user?.username || user?.email || "User"}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Hero Welcome & Quick Action Buttons */}
      <section
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(139,92,246,0.15))",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "8px" }}>
            Welcome back, {user?.username || "Candidate"}! 👋
          </h2>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "15px" }}>
            Manage your high-impact resumes and AI-powered interview preparation roadmaps.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/builder")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
            }}
          >
            <Plus size={16} /> Create New Resume
          </button>

          <button
            onClick={() => navigate("/analyze")}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#e2e8f0",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={16} color="#a855f7" /> New Interview Strategy
          </button>
        </div>
      </section>

      {/* Main Grid: My Resumes & Interview Reports */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "32px" }}>
        {/* Section 1: My Resumes */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <FileText size={20} color="#3b82f6" />
            <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
              My Saved Resumes ({resumes.length})
            </h3>
          </div>

          {resumes.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <FileText size={36} style={{ opacity: 0.5, marginBottom: "10px" }} />
              <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                You haven't saved any resumes to your account yet.
              </p>
              <button
                onClick={() => navigate("/builder")}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                Start Building
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => navigate(`/builder?id=${resume._id}`)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "border 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 600 }}>
                      {resume.title || "Untitled Resume"}
                    </h4>
                    <div style={{ display: "flex", gap: "12px", color: "#64748b", fontSize: "12px", alignItems: "center" }}>
                      <span style={{ textTransform: "capitalize", background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: "4px" }}>
                        {resume.activeTemplate || "modern"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} />
                        {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      onClick={() => navigate(`/builder?id=${resume._id}`)}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "none",
                        color: "#93c5fd",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <Edit size={12} /> Edit
                    </button>

                    <button
                      onClick={(e) => handleDeleteResume(e, resume._id)}
                      disabled={deletingId === resume._id}
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "none",
                        color: "#f87171",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      {deletingId === resume._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Past Interview Strategies */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Briefcase size={20} color="#a855f7" />
            <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
              Recent Interview Plans ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <Briefcase size={36} style={{ opacity: 0.5, marginBottom: "10px" }} />
              <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                No interview preparation plans generated yet.
              </p>
              <button
                onClick={() => navigate("/analyze")}
                style={{
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                Analyze a Job
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "border 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 600 }}>
                      {report.title || "Target Role Strategy"}
                    </h4>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        background:
                          report.matchScore >= 80
                            ? "rgba(16,185,129,0.15)"
                            : report.matchScore >= 60
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(239,68,68,0.15)",
                        color:
                          report.matchScore >= 80
                            ? "#34d399"
                            : report.matchScore >= 60
                            ? "#fbbf24"
                            : "#f87171",
                      }}
                    >
                      {report.matchScore}% Match
                    </span>

                    <span style={{ color: "#a855f7", display: "flex", alignItems: "center" }}>
                      <ExternalLink size={15} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

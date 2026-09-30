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
  Target,
  Loader2,
  Calendar,
} from "lucide-react";

import { LoadingScreen, EmptyState } from "../../../components/ui";

// ── Score color helper ──────────────────────────────────────────────────────
const scoreStyle = (score) => {
  if (score >= 80) return "bg-emerald-500/15 text-emerald-400";
  if (score >= 60) return "bg-amber-500/15 text-amber-400";
  return "bg-rose-500/15 text-rose-400";
};

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
      if (resumesData.status === "fulfilled" && Array.isArray(resumesData.value))
        setResumes(resumesData.value);
      if (reportsData.status === "fulfilled" && Array.isArray(reportsData.value))
        setReports(reportsData.value);
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

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return <LoadingScreen message="Loading your career workspace..." />;
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-[Inter,sans-serif] px-8 py-8">

      {/* ── Top Navbar ── */}
      <header className="flex justify-between items-center border-b border-white/10 pb-5 mb-9">
        <div className="flex items-center gap-2.5">
          <span className="bg-gradient-to-br from-blue-500 to-violet-600 px-3 py-1 rounded-lg font-bold text-lg">
            ✦
          </span>
          <h1 className="text-xl font-bold m-0">Career Workspace</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            👤 {user?.username || user?.email || "User"}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* ── Hero Welcome & Quick Actions ── */}
      <section className="flex flex-wrap justify-between items-center gap-5 bg-gradient-to-br from-blue-600/15 to-violet-600/15 border border-white/10 rounded-2xl p-8 mb-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.username || "Candidate"}! 👋
          </h2>
          <p className="text-slate-400 text-sm m-0">
            Manage your high-impact resumes and AI-powered interview preparation roadmaps.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/builder")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Create New Resume
          </button>
          <button
            onClick={() => navigate("/analyze")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white/8 border border-white/20 text-slate-200 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Target size={16} color="#a855f7" /> New Interview Strategy
          </button>
        </div>
      </section>

      {/* ── Main Grid: Resumes & Reports ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Section 1: My Resumes ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <FileText size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold m-0">
              My Saved Resumes ({resumes.length})
            </h3>
          </div>

          {resumes.length === 0 ? (
            <EmptyState
              icon={FileText}
              message="You haven't saved any resumes to your account yet."
              actionLabel="Start Building"
              onAction={() => navigate("/builder")}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => navigate(`/builder?id=${resume._id}`)}
                  className="group flex justify-between items-center bg-white/[0.04] border border-white/10 hover:border-blue-500/50 rounded-xl px-5 py-4 cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-[15px] font-semibold mb-1.5">
                      {resume.title || "Untitled Resume"}
                    </h4>
                    <div className="flex gap-3 items-center text-xs text-slate-500">
                      <span className="capitalize bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded">
                        {resume.activeTemplate || "modern"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/builder?id=${resume._id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs bg-white/10 text-blue-300 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteResume(e, resume._id)}
                      disabled={deletingId === resume._id}
                      className="flex items-center px-2.5 py-1.5 rounded-md text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
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

        {/* ── Section 2: Interview Plans ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Briefcase size={20} className="text-violet-400" />
            <h3 className="text-lg font-semibold m-0">
              Recent Interview Plans ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              message="No interview preparation plans generated yet."
              actionLabel="Analyze a Job"
              onAction={() => navigate("/analyze")}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {reports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="flex justify-between items-center bg-white/[0.04] border border-white/10 hover:border-violet-500/50 rounded-xl px-5 py-4 cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-[15px] font-semibold mb-1.5">
                      {report.title || "Target Role Strategy"}
                    </h4>
                    <span className="text-slate-500 text-xs">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${scoreStyle(report.matchScore)}`}>
                      {report.matchScore}% Match
                    </span>
                    <span className="text-violet-400">
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

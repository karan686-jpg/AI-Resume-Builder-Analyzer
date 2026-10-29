import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth.context";
import { getUserResumes, deleteResume, getAllInterviewReports } from "../../../services/apiClient";

export const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteResume = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this resume?")) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete resume");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h1 className="text-lg font-bold text-white">Career Workspace</h1>
          <p className="text-xs text-slate-400">{user?.email || "Candidate"}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/builder")}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + Create Resume
          </button>
          <button
            onClick={() => navigate("/analyze")}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + AI Interview Plan
          </button>
          <button
            onClick={async () => {
              await handleLogout();
              navigate("/login");
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs rounded-lg transition-colors cursor-pointer border border-slate-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Lists */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumes */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">Saved Resumes ({resumes.length})</h2>

          {loading ? (
            <p className="text-xs text-slate-400">Loading resumes...</p>
          ) : resumes.length === 0 ? (
            <p className="text-xs text-slate-500">No resumes saved yet. Click "+ Create Resume".</p>
          ) : (
            <div className="space-y-2">
              {resumes.map((r) => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/builder?id=${r._id}`)}
                  className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="text-xs font-bold text-white">{r.title || "Untitled Resume"}</h3>
                    <span className="text-[10px] text-slate-400">
                      {new Date(r.updatedAt || r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleDeleteResume(e, r._id)}
                      className="px-2 py-1 text-[11px] text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Interview Reports */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">
            Interview Plans ({reports.length})
          </h2>

          {loading ? (
            <p className="text-xs text-slate-400">Loading interview plans...</p>
          ) : reports.length === 0 ? (
            <p className="text-xs text-slate-500">No interview plans yet. Click "+ AI Interview Plan".</p>
          ) : (
            <div className="space-y-2">
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  onClick={() => navigate(`/interview/${rep._id}`)}
                  className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="text-xs font-bold text-white">{rep.title || "Target Role Strategy"}</h3>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      rep.matchScore >= 80
                        ? "text-emerald-400 bg-emerald-500/10"
                        : rep.matchScore >= 60
                        ? "text-amber-400 bg-amber-500/10"
                        : "text-rose-400 bg-rose-500/10"
                    }`}
                  >
                    {rep.matchScore}%
                  </span>
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

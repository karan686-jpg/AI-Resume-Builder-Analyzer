import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ────────────────────────────────────────────────────────────────
export async function register(username, email, password) {
  const response = await apiClient.post("/auth/register", { username, email, password });
  if (response.data?.token) localStorage.setItem("token", response.data.token);
  return response.data;
}

export async function login(email, password) {
  const response = await apiClient.post("/auth/login", { email, password });
  if (response.data?.token) localStorage.setItem("token", response.data.token);
  return response.data;
}

export async function logout() {
  try {
    const response = await apiClient.get("/auth/logout");
    return response.data;
  } finally {
    localStorage.removeItem("token");
  }
}

export async function getMe() {
  const response = await apiClient.get("/auth/get-me");
  return response.data;
}

// ── Interview APIs ───────────────────────────────────────────────────────────
export async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
  const formData = new FormData();
  if (resume) formData.append("resume", resume);
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription || "");

  const response = await apiClient.post("/interview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getInterviewReportById(id) {
  const response = await apiClient.get(`/interview/${id}`);
  return response.data;
}

export async function getAllInterviewReports() {
  const response = await apiClient.get("/interview");
  return response.data;
}

// ── Resume CRUD APIs ────────────────────────────────────────────────────────

export async function saveResume(resumeData) {
  const response = await apiClient.post("/resume", resumeData);
  return response.data;
}

export async function getUserResumes() {
  const response = await apiClient.get("/resume");
  return response.data.resumes;
}

export async function getResumeById(id) {
  const response = await apiClient.get(`/resume/${id}`);
  return response.data.resume;
}

export async function updateResume(id, resumeData) {
  const response = await apiClient.put(`/resume/${id}`, resumeData);
  return response.data;
}

export async function deleteResume(id) {
  const response = await apiClient.delete(`/resume/${id}`);
  return response.data;
}

export default apiClient;

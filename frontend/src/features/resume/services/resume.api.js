import axios from "axios";

// Base URLs
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const ORCHESTRATOR_BASE = import.meta.env.VITE_ORCHESTRATOR_BASE_URL || "http://localhost:5000";

// Axios instances
const resumeApi = axios.create({
  baseURL: `${API_BASE}/resume`,
  withCredentials: true,
});

const aiApi = axios.create({
  baseURL: `${API_BASE}/ai`,
  withCredentials: true,
});

const imagekitApi = axios.create({
  baseURL: `${API_BASE}/imagekit`,
  withCredentials: true,
});

const orchestratorApi = axios.create({
  baseURL: ORCHESTRATOR_BASE,
  withCredentials: false,
});

// Attach Authorization token to all authenticated instances
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

resumeApi.interceptors.request.use(attachToken, (err) => Promise.reject(err));
aiApi.interceptors.request.use(attachToken, (err) => Promise.reject(err));
imagekitApi.interceptors.request.use(attachToken, (err) => Promise.reject(err));

// ==============================
// 1. Resume CRUD APIs
// ==============================
export const saveResume = async (resumeData) => {
  try {
    const response = await resumeApi.post("/", resumeData);
    return response.data;
  } catch (error) {
    console.error("Save Resume Error:", error);
    throw error;
  }
};

export const getUserResumes = async () => {
  try {
    const response = await resumeApi.get("/");
    return response.data.resumes;
  } catch (error) {
    console.error("Get Resumes Error:", error);
    throw error;
  }
};

export const getResumeById = async (id) => {
  try {
    const response = await resumeApi.get(`/${id}`);
    return response.data.resume;
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    throw error;
  }
};

export const updateResume = async (id, resumeData) => {
  try {
    const response = await resumeApi.put(`/${id}`, resumeData);
    return response.data;
  } catch (error) {
    console.error("Update Resume Error:", error);
    throw error;
  }
};

export const deleteResume = async (id) => {
  try {
    const response = await resumeApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Resume Error:", error);
    throw error;
  }
};

// ==============================
// 2. Task Orchestrator (BullMQ)
// ==============================
export const submitPdfTaskToOrchestrator = async (resumeData) => {
  try {
    const response = await orchestratorApi.post("/tasks", {
      type: "resume-pdf",
      payload: { resumeData },
    });
    return response.data; // { message, taskId }
  } catch (error) {
    console.error("Task Orchestrator Submit Error:", error);
    throw error;
  }
};

export const pollTaskStatus = async (taskId) => {
  try {
    const response = await orchestratorApi.get(`/tasks/${taskId}`);
    return response.data; // { taskId, status, progress, result }
  } catch (error) {
    console.error("Task Orchestrator Poll Error:", error);
    throw error;
  }
};

export const downloadTaskPdfFile = async (taskId) => {
  try {
    const response = await orchestratorApi.get(`/tasks/${taskId}/download`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Task Orchestrator Download Error:", error);
    throw error;
  }
};

// ==============================
// 3. AI Enhancement APIs
// ==============================
export const enhanceSummary = async (draftSummary) => {
  try {
    const response = await aiApi.post("/enhance-summary", { draftSummary });
    return response.data.enhancedSummary;
  } catch (error) {
    console.error("Enhance Summary Error:", error);
    throw error;
  }
};

export const enhanceExperience = async (draftDescription, jobTitle, companyName) => {
  try {
    const response = await aiApi.post("/enhance-experience", {
      draftDescription,
      jobTitle,
      companyName,
    });
    return response.data.enhancedDescription;
  } catch (error) {
    console.error("Enhance Experience Error:", error);
    throw error;
  }
};

// ==============================
// 4. ImageKit Upload API
// ==============================
export const uploadProfileImage = async (file, removeBackground) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("removeBackground", removeBackground);

    const response = await imagekitApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload Image Error:", error);
    throw error;
  }
};

import apiClient from "../../../services/apiClient";
import axios from "axios";

// Orchestrator Base URL (microservice)
const ORCHESTRATOR_BASE = import.meta.env.VITE_ORCHESTRATOR_BASE_URL || "http://localhost:5000";
const orchestratorApi = axios.create({
  baseURL: ORCHESTRATOR_BASE,
  withCredentials: false,
});

// ==============================
// 1. Resume CRUD APIs
// ==============================
export const saveResume = async (resumeData) => {
  try {
    const response = await apiClient.post("/resume", resumeData);
    return response.data;
  } catch (error) {
    console.error("Save Resume Error:", error);
    throw error;
  }
};

export const getUserResumes = async () => {
  try {
    const response = await apiClient.get("/resume");
    return response.data.resumes;
  } catch (error) {
    console.error("Get Resumes Error:", error);
    throw error;
  }
};

export const getResumeById = async (id) => {
  try {
    const response = await apiClient.get(`/resume/${id}`);
    return response.data.resume;
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    throw error;
  }
};

export const updateResume = async (id, resumeData) => {
  try {
    const response = await apiClient.put(`/resume/${id}`, resumeData);
    return response.data;
  } catch (error) {
    console.error("Update Resume Error:", error);
    throw error;
  }
};

export const deleteResume = async (id) => {
  try {
    const response = await apiClient.delete(`/resume/${id}`);
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


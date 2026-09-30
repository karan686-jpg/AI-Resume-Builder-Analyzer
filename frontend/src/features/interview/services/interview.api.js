import apiClient from "../../../services/apiClient";

export const generateInterviewReport = async ({ resume, jobDescription, selfDescription }) => {
  try {
    const formData = new FormData();
    if (resume) {
      formData.append("resume", resume);
    }
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await apiClient.post("/interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Generate Report Error:", error);
    throw error;
  }
};

export const getInterviewReportById = async (id) => {
  try {
    const response = await apiClient.get(`/interview/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Report Error:", error);
    throw error;
  }
};

export const getAllInterviewReports = async () => {
  try {
    const response = await apiClient.get("/interview");
    return response.data;
  } catch (error) {
    console.error("Get All Reports Error:", error);
    throw error;
  }
};

export const getResumePdf = async (id) => {
  try {
    const response = await apiClient.get(`/interview/${id}/resume`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Download Resume Error:", error);
    throw error;
  }
};
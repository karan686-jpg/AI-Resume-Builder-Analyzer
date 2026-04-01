import axios from "axios";

// Separate instances for AI and ImageKit if needed, or point to base APIs
const aiApi = axios.create({
  baseURL: "http://localhost:3000/api/ai",
  withCredentials: true,
});

const imagekitApi = axios.create({
  baseURL: "http://localhost:3000/api/imagekit",
  withCredentials: true,
});

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
    return response.data; // { success, url, fileId }
  } catch (error) {
    console.error("Upload Image Error:", error);
    throw error;
  }
};

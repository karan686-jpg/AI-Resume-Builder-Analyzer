const Resume = require("../models/resume.model");

// 1. Create or Save a new Resume
const createResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      themeColor,
      activeTemplate,
      personalInfo,
      professionalSummary,
      experience,
      education,
      skills,
    } = req.body;

    const newResume = new Resume({
      userId,
      title: title || "Untitled Resume",
      themeColor: themeColor || "#2563EB",
      activeTemplate: activeTemplate || "modern",
      personalInfo: personalInfo || {},
      professionalSummary: professionalSummary || "",
      experience: experience || [],
      education: education || [],
      skills: skills || [],
    });

    const savedResume = await newResume.save();
    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: savedResume,
    });
  } catch (error) {
    console.error("Create Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

// 2. Get all Resumes belonging to the logged-in user
const getAllUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get All Resumes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};

// 3. Get a single Resume by ID (with ownership check)
const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this resume",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

// 4. Update an existing Resume
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot edit this resume",
      });
    }

    const {
      title,
      themeColor,
      activeTemplate,
      personalInfo,
      professionalSummary,
      experience,
      education,
      skills,
    } = req.body;

    if (title !== undefined) resume.title = title;
    if (themeColor !== undefined) resume.themeColor = themeColor;
    if (activeTemplate !== undefined) resume.activeTemplate = activeTemplate;
    if (personalInfo !== undefined) resume.personalInfo = personalInfo;
    if (professionalSummary !== undefined) resume.professionalSummary = professionalSummary;
    if (experience !== undefined) resume.experience = experience;
    if (education !== undefined) resume.education = education;
    if (skills !== undefined) resume.skills = skills;

    const updatedResume = await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
      error: error.message,
    });
  }
};

// 5. Delete a Resume
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete this resume",
      });
    }

    await Resume.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};

module.exports = {
  createResume,
  getAllUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
};

const Resume = require("../models/resume.model");
const asyncHandler = require("../utils/asyncHandler");

// 1. Create or Save a new Resume
const createResume = asyncHandler(async (req, res) => {
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
    customSections,
  } = req.body;

  const savedResume = await Resume.create({
    userId,
    title: title || "Untitled Resume",
    themeColor: themeColor || "#2563EB",
    activeTemplate: activeTemplate || "modern",
    personalInfo: personalInfo || {},
    professionalSummary: professionalSummary || "",
    experience: experience || [],
    education: education || [],
    skills: skills || [],
    customSections: customSections || [],
  });

  return res.status(201).json({
    success: true,
    message: "Resume created successfully",
    resume: savedResume,
  });
});

// 2. Get all Resumes belonging to the logged-in user
const getAllUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });

  return res.status(200).json({
    success: true,
    count: resumes.length,
    resumes,
  });
});

// 3. Get a single Resume by ID (with ownership check)
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ success: false, message: "Resume not found" });
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Unauthorized: You do not own this resume" });
  }

  return res.status(200).json({ success: true, resume });
});

// 4. Update an existing Resume
const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ success: false, message: "Resume not found" });
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Unauthorized: You cannot edit this resume" });
  }

  const fields = [
    "title", "themeColor", "activeTemplate", "personalInfo",
    "professionalSummary", "experience", "education", "skills", "customSections"
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) resume[field] = req.body[field];
  });

  const updatedResume = await resume.save();

  return res.status(200).json({
    success: true,
    message: "Resume updated successfully",
    resume: updatedResume,
  });
});

// 5. Delete a Resume
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ success: false, message: "Resume not found" });
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this resume" });
  }

  await Resume.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
});

module.exports = {
  createResume,
  getAllUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
};

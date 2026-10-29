const Resume = require("../models/resume.model");
const { asyncHandler } = require("../middleware");

// 1. Create or Save a new Resume
const createResume = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    title,
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    customSections,
  } = req.body || {};

  const savedResume = await Resume.create({
    userId,
    title: title || "Untitled Resume",
    personalInfo: personalInfo || {},
    professionalSummary: professionalSummary || "",
    experience: experience || [],
    education: education || [],
    skills: skills || [],
    customSections: customSections || [],
  });

  return res.status(201).json({
    message: "Resume created successfully",
    resume: savedResume,
  });
});

// 2. Get all Resumes belonging to the logged-in user (indexed query)
const getAllUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id })
    .select("title personalInfo updatedAt createdAt")
    .sort({ updatedAt: -1 });

  return res.status(200).json({
    count: resumes.length,
    resumes,
  });
});

// 3. Get a single Resume by ID (atomic owner-scoped lookup)
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  return res.status(200).json({ resume });
});

// 4. Update an existing Resume (atomic owner-scoped update)
const updateResume = asyncHandler(async (req, res) => {
  const allowedFields = [
    "title",
    "personalInfo",
    "professionalSummary",
    "experience",
    "education",
    "skills",
    "customSections",
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body?.[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  );


  if (!updatedResume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  return res.status(200).json({
    message: "Resume updated successfully",
    resume: updatedResume,
  });
});

// 5. Delete a Resume (atomic owner-scoped deletion)
const deleteResume = asyncHandler(async (req, res) => {
  const deletedResume = await Resume.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!deletedResume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  return res.status(200).json({
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


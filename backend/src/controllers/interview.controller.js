const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");
const { extractPdfText } = require("../services/pdf.service");
const { asyncHandler } = require("../middleware");

// 1. Generate Interview Report (In-memory PDF parsing + Gemini AI generation)
const generateInterviewReportController = asyncHandler(async (req, res) => {
  const { jobDescription, selfDescription } = req.body || {};

  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ message: "Job description is required" });
  }

  let resumeContent = "";
  if (req.file?.buffer) {
    // In-memory zero-disk text extraction; buffer is garbage collected after this scope
    resumeContent = await extractPdfText(req.file.buffer);
  }

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent,
    jobDescription,
    selfDescription: selfDescription || "",
  });

  // Save report structure to DB without heavy binary files
  const interviewReport = await InterviewReportModel.create({
    jobDescription,
    title: interviewReportByAi.title || "Software Engineer Interview",
    resume: resumeContent,
    selfDescription: selfDescription || "",
    ...interviewReportByAi,
    user: req.user.id,
  });

  return res.status(201).json({ interviewReport });
});

// 2. Get Interview Report By ID (Atomic owner-scoped query)
const getInterviewReportByIdController = asyncHandler(async (req, res) => {
  const report = await InterviewReportModel.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!report) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  return res.status(200).json(report);
});

// 3. List all Interview Reports for current user (Safe inclusion projection)
const getAllInterviewReportsController = asyncHandler(async (req, res) => {
  const reports = await InterviewReportModel.find({ user: req.user.id })
    .select("title matchScore createdAt")
    .sort({ createdAt: -1 });

  return res.status(200).json(reports);
});

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};


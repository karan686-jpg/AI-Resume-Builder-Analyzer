const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");
const { extractPdfText } = require("../services/pdf.service");
const asyncHandler = require("../utils/asyncHandler");

const generateInterviewReportController = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ message: "Job description is required" });
  }

  let resumeContent = "";
  let resumeFileBuffer;
  let resumeContentType;

  if (req.file) {
    resumeFileBuffer = req.file.buffer;
    resumeContentType = req.file.mimetype;
    resumeContent = await extractPdfText(resumeFileBuffer);
  }

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent,
    jobDescription,
    selfDescription: req.body.selfDescription || "",
  });

  // Save to DB
  const interviewReport = await InterviewReportModel.create({
    jobDescription,
    title: interviewReportByAi.title || "Software Engineer Interview",
    resume: resumeContent,
    resumeFile: resumeFileBuffer,
    resumeContentType,
    selfDescription: req.body.selfDescription || "",
    ...interviewReportByAi,
    user: req.user.id,
  });

  // Exclude heavy buffer from JSON response
  const reportObj = interviewReport.toObject();
  delete reportObj.resumeFile;

  return res.status(200).json({ interviewReport: reportObj });
});

const getInterviewReportByIdController = asyncHandler(async (req, res) => {
  const report = await InterviewReportModel.findById(req.params.id).select("-resumeFile");

  if (!report) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  if (report.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized to view this report" });
  }

  return res.status(200).json(report);
});

const getResumePdfById = asyncHandler(async (req, res) => {
  const report = await InterviewReportModel.findById(req.params.id).select("resumeFile resumeContentType user");

  if (!report || !report.resumeFile) {
    return res.status(404).json({ message: "Resume PDF not found" });
  }

  if (report.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized to download this resume" });
  }

  res.set({
    "Content-Type": report.resumeContentType || "application/pdf",
    "Content-Disposition": `attachment; filename="resume_${req.params.id}.pdf"`,
  });

  return res.send(report.resumeFile);
});

const getAllInterviewReportsController = asyncHandler(async (req, res) => {
  const reports = await InterviewReportModel.find({ user: req.user.id }).select(
    "-resumeFile -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -resume"
  );
  return res.status(200).json(reports);
});

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getResumePdfById,
  getAllInterviewReportsController,
};

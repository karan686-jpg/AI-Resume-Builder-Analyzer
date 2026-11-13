const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { extractPdfText } = require("./services/pdf.service");
const { generateInterviewReport } = require("./services/ai.service");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory Multer upload (zero disk footprint, 5MB cap)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      const err = new Error("Only PDF files are supported for automated resume extraction.");
      err.status = 400;
      cb(err, false);
    }
  },
});

// Express 5 natively forwards async rejections to the error handler below
const handleAnalyze = async (req, res) => {
  const { jobDescription, selfDescription = "", resumeText: bodyResumeText = "" } = req.body || {};

  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ message: "Target job description is required." });
  }

  let resumeText = bodyResumeText;
  if (req.file?.buffer) {
    resumeText = await extractPdfText(req.file.buffer);
  }

  if (!resumeText.trim() && !selfDescription.trim()) {
    return res.status(400).json({
      message: "Please upload a resume PDF or provide a candidate summary.",
    });
  }

  const interviewReport = await generateInterviewReport({
    jobDescription,
    resumeText,
    selfDescription,
  });

  return res.status(200).json({ interviewReport });
};

app.post("/api/analyze", upload.single("resume"), handleAnalyze);
app.post("/api/interview", upload.single("resume"), handleAnalyze);

// Centralized Express 5 Error Handler
app.use((err, _req, res, _next) => {
  console.error("[AI Gateway Error]:", err.message || err);
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // Extract clean message when @google/genai throws a JSON-serialized error string
  if (typeof message === "string" && message.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(message);
      if (parsed?.error?.message) {
        message = parsed.error.message;
        statusCode = parsed.error.code || statusCode;
      }
    } catch {
      // Keep original message if not valid JSON
    }
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size exceeds 5MB limit. Please upload a smaller PDF.";
  } else if (statusCode === 429) {
    message = "AI Rate Limit / Quota Exceeded. Please try again in a few moments.";
  }

  res.status(statusCode).json({ message });
});

module.exports = app;

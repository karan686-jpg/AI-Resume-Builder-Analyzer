const express= require("express");
const authMiddleware= require("../middleware/auth.middleware");
const interviewController= require("../controllers/interview.controller");
const interviewRouter= express.Router();
const upload= require("../middleware/file.middleware");
interviewRouter.post("/",authMiddleware,upload.single("resume"),interviewController.generateInterviewReportController)


// Get a specific report by ID
interviewRouter.get("/:id", authMiddleware, interviewController.getInterviewReportByIdController);

// Download the original resume PDF by report ID
interviewRouter.get("/:id/resume", authMiddleware, interviewController.getResumePdfById);

interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReportsController);

module.exports=interviewRouter;
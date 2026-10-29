const express = require("express");
const { authUser, upload } = require("../middleware");
const interviewController = require("../controllers/interview.controller");

const interviewRouter = express.Router();

interviewRouter.post("/", authUser, upload.single("resume"), interviewController.generateInterviewReportController);
interviewRouter.get("/:id", authUser, interviewController.getInterviewReportByIdController);
interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController);


module.exports = interviewRouter;
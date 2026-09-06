const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const resumeController = require("../controllers/resume.controller");

// All resume routes are protected by authMiddleware
router.post("/", authMiddleware, resumeController.createResume);
router.get("/", authMiddleware, resumeController.getAllUserResumes);
router.get("/:id", authMiddleware, resumeController.getResumeById);
router.put("/:id", authMiddleware, resumeController.updateResume);
router.delete("/:id", authMiddleware, resumeController.deleteResume);

module.exports = router;

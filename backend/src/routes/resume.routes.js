const express = require("express");
const { authUser } = require("../middleware");
const resumeController = require("../controllers/resume.controller");

const router = express.Router();

router.post("/", authUser, resumeController.createResume);
router.get("/", authUser, resumeController.getAllUserResumes);
router.get("/:id", authUser, resumeController.getResumeById);
router.put("/:id", authUser, resumeController.updateResume);
router.delete("/:id", authUser, resumeController.deleteResume);

module.exports = router;

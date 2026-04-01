const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

// POST /api/ai/enhance-summary
router.post("/enhance-summary", aiController.enhanceSummary);

// POST /api/ai/enhance-experience
router.post("/enhance-experience", aiController.enhanceExperience);

module.exports = router;

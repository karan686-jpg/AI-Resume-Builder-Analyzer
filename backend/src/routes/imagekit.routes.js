const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageKitController = require("../controllers/imagekit.controller");

// Set up multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), imageKitController.uploadImage);

module.exports = router;

const multer = require("multer");

/**
 * In-memory Multer storage for zero-disk-footprint PDF processing.
 * Validates PDF MIME type and enforces 5MB size limit.
 */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are supported for automated resume extraction."), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});

module.exports = upload;
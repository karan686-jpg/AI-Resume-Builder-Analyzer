const jwt = require("jsonwebtoken");
const multer = require("multer");

/**
 * Async handler utility to wrap controllers.
 * Express 5 natively handles rejected promises, but wrapping ensures
 * explicit safety across asynchronous database and AI calls.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * JWT Authentication Middleware
 */
const authUser = (req, res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.token || bearer;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

/**
 * In-memory Multer storage for zero-disk-footprint PDF processing.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are supported for automated resume extraction."), false);
    }
  },
});

/**
 * Centralized Error Handling Middleware (Express 5 compatible)
 */
const errorHandler = (err, req, res, next) => {
  console.error("API Error:", err.message || err);
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size exceeds 5MB limit. Please upload a smaller PDF.";
  } else if (err.message?.includes("Only PDF files are supported")) {
    statusCode = 400;
    message = err.message;
  } else if (statusCode === 429) {
    message = "AI Rate Limit / Quota Exceeded. Please try again in a few moments.";
  } else if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
    message = "Invalid input or resource ID format.";
  }

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
};


module.exports = { authUser, upload, errorHandler, asyncHandler };

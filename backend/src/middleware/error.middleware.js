/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("API Error:", err);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size exceeds 5MB limit. Please upload a smaller PDF.";
  } else if (statusCode === 429) {
    message = "AI Rate Limit / Quota Exceeded. Please try again in a few moments.";
  } else if (err.name === "ValidationError") {
    message = "Validation Error: Please check your input fields.";
  } else if (err.name === "CastError") {
    message = "Invalid Resource ID format.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
};

module.exports = errorHandler;

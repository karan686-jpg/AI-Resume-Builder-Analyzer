const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Access denied for this origin."));
      }
    },
    credentials: true,
  })
);


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/interview", require("./routes/interview.routes"));
app.use("/api/resume", require("./routes/resume.routes"));

// Centralized Express 5 error handling
app.use(errorHandler);

module.exports = app;
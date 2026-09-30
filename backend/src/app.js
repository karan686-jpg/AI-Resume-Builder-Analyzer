const express=require("express");
const app=express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json())
app.use(cookieParser());
app.use(cors({
     origin: (origin, callback) => callback(null, true),
     credentials: true
}));


const authRouter= require("./routes/auth.routes");
const interviewRouter= require("./routes/interview.routes");
const resumeRouter = require("./routes/resume.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);
app.use("/api/resume", resumeRouter);

// Centralized error handling middleware
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

module.exports=app;
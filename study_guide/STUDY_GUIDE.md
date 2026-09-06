# 📘 AI Resume Builder & Analyzer — Complete Code & Architecture Master Handbook

> **Project Name:** AI-Powered CV Generator & Interview Prep System  
> **Author & Developer:** Karan Datta  
> **Target Audience:** Placement Viva, Technical Interviews, Architecture Defense & Code Study  
> **Tech Stack:** React 19, Node.js, Express 5, MongoDB Atlas (Mongoose), Google Gemini 2.0 Flash (`@google/genai`), ImageKit CDN, Tailwind CSS v4, HTML2PDF.js

---

## 📑 Comprehensive Index
1. [Project Overview & Key Objectives](#1-project-overview--key-objectives)
2. [End-to-End Architectural Data Flow](#2-end-to-end-architectural-data-flow)
3. [Complete Backend Source Codes & Line-by-Line Breakdown](#3-complete-backend-source-codes)
   - [3.1 Express Server Initialization (`app.js` & `server.js`)](#31-express-server-initialization)
   - [3.2 Database Schema & Mongoose ODM (`user.model.js`, `interviewReport.model.js`, `blacklist.model.js`)](#32-database-schemas)
   - [3.3 Authentication Controller (`auth.controller.js`)](#33-authentication-controller)
   - [3.4 Security & Token Blacklist Middleware (`auth.middleware.js`)](#34-security-middleware)
   - [3.5 GenAI Gemini Service Layer (`ai.service.js`)](#35-genai-gemini-service-layer)
   - [3.6 AI Content Enhancement Controller (`ai.controller.js`)](#36-ai-content-enhancement-controller)
   - [3.7 In-Memory PDF Ingestion & Interview Controller (`interview.controller.js`)](#37-interview-controller)
4. [Complete Frontend Source Codes & Component Architecture](#4-complete-frontend-source-codes)
   - [4.1 Client-Side Routing & Navigation Guard (`app.routes.jsx` & `Protected.jsx`)](#41-routing--protected-routes)
   - [4.2 Centralized Authentication Context (`auth.context.jsx`)](#42-authentication-context)
   - [4.3 Dynamic Resume Builder Master Engine (`ResumeBuilder.jsx`)](#43-resume-builder-engine)
   - [4.4 AI Gap Analyzer & Ingestion Page (`AnalyzePage.jsx`)](#44-analyzer-page)
   - [4.5 Dynamic Resume Template Rendering (`ClassicTemplate.jsx`)](#45-template-engine)
5. [Top 30+ Viva & Technical Interview Questions & Model Answers](#5-top-viva--interview-questions)

---

## 1. Project Overview & Key Objectives

### 🎯 Core Engineering Objectives:
1. **Intelligent Resume Parsing:** Extract raw textual data from PDF files in memory using `pdf-parse` v2 without polluting the server disk.
2. **GenAI Semantic Gap Analysis:** Leverage Google Gemini 2.0 Flash (`@google/genai`) with guaranteed JSON output (`responseMimeType: "application/json"`) to compute match scores, pinpoint skill gaps with severity ratings, and structure a 7-day preparation roadmap.
3. **Automated AI Resume Enhancer:** Elevate draft descriptions into high-impact, quantifiable, action-verb-driven bullet points formatted for Applicant Tracking Systems (ATS).
4. **Dynamic Multi-Template Rendering:** Seamlessly switch between resume templates (Classic, Corporate, Modern, Minimal, Tech, Creative) with live accent color customization.
5. **Client-Side High-Fidelity PDF Export:** Rasterize DOM nodes into vector-accurate A4 PDF documents using `html2pdf.js` with canvas scaling.
6. **Stateful JWT Security with Revocation:** Mitigate XSS attacks by storing tokens in HTTP-Only cookies and implementing instantaneous logout invalidation via a MongoDB Blacklist collection.

---

## 2. End-to-End Architectural Data Flow

```
[ CLIENT: React 19 + Vite ]
         │
         ├─── 1. User Uploads Resume PDF + Target Job Description
         │    (Sends multipart/form-data via Axios with credentials)
         ▼
[ BACKEND: Express 5 API ]
         │
         ├─── 2. Auth Middleware: Verifies JWT cookie & checks Token Blacklist in MongoDB
         ├─── 3. Multer Middleware: Captures PDF as in-memory RAM buffer (req.file.buffer)
         ├─── 4. PDF-Parse v2: Extracts raw text stream -> calls parser.destroy()
         ├─── 5. AI Service: Sends structured prompt to Google Gemini 2.0 Flash
         │
[ AI ENGINE: Google Gemini 2.0 Flash ]
         │
         ├─── 6. Enforces responseMimeType: "application/json"
         ├─── 7. Generates Match Score, Tech/Behavioral Q&A, Skill Gaps & 7-Day Plan
         │
[ DATABASE: MongoDB Atlas ]
         │
         ├─── 8. Saves complete report + user reference in InterviewReport collection
         │
[ CLIENT: Report Visualization ]
         │
         └─── 9. User reviews dynamic 7-day preparation roadmap and technical questions
```

---

## 3. Complete Backend Source Codes

### 3.1 Express Server Initialization (`backend/src/app.js`)
```javascript
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration allowing localhost with credentials
app.use(cors({
     origin: function (origin, callback) {
       if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
}));

// Route Definitions
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const aiRouter = require("./routes/ai.routes");
const imagekitRouter = require("./routes/imagekit.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/imagekit", imagekitRouter);

module.exports = app;
```
*Why this matters for your viva:*  
- `credentials: true` enables the browser to transmit HTTP-Only cookies across origins.
- Regex CORS origin matching allows Vite's dynamic localhost ports without hardcoding.

---

### 3.2 Database Schemas (`backend/src/models/interviewReport.model.js`)
```javascript
const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
   question: { type: String, required: [true, "Technical question is required"] },
   intention: { type: String, required: [true, "Intention is required"] },
   answer: { type: String, required: [true, "Answer is required"] }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
   question: { type: String, required: [true, "Behavioral question is required"] },
   intention: { type: String, required: [true, "Intention is required"] },
   answer: { type: String, required: [true, "Answer is required"] }
}, { _id: false });

const skillGapsSchema = new mongoose.Schema({
   skillName: { type: String, required: [true, "Skill name is required"] },
   severity: { type: String, enum: ["low", "medium", "high"], required: [true, "Severity is required"] },
   description: { type: String, default: "" }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
   day: { type: Number, required: [true, "Day is required"] },
   focus: { type: String, required: [true, "Focus is required"] },
   tasks: { type: [String], required: [true, "Tasks are required"] },
   title: { type: String, default: "" }
});

const interviewReportSchema = new mongoose.Schema({
   jobDescription: { type: String, required: true },
   resume: { type: String, default: "" },
   resumeFile: { type: Buffer },
   resumeContentType: { type: String, default: "application/pdf" },
   selfDescription: { type: String, default: "" },
   matchScore: { type: Number, min: 0, max: 100 },
   title: { type: String, default: "Interview Preparation" },
   technicalQuestions: [technicalQuestionSchema],
   behavioralQuestions: [behavioralQuestionSchema],
   skillGaps: [skillGapsSchema],
   preparationPlan: [preparationPlanSchema],
   user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, { timestamps: true });

module.exports = mongoose.model("InterviewReport", interviewReportSchema);
```
*Why this matters for your viva:*  
- Embedded subdocuments with `_id: false` prevent generating redundant ObjectId keys for simple nested objects.
- `resumeFile: Buffer` allows optional binary storage of the original uploaded resume.

---

### 3.3 Authentication Controller (`backend/src/controllers/auth.controller.js`)
```javascript
const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTER
const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({ message: "User registered successfully", user: { username: newUser.username, email: newUser.email } });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// 2. LOGIN
const loginUserConroller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// 3. LOGOUT (Stateful Revocation)
const logoutUserConroller = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(400).json({ message: "No token found" });

        await tokenBlacklistModel.create({ token });
        res.clearCookie("token");

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// 4. GET ME
const getMeController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

module.exports = { registerController, loginUserConroller, logoutUserConroller, getMeController };
```

---

### 3.4 Security & Blacklist Middleware (`backend/src/middleware/auth.middleware.js`)
```javascript
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Authentication required" });

        // Query MongoDB blacklist collection to check if token was logged out
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been invalidated. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
```

---

### 3.5 GenAI Gemini Service Layer (`backend/src/services/ai.service.js`)
```javascript
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
    const prompt = `
    You are an expert career coach and technical interviewer. 
    Generate a comprehensive interview report based on the following inputs:
    
    1. Job Description: ${jobDescription}
    2. Candidate's Resume: ${resume || "(No resume provided)"}
    3. Candidate's Self-Description: ${selfDescription || "(No self description provided)"}
    
    Format output strictly as JSON with title, matchScore (0-100), technicalQuestions, behavioralQuestions, skillGaps, and preparationPlan (7 days).
    `;

    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    let result = response.text;
    
    // Regex cleanup to strip any unintentional markdown wrappers
    const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch) {
        result = jsonMatch[1];
    }

    try {
        return JSON.parse(result);
    } catch (err) {
        console.error("AI JSON Parse Error:", err);
        const error = new Error("Failed to parse AI response into valid JSON.");
        error.status = 502;
        throw error;
    }
}

module.exports = { generateInterviewReport };
```

---

### 3.6 AI Bullet Point & Summary Enhancement (`backend/src/controllers/ai.controller.js`)
```javascript
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// Enhances raw summary into 2-sentence ATS punchline
const enhanceSummary = async (req, res) => {
  try {
    const { draftSummary } = req.body;
    if (!draftSummary) return res.status(400).json({ error: "draftSummary is required." });

    const prompt = `
      You are an expert resume writer and career coach. 
      Take this draft summary and rewrite it into a powerful, ATS-friendly, 2-sentence version:
      ${draftSummary}
      Return ONLY the final 2-sentence summary without conversational prefixes.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    res.status(200).json({ success: true, enhancedSummary: response.text.trim() });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ error: "Gemini API Rate limit exceeded." });
    res.status(500).json({ error: "Failed to enhance summary." });
  }
};

// Enhances experience description into action-verb bullet points
const enhanceExperience = async (req, res) => {
  try {
    const { draftDescription, jobTitle, companyName } = req.body;
    if (!draftDescription || !jobTitle || !companyName) {
      return res.status(400).json({ error: "draftDescription, jobTitle, and companyName are required." });
    }

    const prompt = `
      Improve the following draft job description for a ${jobTitle} at ${companyName}:
      ${draftDescription}
      Rewrite it into 3-5 concise, high-impact bullet points using strong action verbs focusing on metrics and ATS keywords.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    res.status(200).json({ success: true, enhancedDescription: response.text.trim() });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ error: "Gemini API Rate limit exceeded." });
    res.status(500).json({ error: "Failed to enhance experience." });
  }
};

module.exports = { enhanceSummary, enhanceExperience };
```

---

### 3.7 In-Memory PDF Extraction Controller (`backend/src/controllers/interview.controller.js`)
```javascript
const { PDFParse } = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

const generateInterviewReportController = async (req, res) => {
     try {
          const { jobDescription } = req.body;
          let resumeContent = "";
          let resumeFileBuffer = undefined;
          let resumeContentType = undefined;

          if (req.file) {
               resumeFileBuffer = req.file.buffer;
               resumeContentType = req.file.mimetype;
               
               // PDF parsing in RAM buffer
               const parser = new PDFParse({ data: resumeFileBuffer });
               const pdfData = await parser.getText();
               await parser.destroy(); // Immediate memory cleanup
               resumeContent = pdfData.text;
          }

          const interviewReportByAi = await generateInterviewReport({
               resume: resumeContent,
               jobDescription,
               selfDescription: req.body.selfDescription || ""
          });

          const interviewReport = await InterviewReportModel.create({
               jobDescription,
               title: interviewReportByAi.title || "Software Engineer Interview",
               resume: resumeContent,
               resumeFile: resumeFileBuffer,
               resumeContentType: resumeContentType,
               selfDescription: req.body.selfDescription || "",
               ...interviewReportByAi,
               user: req.user.id
          });

          const reportObj = interviewReport.toObject();
          delete reportObj.resumeFile; // Strip heavy binary buffer before returning JSON

          return res.status(200).json({ interviewReport: reportObj });
     } catch (error) {
          const status = error.status || 500;
          return res.status(status).json({ message: error.message });
     }
};
```

---

## 4. Complete Frontend Source Codes

### 4.1 Client-Side Routing (`frontend/src/app.routes.jsx`)
```jsx
import { createBrowserRouter } from "react-router";
import Home from "./features/interview/pages/Home";
import AnalyzePage from "./features/interview/pages/AnalyzePage";
import Interview from "./features/interview/pages/interview";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Dashboard from "./features/auth/pages/Dashboard";
import Protected from "./features/auth/components/Protected";
import ResumeBuilder from "./features/resume/pages/ResumeBuilder";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/analyze",
    element: (
      <Protected>
        <AnalyzePage />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/builder",
    element: (
      <Protected>
        <ResumeBuilder />
      </Protected>
    ),
  },
]);
```

---

### 4.2 Protected Route Wrapper (`frontend/src/features/auth/components/Protected.jsx`)
```jsx
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Verifying authentication session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
```

---

### 4.3 Master Resume Builder Engine (`frontend/src/features/resume/pages/ResumeBuilder.jsx`)
```jsx
import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import ColorPicker from "../components/ColorPicker";
import TemplatePicker from "../components/TemplatePicker";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import CustomSectionForm from "../components/CustomSectionForm";
import ResumePreview from "../components/ResumePreview";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    title: "My AI Resume",
    themeColor: "#2563eb",
    fontFamily: "'Inter', sans-serif",
    personalInfo: { name: "", email: "", phone: "", linkedIn: "", github: "", portfolio: "", imageUrl: "" },
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    customSections: [],
  });

  const [template, setTemplate] = useState("modern");

  // Client-Side PDF Generation
  const handleDownload = () => {
    const element = document.getElementById("resume-pdf-content");
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.name || "Resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="rb-page">
      {/* Top Config Bar */}
      <header className="rb-header">
        <ColorPicker
          selectedColor={resumeData.themeColor}
          onChange={(color) => setResumeData(prev => ({ ...prev, themeColor: color }))}
        />
        <TemplatePicker selectedTemplate={template} onChange={setTemplate} />
        <button onClick={handleDownload} className="rb-download-btn">Download PDF</button>
      </header>

      {/* Editor & Live Preview Grid */}
      <main className="rb-main-grid">
        <div className="rb-form-panel">
          <PersonalInfoForm data={resumeData.personalInfo} onChange={(d) => setResumeData(p => ({ ...p, personalInfo: d }))} />
          <ProfessionalSummaryForm summary={resumeData.professionalSummary} onChange={(s) => setResumeData(p => ({ ...p, professionalSummary: s }))} />
          <ExperienceForm experience={resumeData.experience} onChange={(e) => setResumeData(p => ({ ...p, experience: e }))} />
          <EducationForm education={resumeData.education} onChange={(ed) => setResumeData(p => ({ ...p, education: ed }))} />
          <SkillsForm skills={resumeData.skills} onChange={(sk) => setResumeData(p => ({ ...p, skills: sk }))} />
          <CustomSectionForm sections={resumeData.customSections} onChange={(c) => setResumeData(p => ({ ...p, customSections: c }))} />
        </div>

        <div className="rb-preview-panel">
          <div id="resume-pdf-content">
            <ResumePreview data={resumeData} template={template} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
```

---

## 5. Top 30+ Viva & Technical Interview Questions

### Section A: GenAI & Backend Engineering
1. **Q: How do you enforce structured JSON output in Google Gemini 2.0 without hallucinations?**  
   *Answer:* We configure `config: { responseMimeType: "application/json" }` inside `genAI.models.generateContent()`. This signals the model's decoding sampler to constrain generation to valid JSON syntax matching the schema requested in the prompt.

2. **Q: Why is Multer's memory storage preferred over disk storage for resume uploads?**  
   *Answer:* Disk I/O introduces physical file write/read latency and requires garbage-collection routines to purge temporary files. Memory storage provides instant RAM buffer access (`req.file.buffer`), resulting in sub-millisecond handoff to `pdf-parse`.

3. **Q: What is the purpose of `parser.destroy()` in `pdf-parse`?**  
   *Answer:* In Node.js, large binary buffers referenced by external C++ bindings or parsers can persist in heap space. Calling `destroy()` dereferences internal handles, preventing memory leaks during high concurrent traffic.

4. **Q: How does the application handle Gemini API rate limits (HTTP 429)?**  
   *Answer:* The controller catches `error.status === 429` and translates it into an actionable error message for the client (`"Gemini API Rate Limit / Quota Exceeded"`), returning an appropriate HTTP 429 status code.

5. **Q: What is the role of `bcrypt.hash(password, 10)`?**  
   *Answer:* Bcrypt is an adaptive cryptographic hashing algorithm. The salt round `10` dictates $2^{10} = 1024$ hashing cycles, effectively immunizing stored passwords against precomputed rainbow table attacks.

### Section B: Security & Architecture
6. **Q: How does Token Blacklisting make stateless JWTs revocable upon logout?**  
   *Answer:* While JWT signatures verify validity cryptographically without DB queries, they cannot natively revoke before expiration. We store revoked tokens in a MongoDB `TokenBlacklist` collection. The `authMiddleware` queries this collection on every request to reject invalidated sessions immediately.

7. **Q: Why store tokens in HTTP-Only cookies instead of LocalStorage?**  
   *Answer:* `LocalStorage` is completely vulnerable to Cross-Site Scripting (XSS) because any malicious script running in the browser context can execute `localStorage.getItem('token')`. HTTP-Only cookies are unreadable by JavaScript (`document.cookie`), isolating tokens from client scripts.

8. **Q: What is CORS and why is `credentials: true` required?**  
   *Answer:* Cross-Origin Resource Sharing (CORS) is a browser security mechanism. When the frontend (Vite port 5173) and backend (port 5000) reside on different origins, `credentials: true` authorizes the browser to send cookies along with XMLHttpRequest / Fetch calls.

### Section C: Frontend & React 19
9. **Q: How does the Resume Builder support instant template switching without data loss?**  
   *Answer:* State is decoupled from the UI. All resume entries reside in a unified object inside `ResumeBuilder`. Switching templates simply re-renders a different presentational component (`<ModernTemplate />` vs `<ClassicTemplate />`) while passing the identical state data as props.

10. **Q: How does `html2pdf.js` achieve sharp text rendering for printed PDFs?**  
    *Answer:* It uses `html2canvas` configured with `scale: 2` (doubling pixel density) to rasterize the DOM, which `jsPDF` then converts into standard physical inches for an A4 portrait layout.

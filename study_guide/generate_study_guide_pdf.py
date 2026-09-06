import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Dynamic Canvas that computes total pages and adds running headers/footers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#334155"))
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 752, "AI RESUME BUILDER & ANALYZER — MASTER CODE & ARCHITECTURE STUDY GUIDE")
            self.drawRightString(558, 752, "DEVELOPER: KARAN DATTA")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 746, 558, 746)

        # Footer (All pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        footer_left = "Master Code Handbook | Full-Stack: React 19 + Express 5 + MongoDB + Google Gemini 2.0 Flash"
        footer_right = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 32, footer_left)
        self.drawRightString(558, 32, footer_right)
        self.restoreState()

def build_pdf(filename="ResumeFinal_Master_Study_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    PRIMARY = colors.HexColor("#0F172A")    # Deep Slate / Navy
    SECONDARY = colors.HexColor("#1D4ED8")  # Royal Blue
    ACCENT = colors.HexColor("#0284C7")     # Sky Blue
    DARK_TEXT = colors.HexColor("#1E293B")  # Slate 800
    LIGHT_BG = colors.HexColor("#F8FAFC")   # Slate 50
    BORDER_COLOR = colors.HexColor("#94A3B8")
    CODE_BG = colors.HexColor("#F1F5F9")    # Slate 100
    CODE_BORDER = colors.HexColor("#CBD5E1")
    ALERT_BG = colors.HexColor("#EFF6FF")

    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=23,
        textColor=PRIMARY,
        spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=SECONDARY,
        spaceAfter=5
    )
    h1_style = ParagraphStyle(
        'H1',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'H2',
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=12,
        textColor=SECONDARY,
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=DARK_TEXT,
        spaceAfter=2.5
    )
    bullet_style = ParagraphStyle(
        'BulletText',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=DARK_TEXT,
        leftIndent=8,
        spaceAfter=1.5
    )
    code_snippet_style = ParagraphStyle(
        'CodeSnippet',
        fontName='Courier',
        fontSize=6.1,
        leading=7.8,
        textColor=colors.HexColor("#0F172A")
    )
    qa_q_style = ParagraphStyle(
        'QA_Question',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.8,
        textColor=SECONDARY,
        spaceBefore=2.5,
        spaceAfter=1
    )
    qa_a_style = ParagraphStyle(
        'QA_Answer',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.2,
        textColor=DARK_TEXT,
        leftIndent=6,
        spaceAfter=2.5
    )

    def render_code_box(code_text):
        t = Table([[Preformatted(code_text.strip(), code_snippet_style)]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), CODE_BG),
            ('BOX', (0,0), (-1,-1), 0.75, CODE_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 2.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
            ('LEFTPADDING', (0,0), (-1,-1), 4.5),
            ('RIGHTPADDING', (0,0), (-1,-1), 4.5),
        ]))
        return t

    def render_callout(text):
        p = Paragraph(f"<b>Key Viva & Architectural Takeaway:</b> {text}", body_style)
        t = Table([[p]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), ALERT_BG),
            ('BOX', (0,0), (-1,-1), 0.75, SECONDARY),
            ('TOPPADDING', (0,0), (-1,-1), 2.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
            ('LEFTPADDING', (0,0), (-1,-1), 4.5),
            ('RIGHTPADDING', (0,0), (-1,-1), 4.5),
        ]))
        return t

    story = []

    # ==================== COVER / HEADER ====================
    story.append(Paragraph("AI RESUME BUILDER & ANALYZER", title_style))
    story.append(Paragraph("Complete Source Code Handbook, Architectural Blueprints & Viva Defense Manual", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceBefore=1, spaceAfter=4))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>Developer / Author:</b> Karan Datta", body_style),
            Paragraph("<b>Core Stack:</b> React 19, Vite, Node.js & Express 5", body_style),
        ],
        [
            Paragraph("<b>GenAI Engine:</b> Google Gemini 2.0 Flash (@google/genai)", body_style),
            Paragraph("<b>Database:</b> MongoDB Atlas Cluster (Mongoose ODM)", body_style),
        ],
        [
            Paragraph("<b>Security:</b> JWT in HTTP-Only Cookies + Token Blacklist", body_style),
            Paragraph("<b>Export & Ingestion:</b> pdf-parse v2 + html2pdf.js / Canvas", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[240, 264])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 1: SERVER & CONFIG ====================
    story.append(Paragraph("1. Backend Server Initialization & Middleware Pipeline", h1_style))
    
    story.append(Paragraph("<b>1.1 Server Entry Point (backend/server.js)</b>", h2_style))
    code_server = """const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

// Connect to MongoDB Atlas cluster before listening
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});"""
    story.append(render_code_box(code_server))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>1.2 Express Application Setup & CORS Security (backend/src/app.js)</b>", h2_style))
    code_app = """const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// Dynamic CORS allowing Vite dev server and credentials transmission
app.use(cors({
     origin: function (origin, callback) {
       if (!origin || /^http:\/\/localhost:\\d+$/.test(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
}));

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const aiRouter = require("./routes/ai.routes");
const imagekitRouter = require("./routes/imagekit.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/imagekit", imagekitRouter);

module.exports = app;"""
    story.append(render_code_box(code_app))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>1.3 MongoDB Database Connection (backend/src/config/database.js)</b>", h2_style))
    code_db = """const mongoose = require("mongoose");

const connectDB = async () => {
     try {
           await mongoose.connect(process.env.MONGO_URI);
           console.log("MongoDB connected successfully");
     } catch (error) {
           console.error("Database connection failure:", error);
           process.exit(1); // Stop server process on connection failure
     }
};
module.exports = connectDB;"""
    story.append(render_code_box(code_db))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>1.4 Multer Memory Storage Configuration (backend/src/middleware/file.middleware.js)</b>", h2_style))
    code_multer = """const multer = require("multer");

// Keeps uploaded PDFs in RAM memory buffer to avoid disk I/O latency
const upload = multer({ 
     storage: multer.memoryStorage(),
     limits: {
          fileSize: 1024 * 1024 * 3 // 3MB maximum file limit
     }
});
module.exports = upload;"""
    story.append(render_code_box(code_multer))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 2: DATABASE MODELS ====================
    story.append(PageBreak())
    story.append(Paragraph("2. Mongoose Database Models & Schema Design", h1_style))

    story.append(Paragraph("<b>2.1 Interview Report Model with Nested Subschemas (backend/src/models/interviewReport.model.js)</b>", h2_style))
    code_report_model = """const mongoose = require('mongoose');

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
   severity: { type: String, enum: ["low","medium","high"], required: [true, "Severity is required"] },
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

module.exports = mongoose.model("InterviewReport", interviewReportSchema);"""
    story.append(render_code_box(code_report_model))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>2.2 Resume Model, User Model & Token Blacklist Model</b>", h2_style))
    code_resume_models = """// 1. Resume Schema (backend/src/models/resume.model.js)
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "Untitled Resume" },
  themeColor: { type: String, default: "#2563eb" },
  activeTemplate: { type: String, default: "modern" },
  personalInfo: { name: String, email: String, phone: String, linkedIn: String, imageUrl: String },
  professionalSummary: { type: String, default: "" },
  experience: [{ company: String, role: String, dates: String, description: String }],
  education: [{ institution: String, degree: String, dates: String, fieldOfStudy: String }],
  skills: [String]
}, { timestamps: true });
module.exports = mongoose.model("Resume", resumeSchema);

// 2. User Schema (backend/src/models/user.model.js)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
module.exports = mongoose.model("User", userSchema);

// 3. Blacklist Tokens Schema (backend/src/models/blacklist.model.js)
const blacklistSchema = new mongoose.Schema({ token: { type: String, required: true } });
module.exports = mongoose.model("BlacklistTokens", blacklistSchema);"""
    story.append(render_code_box(code_resume_models))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 3: GENAI ENGINE ====================
    story.append(PageBreak())
    story.append(Paragraph("3. Generative AI Engine & Content Enhancement Controllers", h1_style))

    story.append(Paragraph("<b>3.1 Gemini 2.0 Flash AI Interview Generator (backend/src/services/ai.service.js)</b>", h2_style))
    code_ai_service = """const { GoogleGenAI } = require("@google/genai");

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
    
    Format output strictly as a JSON object with:
    - title: string (short catchy report title)
    - matchScore: number (0-100 percentage match)
    - technicalQuestions: array of { question, intention, answer }
    - behavioralQuestions: array of { question, intention, answer }
    - skillGaps: array of { skillName, severity ("low"|"medium"|"high"), description }
    - preparationPlan: array of { day (1-7), title, focus, tasks (array of strings) }
    `;

    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json" // 👈 Enforces valid JSON decoding in sampler
        }
    });

    let result = response.text;
    
    // Regex cleanup to strip any unintentional markdown wrappers
    const jsonMatch = result.match(/```(?:json)?\\s*([\\s\\S]*?)\\s*```/i);
    if (jsonMatch) result = jsonMatch[1];

    try {
        return JSON.parse(result);
    } catch (err) {
        console.error("AI JSON Parse Error:", err);
        const error = new Error("Failed to parse AI response into valid JSON.");
        error.status = 502;
        throw error;
    }
}
module.exports = { generateInterviewReport };"""
    story.append(render_code_box(code_ai_service))
    story.append(Spacer(1, 3))
    story.append(render_callout("responseMimeType: 'application/json' activates structured decoding inside the Gemini LLM sampler, eliminating markdown backtick pollution and JSON parsing crashes."))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>3.2 AI Summary & Bullet Enhancement Controller (backend/src/controllers/ai.controller.js)</b>", h2_style))
    code_ai_ctrl = """const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const enhanceSummary = async (req, res) => {
  try {
    const { draftSummary } = req.body;
    if (!draftSummary) return res.status(400).json({ error: "draftSummary is required." });

    const prompt = `Rewrite into a powerful, ATS-friendly 2-sentence summary: ${draftSummary}. Return ONLY summary.`;
    const response = await genAI.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
    res.status(200).json({ success: true, enhancedSummary: response.text.trim() });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ error: "Gemini Rate limit exceeded." });
    res.status(500).json({ error: "Failed to enhance summary." });
  }
};

const enhanceExperience = async (req, res) => {
  try {
    const { draftDescription, jobTitle, companyName } = req.body;
    if (!draftDescription || !jobTitle || !companyName) {
      return res.status(400).json({ error: "draftDescription, jobTitle, and companyName are required." });
    }

    const prompt = `Improve job description for ${jobTitle} at ${companyName}: ${draftDescription}. Rewrite into 3-5 concise ATS bullet points using strong action verbs.`;
    const response = await genAI.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
    res.status(200).json({ success: true, enhancedDescription: response.text.trim() });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ error: "Gemini Rate limit exceeded." });
    res.status(500).json({ error: "Failed to enhance experience." });
  }
};
module.exports = { enhanceSummary, enhanceExperience };"""
    story.append(render_code_box(code_ai_ctrl))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 4: CONTROLLERS & SERVICES ====================
    story.append(PageBreak())
    story.append(Paragraph("4. PDF Ingestion, ImageKit & Interview Controllers", h1_style))

    story.append(Paragraph("<b>4.1 Zero-Disk-IO PDF Ingestion Controller (backend/src/controllers/interview.controller.js)</b>", h2_style))
    code_interview_ctrl = """const { PDFParse } = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

const generateInterviewReportController = async (req, res) => {
     try {
          const { jobDescription } = req.body;
          let resumeContent = "", resumeFileBuffer = undefined, resumeContentType = undefined;

          if (req.file) {
               resumeFileBuffer = req.file.buffer;
               resumeContentType = req.file.mimetype;
               
               // Parse PDF directly from RAM buffer
               const parser = new PDFParse({ data: resumeFileBuffer });
               const pdfData = await parser.getText();
               await parser.destroy(); // 👈 Crucial: releases buffer from V8 heap
               resumeContent = pdfData.text;
          }

          const interviewReportByAi = await generateInterviewReport({
               resume: resumeContent,
               jobDescription,
               selfDescription: req.body.selfDescription || ""
          });

          // Save report to MongoDB Atlas
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
          let message = error.message || "Failed to generate report";
          if (status === 429) message = "Gemini API Quota Exceeded. Please try again later.";
          return res.status(status).json({ message, error: error.message });
     }
};

const getResumePdfById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await InterviewReportModel.findById(id).select('resumeFile resumeContentType user');
        if (!report || !report.resumeFile) return res.status(404).json({ message: "Resume PDF not found" });
        if (report.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        res.set({
            'Content-Type': report.resumeContentType || 'application/pdf',
            'Content-Disposition': `attachment; filename="resume_${id}.pdf"`
        });
        return res.send(report.resumeFile);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = { generateInterviewReportController, getResumePdfById };"""
    story.append(render_code_box(code_interview_ctrl))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>4.2 ImageKit Avatar Cloud Upload Controller (backend/src/controllers/imagekit.controller.js)</b>", h2_style))
    code_ik_ctrl = """const imagekit = require("../config/imagekit.config");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file provided." });
    const { removeBackground } = req.body;
    const fileBase64 = req.file.buffer.toString("base64");

    const uploadOptions = {
      file: fileBase64,
      fileName: req.file.originalname,
      folder: "/resumeai/avatars"
    };

    // Automated background removal extension
    if (removeBackground === "true" || removeBackground === true) {
      uploadOptions.extensions = [{ name: "remove-bg", options: { add_shadow: false } }];
    }

    const response = await imagekit.upload(uploadOptions);
    res.status(200).json({ success: true, url: response.url, fileId: response.fileId });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image." });
  }
};
module.exports = { uploadImage };"""
    story.append(render_code_box(code_ik_ctrl))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 5: AUTHENTICATION & SECURITY ====================
    story.append(PageBreak())
    story.append(Paragraph("5. Authentication, Security & Stateful Token Revocation", h1_style))

    story.append(Paragraph("<b>5.1 Auth Controller (backend/src/controllers/auth.controller.js)</b>", h2_style))
    code_auth_ctrl = """const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({ message: "Registered successfully", user: { username: newUser.username, email: newUser.email } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const loginUserConroller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const logoutUserConroller = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) await tokenBlacklistModel.create({ token });
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { registerController, loginUserConroller, logoutUserConroller };"""
    story.append(render_code_box(code_auth_ctrl))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>5.2 Auth Middleware with Blacklist Cross-Checking (backend/src/middleware/auth.middleware.js)</b>", h2_style))
    code_auth_mid = """const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Authentication required" });

        // Query blacklist collection in MongoDB
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) return res.status(401).json({ message: "Token revoked. Please login again." });

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
module.exports = authMiddleware;"""
    story.append(render_code_box(code_auth_mid))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 6: FRONTEND REACT 19 ====================
    story.append(PageBreak())
    story.append(Paragraph("6. Frontend React 19 Engine & Dynamic Template Architecture", h1_style))

    story.append(Paragraph("<b>6.1 Master Resume Builder Engine (frontend/src/features/resume/pages/ResumeBuilder.jsx)</b>", h2_style))
    code_builder = """import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import ColorPicker from "../components/ColorPicker";
import TemplatePicker from "../components/TemplatePicker";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import ResumePreview from "../components/ResumePreview";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    title: "My AI Resume",
    themeColor: "#2563eb",
    fontFamily: "'Inter', sans-serif",
    personalInfo: { name: "", email: "", phone: "", linkedIn: "", github: "" },
    professionalSummary: "",
    experience: [], education: [], skills: [], customSections: []
  });
  const [template, setTemplate] = useState("modern");

  // Client-Side PDF Generation with Scale: 2 (High-DPI Retina Sharpness)
  const handleDownload = () => {
    const element = document.getElementById("hidden-resume-pdf-content") || document.getElementById("resume-pdf-content");
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.name || "Resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="rb-page">
      <header className="rb-header">
        <ColorPicker selectedColor={resumeData.themeColor} onChange={c => setResumeData(p => ({ ...p, themeColor: c }))} />
        <TemplatePicker selectedTemplate={template} onChange={setTemplate} />
        <button className="rb-download-btn" onClick={handleDownload}>Download PDF</button>
      </header>
      <main className="rb-main-grid">
        <div className="rb-form-panel">
          <PersonalInfoForm data={resumeData.personalInfo} onChange={d => setResumeData(p => ({ ...p, personalInfo: d }))} />
          <ExperienceForm experience={resumeData.experience} onChange={e => setResumeData(p => ({ ...p, experience: e }))} />
          <EducationForm education={resumeData.education} onChange={ed => setResumeData(p => ({ ...p, education: ed }))} />
          <SkillsForm skills={resumeData.skills} onChange={s => setResumeData(p => ({ ...p, skills: s }))} />
        </div>
        <div className="rb-preview-panel">
          <div id="resume-pdf-content"><ResumePreview data={resumeData} template={template} /></div>
        </div>
      </main>
    </div>
  );
};
export default ResumeBuilder;"""
    story.append(render_code_box(code_builder))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>6.2 Responsive A4 Canvas & Template Switcher (frontend/src/features/resume/components/ResumePreview.jsx)</b>", h2_style))
    code_preview = """import React, { useRef, useState, useEffect } from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import CorporateTemplate from "./templates/CorporateTemplate";

const ResumePreviewWrapper = ({ data, template }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-scales A4 paper (794px width) to fit preview container responsiveness
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidth = 794 + 64;
        setScale(containerWidth < targetWidth ? containerWidth / targetWidth : 1);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const renderTemplate = () => {
    switch (template) {
      case "classic": return <ClassicTemplate data={data} />;
      case "corporate": return <CorporateTemplate data={data} />;
      case "modern": default: return <ModernTemplate data={data} />;
    }
  };

  return (
    <div ref={containerRef} className="preview-container">
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
        <div id="resume-pdf-content" style={{ width: "794px", minHeight: "1123px" }}>
          {renderTemplate()}
        </div>
      </div>
      {/* Hidden Unscaled Copy strictly for html2pdf.js */}
      <div style={{ position: "absolute", top: "-9999px" }}>
        <div id="hidden-resume-pdf-content" style={{ width: "794px", minHeight: "1123px" }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
export default ResumePreviewWrapper;"""
    story.append(render_code_box(code_preview))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 7: INTERVIEW DASHBOARD ====================
    story.append(PageBreak())
    story.append(Paragraph("7. AI Interview Analyzer & Interactive Dashboard UI", h1_style))

    story.append(Paragraph("<b>7.1 Ingestion Page (frontend/src/features/interview/pages/AnalyzePage.jsx)</b>", h2_style))
    code_analyze_page = """import React, { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

const AnalyzePage = () => {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    try {
      const selectedFile = resumeInputRef.current?.files[0];
      if (!selectedFile && !selfDescription.trim()) {
        return setErrorMsg("Please upload a resume or write a self description!");
      }
      if (!jobDescription.trim()) return setErrorMsg("Target Job Description is required!");

      const data = await generateReport({ jobDescription, selfDescription, resumeFile: selectedFile });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Generation failed");
    }
  };

  return (
    <div className="analyze-page">
      <input type="file" ref={resumeInputRef} accept=".pdf" />
      <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste Job Description..." />
      <button onClick={handleGenerateReport}>{loading ? "Analyzing Profile..." : "Generate Interview Strategy"}</button>
    </div>
  );
};
export default AnalyzePage;"""
    story.append(render_code_box(code_analyze_page))
    story.append(Spacer(1, 3))

    story.append(Paragraph("<b>7.2 Interactive Interview & Roadmap Page (frontend/src/features/interview/pages/interview.jsx)</b>", h2_style))
    code_interview_jsx = """const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="q-card" onClick={() => setOpen(!open)}>
      <div className="q-card__header"><span>Q{index + 1}: {item.question}</span></div>
      {open && (
        <div className="q-card__body">
          <p><b>Intention:</b> {item.intention}</p>
          <p><b>Model Answer:</b> {item.answer}</p>
        </div>
      )}
    </div>
  );
};

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical"); // 'technical' | 'behavioral' | 'roadmap'
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  useEffect(() => { if (interviewId) getReportById(interviewId); }, [interviewId]);

  return (
    <div className="interview-layout">
      <div className="match-score">Match Score: {report?.matchScore}%</div>
      {activeNav === "technical" && report?.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
      {activeNav === "roadmap" && report?.preparationPlan.map((d, i) => (
        <div key={i} className="day-box">Day {d.day}: {d.focus} ({d.tasks.join(", ")})</div>
      ))}
      <button onClick={() => getResumePdf(interviewId)}>Download Original Resume</button>
    </div>
  );
};"""
    story.append(render_code_box(code_interview_jsx))
    story.append(Spacer(1, 4))

    # ==================== CHAPTER 8: TOP VIVA QUESTIONS ====================
    story.append(PageBreak())
    story.append(Paragraph("8. Master Technical Defense & Viva Handbook (Top 12 Questions)", h1_style))
    story.append(Paragraph(
        "These questions represent the most critical architectural, algorithmic, and engineering challenges solved in this project. Study each answer thoroughly:",
        body_style
    ))
    story.append(Spacer(1, 2))

    qa_master_list = [
        (
            "Q1: Why was Google Gemini 2.0 Flash selected for this architecture?",
            "Gemini 2.0 Flash provides sub-second inference speeds (~400ms), native structured JSON schema enforcement (responseMimeType: 'application/json'), affordable API token cost, and a large context window capable of ingesting multi-page PDF resumes and dense job descriptions simultaneously."
        ),
        (
            "Q2: How does the backend prevent XSS attacks with JWT tokens?",
            "Tokens are stored exclusively in HTTP-Only Cookies (res.cookie('token', token, { httpOnly: true })). Because the httpOnly flag prevents client-side JavaScript (document.cookie) from reading the token, malicious XSS scripts cannot extract user credentials."
        ),
        (
            "Q3: How is JWT token invalidation solved upon logout?",
            "Stateless JWTs remain valid until their expiration timestamp. Our system solves this by persisting revoked tokens into a MongoDB 'BlacklistTokens' collection on logout. The authMiddleware checks this collection on every protected request, immediately invalidating the session."
        ),
        (
            "Q4: Why use Multer memoryStorage instead of diskStorage for PDF parsing?",
            "Disk storage incurs disk I/O overhead and requires cron jobs or cleanup hooks to delete temporary files. Memory storage keeps the PDF in a RAM buffer (req.file.buffer), allowing instant stream parsing via pdf-parse v2, after which parser.destroy() immediately frees the V8 heap."
        ),
        (
            "Q5: How does the Resume Builder support live template switching without state loss?",
            "State is decoupled from presentation. All resume form inputs populate a central React state. Switching templates simply swaps the presentational component (e.g., from <ClassicTemplate /> to <ModernTemplate />) while passing the exact same state object as props."
        ),
        (
            "Q6: How does html2pdf.js produce crisp, non-blurry PDFs?",
            "It configures html2canvas with scale: 2 (doubling pixel density to match high-DPI displays) and useCORS: true (allowing external profile images to render), then uses jsPDF to compile the rasterized canvas into an A4 printable vector PDF."
        ),
        (
            "Q7: Why does ResumePreview render a hidden unscaled copy of the resume?",
            "When the user is viewing the resume on small laptops or mobile screens, the preview container applies CSS scale(scale) for responsive display. If html2pdf.js prints a scaled element, the PDF gets shrunken. The hidden unscaled copy at top: -9999px ensures 1:1 true A4 pixel printing regardless of viewport size."
        ),
        (
            "Q8: What error handling is implemented for upstream AI failures?",
            "The backend catches HTTP 429 (Rate limit / quota exceeded) and HTTP 502 (malformed JSON response) specifically, returning clean, actionable HTTP error codes and descriptive JSON payloads to the frontend without crashing the Node.js process."
        ),
        (
            "Q9: What is the purpose of Bcrypt salt rounds set to 10?",
            "Bcrypt salt rounds dictate the computational work factor (2^10 = 1024 hashing cycles). This introduces deliberate computation delay during password hashing, rendering brute-force dictionary and rainbow table attacks computationally infeasible."
        ),
        (
            "Q10: Why are subdocuments modeled with {_id: false} in Mongoose?",
            "For simple embedded arrays like technical questions or skill gaps that are never queried independently, disabling automatic _id generation saves index storage, reduces payload size, and keeps documents clean."
        ),
        (
            "Q11: What is the role of ImageKit CDN in this application?",
            "ImageKit provides cloud storage, real-time image optimization, resizing, and WebP compression for candidate avatar profile photos, and automatically removes background using the 'remove-bg' extension."
        ),
        (
            "Q12: How does the 7-day preparation roadmap organize interview tasks?",
            "The Gemini service categorizes detected skill gaps and job requirements into daily actionable milestones: Day 1-2 focuses on core concepts & language fundamentals, Day 3-4 on system design/architecture, Day 5 on live coding drills, Day 6 on behavioral STAR stories, and Day 7 on mock interview simulations."
        )
    ]

    for q, a in qa_master_list:
        card = [
            [Paragraph(q, qa_q_style)],
            [Paragraph(a, qa_a_style)]
        ]
        t = Table(card, colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
            ('BOX', (0,0), (-1,-1), 0.75, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 2.5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(t)
        story.append(Spacer(1, 1.5))

    story.append(Spacer(1, 3))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=4))
    story.append(Paragraph("<b>End of Master Study Guide.</b> Prepared for Karan Datta — AI Resume Builder & Analyzer Project.", subtitle_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Complete Exhaustive Master Study Guide PDF generated at: {filename}")

if __name__ == "__main__":
    out_file = "ResumeFinal_Master_Study_Guide.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_pdf(out_file)

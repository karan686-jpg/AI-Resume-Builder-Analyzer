# 📄 AI-Powered Resume Builder & Interview Analyzer

> **Tech Stack:** Express 5, React 19, Web Workers, Google Gemini AI, Node.js, MongoDB

An end-to-end full-stack platform featuring an in-browser zero-token ATS scoring engine and an enterprise-grade resilient AI interview preparation gateway.

---

## 🌟 Core Architectural Highlights (Resume Highlights)

* **⚡ In-Browser ATS Scoring Engine (Web Workers):**
  Performs 50+ heuristic checks (target keyword matching, quantifiable metrics via Google XYZ formula, action verb strength, contact completeness) inside a dedicated **Web Worker**. Delivers instant scoring and actionable feedback without consuming LLM API tokens or blocking the main React UI thread.

* **🛡️ Express 5 AI Gateway with Resilience Patterns:**
  Engineered a robust AI gateway with strict **JSON Schema validation**, **exponential jittered backoff**, and a **3-tier Gemini model fallback strategy** (`gemini-3.5-flash` → `gemini-3.7-flash` → `gemini-3.8-flash`) to ensure uninterrupted availability against API rate limits and model service outages.

* **🎯 Automated Interview Preparation & Skill-Gap Analysis:**
  Extracts text in-memory from uploaded PDF resumes using `pdf-parse` without saving unneeded files to disk. Generates customized technical & behavioral interview Q&A with model answers, comprehensive skill-gap analysis, and a structured 7-day preparation roadmap.

---

## 🚀 Tech Stack

### Frontend
- **React 19 & Vite**
- **Web Workers API** (Non-blocking background heuristic analysis)
- **Tailwind CSS V4**
- **React Router 7**
- **Lucide React**

### Backend
- **Node.js & Express 5**
- **@google/genai SDK** (Structured JSON Output via `responseSchema`)
- **MongoDB & Mongoose**
- **Multer** (In-memory buffer upload)
- **pdf-parse** (In-memory PDF text extraction)
- **JSON Web Tokens (JWT) & Bcrypt.js**

---

## 💻 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- MongoDB Database (Local or MongoDB Atlas)
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👨‍💻 Developed by Karan Datta
Built as an enterprise-grade showcase of AI integration, browser concurrency with Web Workers, and backend resilience engineering.

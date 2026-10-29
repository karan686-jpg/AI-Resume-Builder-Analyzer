# 📄 AI-Powered Resume Builder & Interview Analyzer

> **Tech Stack:** Express 5, React 19, Web Workers, Google Gemini AI, Node.js, MongoDB

An end-to-end full-stack platform featuring an in-browser zero-token ATS scoring engine and an enterprise-grade resilient AI interview preparation gateway.

---

## 🌟 Core Architectural Highlights (Resume Highlights)

* **⚡ In-Browser ATS Scoring Engine (Web Workers):**
  Built an in-browser ATS scoring engine running in a **persistent Web Worker** with O(1) Set-based keyword extraction, Google XYZ quantifiable metrics detection, a 50+ action-verb lexicon, and contact completeness checks. Delivers live feedback with **zero API token cost** and zero main-thread blocking.

* **🛡️ Express 5 AI Gateway with Resilience Patterns:**
  Engineered an **Express 5 AI gateway** featuring **schema-constrained structured JSON output**, **exponential jittered backoff**, and a **3-tier Gemini fallback strategy** (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash`) with intelligent error classification (retrying 429/503 while immediately failing fast on 4xx client errors) to ensure high availability.

* **🎯 Automated Interview Preparation & Skill-Gap Analysis:**
  Developed an automated interview preparation pipeline using **Google Gemini** and in-memory **pdf-parse** (zero disk footprint). Generates customized technical & behavioral Q&A, skill-gap analysis, and a structured 7-day preparation roadmap. Enforces strict IDOR prevention via atomic owner-scoped queries (`{ _id, userId }`).

---

## 🚀 Tech Stack

### Frontend
- **React 19 & Vite**
- **Web Workers API** (Dedicated non-blocking background thread)
- **Tailwind CSS V4**
- **React Router 7**

### Backend
- **Node.js & Express 5**
- **@google/genai SDK** (Structured JSON Output via `responseSchema`)
- **MongoDB & Mongoose** (Compound indexes `{ userId: 1, updatedAt: -1 }`)
- **Multer** (In-memory buffer upload)
- **pdf-parse** (In-memory zero-disk PDF text extraction)
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

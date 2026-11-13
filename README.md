# AI-Powered Resume Builder

> **Tech Stack:** Express 5, Web Workers, Gemini AI, Node.js, React, `pdf-parse`

A lean, interview-focused implementation built strictly around the three core engineering pillars:

1. **In-Browser ATS Scoring Engine (Web Workers):** Runs 50+ heuristic checks (O(1) Set keyword matching, Google XYZ metrics regex, 56 action verbs, and structural completeness) in a dedicated background `Worker` thread with **0 LLM token usage** and zero main-thread blocking.
2. **Resilient Express 5 AI Gateway:** Stateless `POST /api/analyze` endpoint featuring Gemini `responseSchema` constrained decoding + gateway JSON Schema validation, exponential jittered backoff on `429`/`503`, fail-fast on `4xx` client errors, and a 3-tier model fallback cascade (`gemini-3.5-flash` → `gemini-3.5-flash-lite` → `gemini-3.1-flash-lite`).
3. **Automated PDF Extraction & Interview Prep:** Extracts resume PDF text in-memory via `multer.memoryStorage()` + `pdf-parse` (zero disk footprint) and generates tailored technical/behavioral Q&A, skill-gap analysis, and a 7-day preparation roadmap.

## Quick Start

### Backend
```bash
cd backend
npm install
# Create .env with GOOGLE_GENAI_API_KEY=your_key
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

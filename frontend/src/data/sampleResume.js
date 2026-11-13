export const SAMPLE_JD =
  "Seeking a Software Engineer proficient in Node.js, Express, React, JavaScript, and REST APIs. Experience with Web Workers, Google Gemini AI, JSON Schema validation, rate-limit backoff strategies, and PDF parsing (pdf-parse) is strongly preferred.";

export const SAMPLE_RESUME = {
  personalInfo: {
    name: "Karan Datta",
    title: "B.Tech CSE · IIT Kharagpur (2026 Placement Candidate)",
    email: "karan.datta@example.com",
    phone: "+91 98765 43210",
    linkedIn: "linkedin.com/in/karandatta",
    github: "github.com/karandatta",
  },
  professionalSummary:
    "Software Engineer focused on backend resilience, browser concurrency, and applied AI systems. Built an AI-Powered Resume Builder and interview preparation pipeline using Express 5, Web Workers, pdf-parse, and Google Gemini.",
  experience: [
    {
      company: "Systems & Product Engineering",
      role: "Software Engineering Intern",
      dates: "May 2025 - Jul 2025",
      description:
        "Engineered REST APIs in Node.js and Express, reducing p95 response latency by 35%.\nAutomated schema validation and retry logic, improving API reliability across 10k+ daily requests.",
    },
  ],
  projects: [
    {
      title: "AI-Powered Resume Builder",
      techStack: "Express 5 · Web Workers · Gemini AI · Node.js · pdf-parse",
      dates: "2026",
      description:
        "Built an in-browser ATS scoring engine performing 50+ heuristic checks inside a Web Worker, providing instant feedback with 0% LLM token usage and zero main-thread blocking.\nEngineered an Express 5 AI gateway with JSON Schema validation, exponential jittered backoff, and a 3-tier Gemini fallback strategy to improve resilience against API rate limits.\nAutomated resume analysis, interview preparation (custom Q&A, skill-gap analysis, 7-day roadmap), and PDF extraction using pdf-parse and Google Gemini, cutting manual review time to a few seconds.",
    },
  ],
  education: [
    {
      institution: "IIT Kharagpur",
      degree: "B.Tech",
      fieldOfStudy: "Engineering",
      dates: "2022 - 2026",
    },
  ],
  skills: [
    "JavaScript",
    "Node.js",
    "Express 5",
    "React",
    "Web Workers",
    "Google Gemini AI",
    "JSON Schema",
    "pdf-parse",
    "REST APIs",
    "Tailwind CSS",
  ],
};


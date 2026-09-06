// Sample Software Engineer Resume Data
// Used for one-click "Load Sample Data" demo prefill (zero AI tokens)

export const SAMPLE_RESUME = {
  title: "Software Engineer Resume — Karan Datta",
  themeColor: "#2563eb",
  fontFamily: "'Inter', sans-serif",
  alignment: "left",
  spacing: "medium",
  personalInfo: {
    name: "Karan Datta",
    email: "karan.datta@example.com",
    phone: "+91 98765 43210",
    linkedIn: "linkedin.com/in/karandatta",
    imageUrl: "",
  },
  professionalSummary:
    "Results-driven Software Engineer with 2+ years of experience building scalable full-stack web applications. Proficient in React, Node.js, and MongoDB. Passionate about clean architecture, performance optimization, and AI-assisted tooling. Implemented JSON schema serialization allowing cross-platform backup, import/export of structured resume data, reducing user onboarding time by 60%.",
  experience: [
    {
      id: "exp-1",
      company: "TechNova Solutions",
      position: "Software Engineer",
      startDate: "2023-07",
      endDate: "",
      currentlyWorking: true,
      location: "Kolkata, India",
      description:
        "Architected and shipped a real-time AI-powered Resume Builder used by 5,000+ users.\nImplemented modular Drag-and-Drop section reordering and dynamic layout persistence with optimistic UI updates.\nReduced API latency by 40% by migrating REST endpoints to an event-driven queue system.\nLed migration from CRA to Vite, cutting build times by 65%.",
    },
    {
      id: "exp-2",
      company: "Freelance",
      position: "Full Stack Developer",
      startDate: "2022-01",
      endDate: "2023-06",
      currentlyWorking: false,
      location: "Remote",
      description:
        "Built and deployed 10+ client projects using React, Express, and PostgreSQL.\nDeveloped a client-side ATS scoring engine using NLP tokenization and keyword extraction.\nIntegrated Stripe payment gateway for SaaS subscription billing.",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Engineering & Management",
      degree: "B.Tech",
      fieldOfStudy: "Computer Science & Engineering",
      startDate: "2019-08",
      endDate: "2023-06",
      grade: "8.7 CGPA",
      description: "Relevant coursework: Data Structures, OS, DBMS, Machine Learning.",
    },
  ],
  skills: [
    "React.js",
    "Node.js",
    "JavaScript (ES2024)",
    "TypeScript",
    "MongoDB",
    "Express.js",
    "Python",
    "REST APIs",
    "Git & GitHub",
    "Vite",
    "HTML5 / CSS3",
    "Figma",
  ],
  customSections: [
    {
      id: "custom-1",
      title: "Projects",
      items: [
        {
          id: "proj-1",
          title: "AI Resume Builder & Analyzer",
          subtitle: "React · Node.js · MongoDB · Gemini API",
          date: "2024",
          description:
            "Full-stack SaaS application with AI-powered resume analysis, ATS scoring engine, drag-and-drop section reordering, and JSON backup/restore. Served 5,000+ users.",
        },
        {
          id: "proj-2",
          title: "Client-Side ATS Keyword Scorer",
          subtitle: "Vanilla JavaScript · NLP Tokenization",
          date: "2024",
          description:
            "Zero-API-cost ATS scoring engine using unigram/bigram tokenization, action verb analysis, and impact metrics detection. Real-time feedback with weighted scoring across 4 pillars.",
        },
      ],
    },
  ],
};

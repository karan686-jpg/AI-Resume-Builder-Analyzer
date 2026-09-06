import { ALL_ACTION_VERBS } from "../constants/actionVerbs";
import { tokenize, extractKeywords, detectMetrics } from "./textExtractor";

/**
 * Flattens resume data object into a single plain text corpus for analysis
 */
export const resumeToText = (resumeData) => {
  if (!resumeData) return "";
  const parts = [];

  // Personal Info
  if (resumeData.personalInfo) {
    const { name, email, phone, linkedIn, github, portfolio } = resumeData.personalInfo;
    parts.push(name, email, phone, linkedIn, github, portfolio);
  }

  // Summary
  if (resumeData.professionalSummary) {
    parts.push(resumeData.professionalSummary);
  }

  // Experience
  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp) => {
      parts.push(exp.title, exp.company, exp.description);
    });
  }

  // Education
  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu) => {
      parts.push(edu.degree, edu.institution, edu.fieldOfStudy);
    });
  }

  // Skills
  if (Array.isArray(resumeData.skills)) {
    parts.push(resumeData.skills.join(" "));
  }

  // Custom sections
  if (Array.isArray(resumeData.customSections)) {
    resumeData.customSections.forEach((sec) => {
      parts.push(sec.title);
      if (Array.isArray(sec.items)) {
        sec.items.forEach((item) => {
          parts.push(item.title, item.subtitle, item.description);
        });
      }
    });
  }

  return parts.filter(Boolean).join(" ");
};

/**
 * Core ATS Scoring Engine (Runs 100% Client-Side with 0ms latency and 0 AI tokens)
 */
export const calculateATSScore = (resumeInput, jobDescription = "") => {
  // Support both raw text string and structured resumeData object
  const resumeText = typeof resumeInput === "string" ? resumeInput : resumeToText(resumeInput);
  const cleanResumeWords = tokenize(resumeText);
  const totalWordCount = cleanResumeWords.length;

  const suggestions = [];

  // ── 1. Keyword & Skills Match (40 Points Max) ─────────────────────────────
  let keywordScore = 0;
  let matchedKeywords = [];
  let missingKeywords = [];

  if (jobDescription && jobDescription.trim().length > 20) {
    const jobKeywords = extractKeywords(jobDescription, 25);
    const resumeTextLower = resumeText.toLowerCase();

    jobKeywords.forEach(({ term, count }) => {
      // Check if keyword or phrase exists in resume
      if (resumeTextLower.includes(term)) {
        matchedKeywords.push({ term, jobCount: count });
      } else {
        missingKeywords.push({ term, jobCount: count });
      }
    });

    const totalJdKeywords = jobKeywords.length || 1;
    const matchRatio = matchedKeywords.length / totalJdKeywords;
    keywordScore = Math.round(matchRatio * 40);

    if (missingKeywords.length > 0) {
      suggestions.push({
        type: "keywords",
        title: "Include Missing Target Keywords",
        detail: `Consider incorporating top keywords from the job description: ${missingKeywords
          .slice(0, 5)
          .map((k) => `"${k.term}"`)
          .join(", ")}.`,
      });
    }
  } else {
    // Default baseline if no JD is provided yet (checks for technical skill volume)
    const skillsCount = typeof resumeInput === "object" ? resumeInput.skills?.length || 0 : 0;
    keywordScore = Math.min(40, Math.max(15, skillsCount * 3 + 15));
    suggestions.push({
      type: "jd_hint",
      title: "Paste a Target Job Description",
      detail: "Paste a job description to get an exact keyword match comparison against applicant screening filters.",
    });
  }

  // ── 2. Quantifiable Impact & Metrics (25 Points Max) ─────────────────────
  const detectedMetrics = detectMetrics(resumeText);
  let impactScore = 0;
  if (detectedMetrics.length >= 4) impactScore = 25;
  else if (detectedMetrics.length === 3) impactScore = 20;
  else if (detectedMetrics.length === 2) impactScore = 15;
  else if (detectedMetrics.length === 1) impactScore = 10;
  else impactScore = 4;

  if (detectedMetrics.length < 3) {
    suggestions.push({
      type: "impact",
      title: "Quantify Your Impact (Google XYZ Formula)",
      detail: "Add measurable numbers, percentages (e.g. 'boosted by 30%'), dollar values, or user counts to demonstrate tangible impact.",
    });
  }

  // ── 3. Action Verb Strength (20 Points Max) ──────────────────────────────
  const foundActionVerbs = [];
  const lowerWords = tokenize(resumeText);
  for (const word of lowerWords) {
    if (ALL_ACTION_VERBS.has(word) && !foundActionVerbs.includes(word)) {
      foundActionVerbs.push(word);
    }
  }

  let verbScore = 0;
  if (foundActionVerbs.length >= 8) verbScore = 20;
  else if (foundActionVerbs.length >= 5) verbScore = 16;
  else if (foundActionVerbs.length >= 3) verbScore = 12;
  else verbScore = Math.min(10, foundActionVerbs.length * 3);

  if (foundActionVerbs.length < 5) {
    suggestions.push({
      type: "verbs",
      title: "Use Stronger Action Verbs",
      detail: "Begin bullet points with decisive action verbs like 'Architected', 'Engineered', 'Optimized', or 'Spearheaded'.",
    });
  }

  // ── 4. Completeness & Formatting (15 Points Max) ─────────────────────────
  let completenessScore = 0;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /[\d\s\+\-\(\)]{7,}/.test(resumeText);
  const hasLinks = /(linkedin\.com|github\.com)/i.test(resumeText);

  if (hasEmail) completenessScore += 4;
  if (hasPhone) completenessScore += 3;
  if (hasLinks) completenessScore += 3;

  // Length check (optimal is 200 - 800 clean tokens)
  if (totalWordCount >= 150 && totalWordCount <= 850) completenessScore += 5;
  else if (totalWordCount > 80) completenessScore += 3;

  if (!hasLinks) {
    suggestions.push({
      type: "links",
      title: "Add GitHub / LinkedIn Links",
      detail: "Recruiters and ATS favor verifiable links to your technical profile.",
    });
  }

  const totalScore = Math.min(100, keywordScore + impactScore + verbScore + completenessScore);

  return {
    score: totalScore,
    breakdown: {
      keywords: { score: keywordScore, max: 40 },
      impact: { score: impactScore, max: 25 },
      verbs: { score: verbScore, max: 20 },
      completeness: { score: completenessScore, max: 15 },
    },
    matchedKeywords,
    missingKeywords,
    detectedMetrics,
    foundActionVerbs,
    totalWordCount,
    suggestions,
  };
};

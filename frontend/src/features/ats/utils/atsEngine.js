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
      parts.push(exp.role || exp.title || exp.position, exp.company, exp.description);
    });
  }

  // Education
  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu) => {
      parts.push(edu.degree, edu.institution, edu.fieldOfStudy || edu.field);
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
 * Standard ATS scoring weights (Total: 100 Points)
 */
export const SCORE_WEIGHTS = {
  KEYWORDS: 40,
  METRICS: 25,
  ACTION_VERBS: 20,
  COMPLETENESS: 15,
};

/**
 * Simplified, transparent ATS Scoring Engine evaluating 50+ heuristic criteria.
 */
export const calculateATSScore = (resumeInput, jobDescription = "") => {
  const resumeText = typeof resumeInput === "string" ? resumeInput : resumeToText(resumeInput);
  const cleanWords = tokenize(resumeText);
  const totalWordCount = cleanWords.length;
  const suggestions = [];

  // ── 1. Keywords Match (40 Points Max) ────────────────────────────────────
  let keywordScore = 0;
  const matchedKeywords = [];
  const missingKeywords = [];

  if (jobDescription && jobDescription.trim().length > 20) {
    const targetKeywords = extractKeywords(jobDescription, 20);
    const resumeLower = resumeText.toLowerCase();

    targetKeywords.forEach(({ term, count }) => {
      if (resumeLower.includes(term)) {
        matchedKeywords.push({ term, jobCount: count });
      } else {
        missingKeywords.push({ term, jobCount: count });
      }
    });

    const matchRatio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0;
    keywordScore = Math.round(matchRatio * SCORE_WEIGHTS.KEYWORDS);

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
    // Default fallback when no JD is provided: award points based on volume of skills
    const skillsCount = typeof resumeInput === "object" ? resumeInput.skills?.length || 0 : 0;
    keywordScore = Math.min(SCORE_WEIGHTS.KEYWORDS, Math.max(15, skillsCount * 3 + 15));
    suggestions.push({
      type: "jd_hint",
      title: "Paste a Target Job Description",
      detail: "Paste a job description to compare your keywords against actual screening criteria.",
    });
  }

  // ── 2. Quantifiable Impact & Metrics (25 Points Max) ──────────────────────
  // Each detected metric is worth 6 points, up to 25 points maximum
  const detectedMetrics = detectMetrics(resumeText);
  const impactScore = Math.min(SCORE_WEIGHTS.METRICS, detectedMetrics.length * 6);

  if (detectedMetrics.length < 3) {
    suggestions.push({
      type: "impact",
      title: "Quantify Your Impact (Google XYZ Formula)",
      detail: "Add measurable numbers, percentages (e.g. 'boosted by 30%'), or user counts to demonstrate tangible impact.",
    });
  }

  // ── 3. Power Action Verbs (20 Points Max) ─────────────────────────────────
  // Evaluates resume words against 55 curated technical/leadership action verbs
  const foundActionVerbs = [];
  for (const word of cleanWords) {
    if (ALL_ACTION_VERBS.has(word) && !foundActionVerbs.includes(word)) {
      foundActionVerbs.push(word);
    }
  }
  // Each unique action verb is worth 3 points, up to 20 points maximum
  const verbScore = Math.min(SCORE_WEIGHTS.ACTION_VERBS, foundActionVerbs.length * 3);

  if (foundActionVerbs.length < 5) {
    suggestions.push({
      type: "verbs",
      title: "Use Stronger Action Verbs",
      detail: "Begin bullet points with decisive verbs like 'Architected', 'Engineered', 'Optimized', or 'Spearheaded'.",
    });
  }

  // ── 4. Structural Completeness (15 Points Max) ────────────────────────────
  let completenessScore = 0;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(?:\+?\d[\d\s+\-()]{6,}\d|\b\d{10}\b)/.test(resumeText);
  const hasLinks = /(linkedin\.com|github\.com)/i.test(resumeText);

  if (hasEmail) completenessScore += 4;
  if (hasPhone) completenessScore += 3;
  if (hasLinks) completenessScore += 3;
  if (totalWordCount >= 150 && totalWordCount <= 850) completenessScore += 5;

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
      keywords: { score: keywordScore, max: SCORE_WEIGHTS.KEYWORDS },
      impact: { score: impactScore, max: SCORE_WEIGHTS.METRICS },
      verbs: { score: verbScore, max: SCORE_WEIGHTS.ACTION_VERBS },
      completeness: { score: completenessScore, max: SCORE_WEIGHTS.COMPLETENESS },
    },
    matchedKeywords,
    missingKeywords,
    detectedMetrics,
    foundActionVerbs,
    totalWordCount,
    suggestions,
  };
};

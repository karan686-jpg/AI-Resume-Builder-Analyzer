/**
 * In-Browser Heuristic ATS Scoring Engine (0 LLM Tokens)
 * Runs inside a Web Worker thread to prevent blocking the React UI.
 *
 * Evaluates 50+ heuristic checks across 4 weighted pillars (100 pts total):
 * 1. Keywords Match (40 pts)       -> Top 20 JD keywords via O(1) Set lookup (20 checks)
 * 2. Quantifiable Impact (25 pts)  -> 3 Google XYZ regex metric checks (%, $/x, scale units)
 * 3. Action Verbs Lexicon (20 pts) -> 56 categorized action verbs via O(1) Set lookup
 * 4. Completeness (15 pts)         -> 4 structural checks (email, phone, GitHub/LinkedIn, 150-850 words)
 */

export const ACTION_VERBS = {
  technical: [
    "architected", "engineered", "developed", "designed", "implemented", "programmed",
    "coded", "configured", "debugged", "deployed", "refactored", "containerized",
    "migrated", "automated", "integrated", "tested", "built",
  ],
  leadership: [
    "spearheaded", "orchestrated", "led", "mentored", "supervised", "championed",
    "directed", "managed", "coordinated", "delegated", "facilitated", "guided",
    "initiated", "empowered",
  ],
  optimization: [
    "optimized", "accelerated", "streamlined", "enhanced", "boosted", "reduced",
    "eliminated", "maximized", "minimized", "scaled", "standardized", "transformed",
    "modernized", "revamped",
  ],
  achievement: [
    "accomplished", "achieved", "delivered", "outperformed", "generated", "solved",
    "pioneered", "awarded", "published", "surpassed", "secured",
  ],
};

export const ALL_ACTION_VERBS = new Set(Object.values(ACTION_VERBS).flat());

export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any",
  "are", "as", "at", "be", "because", "been", "before", "being", "below", "between",
  "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each",
  "few", "for", "from", "further", "had", "has", "have", "having", "he", "her", "here",
  "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is",
  "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no", "nor",
  "not", "now", "of", "off", "on", "once", "only", "or", "other", "our", "ours",
  "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such",
  "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
  "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "we", "were", "what", "when", "where", "which", "while", "who",
  "whom", "why", "will", "with", "would", "you", "your", "yours", "yourself",
  "experience", "strong", "required", "proficient", "knowledge", "skills", "ability",
  "work", "years", "plus", "understanding", "good", "preferred", "role", "candidate",
]);

export const SCORE_WEIGHTS = {
  KEYWORDS: 40,
  METRICS: 25,
  ACTION_VERBS: 20,
  COMPLETENESS: 15,
};

export const tokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w+#]+|[^\w+#]+$/g, "").trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
};

export const extractKeywords = (text, topN = 20) => {
  const freq = {};
  for (const word of tokenize(text)) {
    if (word.length > 2 && isNaN(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count }));
};

export const detectMetrics = (text) => {
  if (!text) return [];
  const percentages = text.match(/\b\d+(\.\d+)?%/g) || [];
  const multipliers = text.match(/(\$\d+[\d,]*|\b\d+x\b)/gi) || [];
  const scaleUnits =
    text.match(/\b\d+\+?\s*(users|clients|projects|engineers|requests|ms|seconds|lpa|k|m)\b/gi) || [];
  return Array.from(new Set([...percentages, ...multipliers, ...scaleUnits].map((m) => m.trim())));
};

export const resumeToText = (data) => {
  if (!data) return "";
  if (typeof data === "string") return data;

  const p = data.personalInfo || {};
  const parts = [p.name, p.title, p.email, p.phone, p.linkedIn, p.github, data.professionalSummary];

  (data.experience || []).forEach((e) => parts.push(e.role, e.company, e.description));
  (data.education || []).forEach((e) => parts.push(e.degree, e.institution, e.fieldOfStudy));
  (data.projects || []).forEach((pr) => parts.push(pr.title, pr.techStack, pr.description));
  if (Array.isArray(data.skills)) parts.push(data.skills.join(" "));

  return parts.filter(Boolean).join(" ");
};

export const calculateATSScore = (resumeInput, jobDescription = "") => {
  const resumeText = resumeToText(resumeInput);
  const cleanWords = tokenize(resumeText);
  const resumeWordSet = new Set(cleanWords);
  const totalWordCount = cleanWords.length;
  const suggestions = [];

  // 1. Keywords Match (40 pts)
  let keywordScore = 0;
  const matchedKeywords = [];
  const missingKeywords = [];
  let targetKeywords = [];

  if (jobDescription.trim().length > 20) {
    targetKeywords = extractKeywords(jobDescription, 20);
    for (const { term, count } of targetKeywords) {
      if (resumeWordSet.has(term)) {
        matchedKeywords.push({ term, jobCount: count });
      } else {
        missingKeywords.push({ term, jobCount: count });
      }
    }
    const ratio = targetKeywords.length ? matchedKeywords.length / targetKeywords.length : 0;
    keywordScore = Math.round(ratio * SCORE_WEIGHTS.KEYWORDS);

    if (missingKeywords.length > 0) {
      suggestions.push({
        title: "Include Missing Target Keywords",
        detail: `Add high-frequency JD keywords: ${missingKeywords.slice(0, 5).map((k) => `"${k.term}"`).join(", ")}.`,
      });
    }
  } else {
    const skillsCount = typeof resumeInput === "object" ? resumeInput?.skills?.length || 0 : 0;
    keywordScore = Math.min(SCORE_WEIGHTS.KEYWORDS, Math.max(15, skillsCount * 3 + 15));
    suggestions.push({
      title: "Paste a Target Job Description",
      detail: "Add a target JD to benchmark keyword coverage accurately.",
    });
  }

  // 2. Quantifiable Impact / Google XYZ Metrics (25 pts)
  const detectedMetrics = detectMetrics(resumeText);
  const impactScore = Math.min(SCORE_WEIGHTS.METRICS, detectedMetrics.length * 6);
  if (detectedMetrics.length < 3) {
    suggestions.push({
      title: "Quantify Your Impact (XYZ Formula)",
      detail: "Include measurable numbers, percentages (e.g., 40%), or scale (e.g., 50+ checks, 3-tier).",
    });
  }

  // 3. Action Verbs Lexicon (20 pts)
  const foundActionVerbs = Array.from(ALL_ACTION_VERBS).filter((verb) => resumeWordSet.has(verb));
  const verbScore = Math.min(SCORE_WEIGHTS.ACTION_VERBS, foundActionVerbs.length * 3);
  if (foundActionVerbs.length < 5) {
    suggestions.push({
      title: "Use Stronger Action Verbs",
      detail: "Start bullet points with decisive verbs like Architected, Engineered, Automated, or Optimized.",
    });
  }

  // 4. Structural Completeness (15 pts)
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
      title: "Add GitHub / LinkedIn Links",
      detail: "Recruiters expect verifiable links to your GitHub and LinkedIn profiles.",
    });
  }

  return {
    score: Math.min(100, keywordScore + impactScore + verbScore + completenessScore),
    heuristicsEvaluated: targetKeywords.length + 3 + ALL_ACTION_VERBS.size + 4,
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


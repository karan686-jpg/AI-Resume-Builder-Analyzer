/**
 * Unified In-Browser Heuristic ATS Scoring Engine
 * Evaluates 50+ heuristic criteria across 4 dimensions:
 * 1. Keywords Match (40 pts) - O(N) frequency-based keyword extraction
 * 2. Quantifiable Impact & Metrics (25 pts) - Google XYZ formula detection via regex
 * 3. Action Verbs (20 pts) - 55+ powerhouse verbs checked via O(1) Set lookup
 * 4. Structural Completeness (15 pts) - contact details, links, word count bounds
 *
 * Runs inside a Web Worker thread for zero-latency, non-blocking UI (0 LLM tokens).
 */

// ── 1. Power Action Verbs ───────────────────────────────────────────────────
export const ACTION_VERBS = {
  technical: [
    "architected", "engineered", "developed", "designed", "implemented",
    "programmed", "coded", "configured", "debugged", "deployed", "refactored",
    "containerized", "migrated", "automated", "integrated", "tested", "built"
  ],
  leadership: [
    "spearheaded", "orchestrated", "led", "mentored", "supervised",
    "championed", "directed", "managed", "coordinated", "delegated",
    "facilitated", "guided", "initiated", "empowered"
  ],
  optimization: [
    "optimized", "accelerated", "streamlined", "enhanced", "boosted",
    "reduced", "eliminated", "maximized", "minimized", "scaled",
    "standardized", "transformed", "modernized", "revamped"
  ],
  achievement: [
    "accomplished", "achieved", "delivered", "outperformed", "generated",
    "solved", "pioneered", "awarded", "published", "surpassed", "secured"
  ]
};

export const ALL_ACTION_VERBS = new Set(
  Object.values(ACTION_VERBS).flatMap((list) => list.map((v) => v.toLowerCase()))
);

// ── 2. Filter Stop Words ────────────────────────────────────────────────────
export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
  "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
  "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just",
  "me", "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once",
  "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she",
  "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves",
  "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until",
  "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom",
  "why", "will", "with", "would", "you", "your", "yours", "yourself", "yourselves",
  // Common JD recruitment filler words to avoid false positive keywords
  "experience", "strong", "required", "proficient", "knowledge", "skills", "ability",
  "work", "years", "plus", "understanding", "good", "preferred", "role", "candidate"
]);


// ── 3. Tokenizer & Text Utilities ───────────────────────────────────────────
export const tokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w+#]+|[^\w+#]+$/g, "").trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
};

export const extractKeywords = (text, topN = 25) => {
  if (!text) return [];
  const words = tokenize(text);
  const frequencyMap = {};
  for (const word of words) {
    if (word.length > 2 && isNaN(word)) {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }
  }
  return Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count }));
};

export const detectMetrics = (text) => {
  if (!text) return [];
  const percentages = text.match(/\b\d+(\.\d+)?%/g) || [];
  const currencyAndMultipliers = text.match(/(\$\d+[\d,]*|\b\d+x\b)/gi) || [];
  const impactUnits =
    text.match(/\b\d+\+?\s*(users|clients|projects|engineers|team members|requests|ms|k|m)\b/gi) || [];
  const allMatches = [...percentages, ...currencyAndMultipliers, ...impactUnits];
  return Array.from(new Set(allMatches.map((m) => m.trim())));
};

export const resumeToText = (resumeData) => {
  if (!resumeData) return "";
  const parts = [];
  if (resumeData.personalInfo) {
    const { name, email, phone, linkedIn, github, portfolio } = resumeData.personalInfo;
    parts.push(name, email, phone, linkedIn, github, portfolio);
  }
  if (resumeData.professionalSummary) parts.push(resumeData.professionalSummary);
  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp) => parts.push(exp.role || exp.title, exp.company, exp.description));
  }
  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu) => parts.push(edu.degree, edu.institution, edu.fieldOfStudy || edu.field));
  }
  if (Array.isArray(resumeData.skills)) parts.push(resumeData.skills.join(" "));
  if (Array.isArray(resumeData.customSections)) {
    resumeData.customSections.forEach((sec) => {
      parts.push(sec.title);
      if (Array.isArray(sec.items)) {
        sec.items.forEach((item) => parts.push(item.title, item.subtitle, item.description));
      }
    });
  }
  return parts.filter(Boolean).join(" ");
};

// ── 4. ATS Scoring Weights ──────────────────────────────────────────────────
export const SCORE_WEIGHTS = {
  KEYWORDS: 40,
  METRICS: 25,
  ACTION_VERBS: 20,
  COMPLETENESS: 15,
};

// ── 5. Main ATS Calculation Engine ──────────────────────────────────────────
export const calculateATSScore = (resumeInput, jobDescription = "") => {
  const resumeText = typeof resumeInput === "string" ? resumeInput : resumeToText(resumeInput);
  const cleanWords = tokenize(resumeText);
  const totalWordCount = cleanWords.length;
  const suggestions = [];

  // 1. Keywords Match (40 pts)
  let keywordScore = 0;
  const matchedKeywords = [];
  const missingKeywords = [];
  const resumeWordSet = new Set(cleanWords);

  if (jobDescription && jobDescription.trim().length > 20) {
    const targetKeywords = extractKeywords(jobDescription, 20);

    targetKeywords.forEach(({ term, count }) => {
      // O(1) Set lookup ensures exact whole-word matching (avoids 'java' colliding with 'javascript')
      if (resumeWordSet.has(term)) {
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
    const skillsCount = typeof resumeInput === "object" ? resumeInput.skills?.length || 0 : 0;
    keywordScore = Math.min(SCORE_WEIGHTS.KEYWORDS, Math.max(15, skillsCount * 3 + 15));
    suggestions.push({
      type: "jd_hint",
      title: "Paste a Target Job Description",
      detail: "Paste a job description to compare your keywords against actual screening criteria.",
    });
  }

  // 2. Quantifiable Impact & Metrics (25 pts - Google XYZ formula)
  const detectedMetrics = detectMetrics(resumeText);
  const impactScore = Math.min(SCORE_WEIGHTS.METRICS, detectedMetrics.length * 6);
  if (detectedMetrics.length < 3) {
    suggestions.push({
      type: "impact",
      title: "Quantify Your Impact (Google XYZ Formula)",
      detail: "Add measurable numbers, percentages (e.g. 'boosted by 30%'), or user counts to demonstrate tangible impact.",
    });
  }

  // 3. Power Action Verbs (20 pts)
  const foundActionVerbs = [];
  for (const word of cleanWords) {
    if (ALL_ACTION_VERBS.has(word) && !foundActionVerbs.includes(word)) {
      foundActionVerbs.push(word);
    }
  }
  const verbScore = Math.min(SCORE_WEIGHTS.ACTION_VERBS, foundActionVerbs.length * 3);
  if (foundActionVerbs.length < 5) {
    suggestions.push({
      type: "verbs",
      title: "Use Stronger Action Verbs",
      detail: "Begin bullet points with decisive verbs like 'Architected', 'Engineered', 'Optimized', or 'Spearheaded'.",
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

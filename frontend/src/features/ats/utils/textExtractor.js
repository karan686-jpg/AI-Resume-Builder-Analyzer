import { STOP_WORDS } from "../constants/stopWords";

/**
 * 1. Tokenize text: convert to lowercase, remove punctuation, filter out common stop words.
 */
export const tokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w+#]+|[^\w+#]+$/g, "").trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
};

/**
 * 2. Extract top target keywords by word frequency.
 * Simple, efficient O(N) word counting sorted descending.
 */
export const extractKeywords = (text, topN = 25) => {
  if (!text) return [];

  const words = tokenize(text);
  const frequencyMap = {};

  for (const word of words) {
    // Only count meaningful words (longer than 2 characters and not pure digits)
    if (word.length > 2 && isNaN(word)) {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }
  }

  return Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count }));
};

/**
 * 3. Detect quantifiable achievements and impact metrics.
 * Broken into 3 clean, intuitive buckets:
 * - Percentages (e.g. 25%, 99.9%)
 * - Currency and multipliers (e.g. $100k, 2x, 5x)
 * - Numbered impact units (e.g. 500 users, 10 projects, 200ms)
 */
export const detectMetrics = (text) => {
  if (!text) return [];

  const percentages = text.match(/\b\d+(\.\d+)?%/g) || [];
  const currencyAndMultipliers = text.match(/(\$\d+[\d,]*|\b\d+x\b)/gi) || [];
  const impactUnits = text.match(/\b\d+\+?\s*(users|clients|projects|engineers|team members|requests|ms|k|m)\b/gi) || [];

  const allMatches = [...percentages, ...currencyAndMultipliers, ...impactUnits];
  return Array.from(new Set(allMatches.map((m) => m.trim())));
};

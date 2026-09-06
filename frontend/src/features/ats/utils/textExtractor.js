import { STOP_WORDS } from "../constants/stopWords";

/**
 * Clean text, strip punctuation, lowercase, and tokenize into words
 */
export const tokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\.\+#]/g, " ") // retain dots/plus/hash for tech like c++, c#, .net, node.js
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
};

/**
 * Extract 2-word n-grams (phrases like "machine learning", "rest api")
 */
export const extractBigrams = (text) => {
  if (!text || typeof text !== "string") return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    const first = words[i];
    const second = words[i + 1];
    if (!STOP_WORDS.has(first) || !STOP_WORDS.has(second)) {
      bigrams.push(`${first} ${second}`);
    }
  }
  return bigrams;
};

/**
 * Extract meaningful keywords (unigrams + common bigrams) with frequency counts
 */
export const extractKeywords = (text, topN = 30) => {
  if (!text) return [];

  const unigrams = tokenize(text);
  const bigrams = extractBigrams(text);

  const freq = new Map();

  // Count unigrams (filtering stop words and pure numbers)
  for (const word of unigrams) {
    if (!/^\d+$/.test(word)) {
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }

  // Count bigrams with higher weighting if repeated
  for (const bg of bigrams) {
    freq.set(bg, (freq.get(bg) || 0) + 1.5);
  }

  // Sort descending by frequency
  const sorted = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count: Math.round(count) }));

  return sorted;
};

/**
 * Detect quantifiable impact metrics (numbers, %, $, multipliers)
 */
export const detectMetrics = (text) => {
  if (!text) return [];
  const metricRegex = /\b(\d+(\.\d+)?%|\$\d+[\d,]*(\.\d+)?|\b\d+x\b|\b\d+\+?(\s*(ms|k|m|users|clients|projects|queries|requests|team members|developers|engineers|reduction|increase|improvement|growth)))/gi;
  const matches = text.match(metricRegex) || [];
  return Array.from(new Set(matches.map((m) => m.trim())));
};

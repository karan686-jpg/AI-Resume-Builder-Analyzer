import { calculateATSScore } from "../utils/atsEngine";

/**
 * Dedicated Web Worker for offloading 50+ heuristic ATS checks,
 * keyword matching, and action verb parsing from the React main UI thread.
 */
self.onmessage = (event) => {
  const { resumeData, jobDescription } = event.data || {};

  try {
    const result = calculateATSScore(resumeData, jobDescription);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message || "Failed to execute ATS heuristic analysis",
    });
  }
};

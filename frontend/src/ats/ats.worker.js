import { calculateATSScore } from "./atsEngine";

// Dedicated Web Worker thread: keeps ATS scoring off the React main thread (0 LLM tokens)
self.onmessage = (event) => {
  const { resumeData, jobDescription } = event.data || {};
  try {
    const result = calculateATSScore(resumeData, jobDescription);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message || "ATS analysis failed",
    });
  }
};


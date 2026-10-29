const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
});

const interviewReportJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    matchScore: { type: "integer" },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skillName: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          description: { type: "string" }
        },
        required: ["skillName", "severity", "description"]
      }
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          focus: { type: "string" },
          tasks: { type: "array", items: { type: "string" } }
        },
        required: ["day", "title", "focus", "tasks"]
      }
    }
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan"
  ]
};

// 3-tier Production Gemini Fallback Strategy (matching resume bullet)
const FALLBACK_MODELS = [
  "gemini-2.5-flash", // Tier 1: Primary high-performance model
  "gemini-2.0-flash", // Tier 2: Resilient high-availability fallback
  "gemini-1.5-flash", // Tier 3: High-stability legacy fallback
];

/**
 * Executes a Gemini generation request with 3-tier model cascading and exponential jittered backoff retry
 * on HTTP 429 (Rate Limit) and 503 (Overloaded) errors.
 * Immediately fails fast on 4xx client errors (400, 401, 403) to prevent useless fallback cascading.
 */
async function generateContentWithRetryAndFallback(options, maxRetries = 2) {
  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await genAI.models.generateContent({
          ...options,
          model,
        });
        return response;
      } catch (error) {
        lastError = error;
        const status = error.status || (error.message?.includes("429") ? 429 : error.message?.includes("503") ? 503 : null);
        const isRateLimit = status === 429;
        const isOverloaded = status === 503;
        const isNotFound = status === 404 || error.message?.toLowerCase().includes("not found");
        const isClientError = status && status >= 400 && status < 500 && !isRateLimit && !isNotFound;

        // Fail-fast on client errors: bad input, bad API key, or invalid params will never succeed on other models
        if (isClientError) {
          throw error;
        }

        // Model not available on this tier: cascade to next model tier immediately
        if (isNotFound) {
          console.warn(`[GenAI] Tier model ${model} not available. Cascading to next fallback tier...`);
          break;
        }

        // Rate limit or temporary service overload: retry with exponential jittered backoff
        if ((isRateLimit || isOverloaded) && attempt < maxRetries) {
          const baseDelay = 1000 * Math.pow(2, attempt - 1);
          // 0-500ms random jitter prevents Thundering Herd Problem across concurrent users
          const jitter = Math.floor(Math.random() * 500);
          const waitMs = baseDelay + jitter;

          console.warn(`[GenAI] ${model} hit status ${status || 'busy'}. Retrying attempt ${attempt}/${maxRetries} after ${waitMs}ms...`);
          await new Promise((res) => setTimeout(res, waitMs));
          continue;
        }

        // Retries exhausted for this tier: cascade to next tier in FALLBACK_MODELS
        break;
      }
    }
  }

  throw lastError;
}


async function generateInterviewReport({
  jobDescription,
  resume,
  selfDescription,
}) {
  const prompt = `
You are an expert career coach and technical interviewer.
Analyze the following candidate inputs against the target job description:

1. Target Job Description:
${jobDescription}

2. Candidate Resume:
${resume || "(No resume provided)"}

3. Candidate Self-Description:
${selfDescription || "(No self-description provided)"}

Generate a comprehensive interview preparation report:
- title: Short, engaging title for this prep report
- matchScore: Match percentage (0-100) between candidate profile and job requirements
- technicalQuestions: 5-7 core technical interview questions with intention and model answer
- behavioralQuestions: 5-7 behavioral questions (STAR format) with intention and model answer
- skillGaps: Missing or weak skills with severity (low/medium/high) and clear explanation
- preparationPlan: Structured 7-day preparation roadmap with actionable daily tasks
`;

  const response = await generateContentWithRetryAndFallback({
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportJsonSchema,
    },
  });
  let result = response.text;

  // Clean markdown block wrapper if present
  const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonMatch) {
    result = jsonMatch[1];
  }

  try {
    return JSON.parse(result);
  } catch (err) {
    console.error("AI JSON Parse Error:", err);
    const error = new Error("Failed to parse AI response into valid JSON.");
    error.status = 502;
    throw error;
  }
}

module.exports = {
  generateInterviewReport,
  generateContentWithRetryAndFallback,
};

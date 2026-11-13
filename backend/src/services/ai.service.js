const { GoogleGenAI } = require("@google/genai");

let genAI = null;
function getGenAIClient() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const err = new Error("Missing GOOGLE_GENAI_API_KEY environment variable.");
      err.status = 500;
      throw err;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

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
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skillName: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          description: { type: "string" },
        },
        required: ["skillName", "severity", "description"],
      },
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          focus: { type: "string" },
          tasks: { type: "array", items: { type: "string" } },
        },
        required: ["day", "title", "focus", "tasks"],
      },
    },
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

// 3-tier Gemini fallback strategy against rate limits and service overloads
const FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

/**
 * Gateway-level JSON Schema validator verifying structured AI output
 * before returning to the client.
 */
function validateReportSchema(data) {
  if (!data || typeof data !== "object") {
    const err = new Error("Schema validation failed: report must be a JSON object.");
    err.status = 502;
    throw err;
  }

  for (const field of interviewReportJsonSchema.required) {
    if (data[field] === undefined || data[field] === null) {
      const err = new Error(`Schema validation failed: missing required field '${field}'.`);
      err.status = 502;
      throw err;
    }
  }

  if (typeof data.title !== "string") {
    const err = new Error("Schema validation failed: 'title' must be a string.");
    err.status = 502;
    throw err;
  }
  if (typeof data.matchScore !== "number" || data.matchScore < 0 || data.matchScore > 100) {
    const err = new Error("Schema validation failed: 'matchScore' must be between 0 and 100.");
    err.status = 502;
    throw err;
  }

  const arrayFields = ["technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"];
  for (const field of arrayFields) {
    if (!Array.isArray(data[field])) {
      const err = new Error(`Schema validation failed: '${field}' must be an array.`);
      err.status = 502;
      throw err;
    }
  }

  return data;
}

/**
 * Executes a Gemini request with 3-tier model cascading and exponential jittered backoff
 * on 429 (Rate Limit) and 503 (Overloaded), while failing fast on 4xx client errors.
 */
async function generateContentWithRetryAndFallback(options, maxRetries = 2) {
  const client = getGenAIClient();
  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await client.models.generateContent({ ...options, model });
      } catch (error) {
        lastError = error;
        const status =
          error.status ||
          (error.message?.includes("429") ? 429 : error.message?.includes("503") ? 503 : null);
        const isRetryable = status === 429 || status === 503;
        const isNotFound = status === 404 || error.message?.toLowerCase().includes("not found");
        const isClientError = status && status >= 400 && status < 500 && !isRetryable && !isNotFound;

        if (isClientError) throw error;
        if (isNotFound) break;

        if (isRetryable && attempt < maxRetries) {
          const waitMs = 1000 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 500);
          console.warn(`[GenAI] ${model} status ${status}. Retrying in ${waitMs}ms...`);
          await new Promise((res) => setTimeout(res, waitMs));
          continue;
        }
        break;
      }
    }
  }

  throw lastError;
}

async function generateInterviewReport({ jobDescription, resumeText, resume, selfDescription }) {
  const candidateResume = resumeText || resume || "(No resume provided)";
  const prompt = `
You are an expert technical interviewer and career strategist.
Analyze the candidate profile against the target job description:

1. Target Job Description:
${jobDescription}

2. Candidate Resume:
${candidateResume}

3. Candidate Self-Description:
${selfDescription || "(No self-description provided)"}

Generate a comprehensive interview preparation report:
- title: Short title for this prep report
- matchScore: Match percentage (0-100)
- technicalQuestions: 5-7 tailored technical interview questions with intention and model answer
- behavioralQuestions: 5-7 STAR behavioral questions with intention and model answer
- skillGaps: Missing or weak skills with severity (low/medium/high) and description
- preparationPlan: Structured 7-day preparation roadmap (day 1-7) with title, focus, and daily tasks
`;

  const response = await generateContentWithRetryAndFallback({
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportJsonSchema,
    },
  });

  let rawText = response.text || "";
  const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonMatch) rawText = jsonMatch[1];

  try {
    const parsed = JSON.parse(rawText);
    return validateReportSchema(parsed);
  } catch (err) {
    if (err.status === 502) throw err;
    const parseErr = new Error("Failed to parse AI response into valid JSON.");
    parseErr.status = 502;
    throw parseErr;
  }
}

module.exports = {
  generateInterviewReport,
  generateContentWithRetryAndFallback,
  validateReportSchema,
  interviewReportJsonSchema,
};

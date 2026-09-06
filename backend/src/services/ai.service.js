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

const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

/**
 * Executes a Gemini generation request with model cascading and exponential backoff retry
 * on HTTP 429 (Rate Limit) and 503 (Overloaded) errors.
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
        const isRateLimit = error.status === 429 || error.message?.includes("429");
        const isOverloaded = error.status === 503 || error.message?.includes("503");
        const isModelNotFound = error.status === 404 || error.message?.includes("not found");

        if (isModelNotFound) {
          // Immediately cascade to next candidate model
          console.warn(`[GenAI] Model ${model} not found or unsupported. Falling back to next available model...`);
          break;
        }

        if ((isRateLimit || isOverloaded) && attempt < maxRetries) {
          const waitMs = 1200 * attempt;
          console.warn(`[GenAI] ${model} hit status ${error.status || 'busy'}. Retrying attempt ${attempt}/${maxRetries} after ${waitMs}ms...`);
          await new Promise((res) => setTimeout(res, waitMs));
          continue;
        }

        // On other errors or exhausted retries, break to next model
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
    Generate a comprehensive interview report based on the following inputs:
    
    1. Job Description:
    ${jobDescription}
    
    2. Candidate's Resume:
    ${resume || "(No resume provided)"}
    
    3. Candidate's Self-Description:
    ${selfDescription || "(No self description provided)"}
    
    Please generate the following sections:
    
    A. Title:
    - A short, catchy title for this interview report (e.g., "Software Engineer at Google Interview Prep").
    
    A. Match Score (0-100):
    - Calculate the percentage match between the candidate's resume and the job requirements.
    
    B. Technical Questions:
    - Generate 5-7 technical questions that would be asked in an interview for this role.
    - For each question, provide:
      - The question itself
      - The intention behind asking the question
      - A sample ideal answer
    
    C. Behavioral Questions:
    - Generate 5-7 behavioral questions to assess soft skills and cultural fit.
    - For each question, provide:
      - The question itself
      - The intention behind asking the question
      - A sample ideal answer
    
    D. Skill Gaps:
    - Identify key skill gaps between the candidate's profile and the job requirements.
    - For each gap, provide:
      - Skill name
      - Severity (low, medium, high)
      - Description
    
    E. Preparation Plan:
    - Create a structured 7-day preparation plan.
    - For each day, provide:
      - Day number
      - Focus area
      - Specific tasks to work on
    
    Please format the output as a JSON object with the following structure:
    {
      "title": "string (short report title)",
      "matchScore": number,
      "technicalQuestions": [
        {
          "question": "string",
          "intention": "string",
          "answer": "string"
        }
      ],
      "behavioralQuestions": [
        {
          "question": "string",
          "intention": "string",
          "answer": "string"
        }
      ],
      "skillGaps": [
        {
          "skillName": "string",
          "severity": "low | medium | high",
          "description": "string"
        }
      ],
      "preparationPlan": [
        {
          "day": number,
          "title": "string",
          "focus": "string",
          "tasks": ["string"]
        }
      ]
    }
    `;

  const response = await generateContentWithRetryAndFallback({
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportJsonSchema,
    },
  });
  let result = response.text;

  // Fallback extraction if wrapped in codeblocks
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

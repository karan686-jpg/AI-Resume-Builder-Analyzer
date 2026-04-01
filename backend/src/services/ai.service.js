const {GoogleGenAI} =require("@google/genai");

const genAI = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});
const {z} =require("zod");
const {zodToJsonSchema} =require("zod-to-json-schema");

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The percentage match between the candidate's resume and the job requirements"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("The technical question"),
            intention: z.string().describe("The intention behind asking the question"),
            answer: z.string().describe(" How to answer the question, What points to cover ,what is the approach"),
            title: z.string().describe(" The title of the day in the preparation strategy"),
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("The behavioral question"),
            intention: z.string().describe("The intention behind asking the question"),
            answer: z.string().describe(" How to answer the question, What points to cover ,what is the approach")
        }).describe("Behavioral questions")
    ),
    skillGaps: z.array(
        z.object({
            skillName: z.string().describe("The skill name"),
            severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap"),
            description: z.string().describe("The description of the skill gap")
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number().describe(" The day number in the preparation plan starting from 1"),
            focus: z.string().describe(" The main focus of the day in the preparation strategy"),
            tasks: z.array(z.string()).describe(" The tasks to be completed on the day"),
            title: z.string().describe(" The title of the day in the preparation strategy"),
        })
    )
});

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
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

    
    const response = await genAI.models.generateContent({
          model:"gemini-2.0-flash",
          contents: prompt,
        config:{
            responseMimeType:"application/json"
        }
        });
        let result = response.text;
        
        // Sometimes the AI wraps the JSON in markdown code blocks
        // Extract the content between the backticks if present
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (jsonMatch) {
            result = jsonMatch[1];
        }
        
        try {
            return JSON.parse(result);
        } catch (err) {
            console.error("AI JSON Parse Error:", err);
            // Throw a specific error we can catch in the controller
            const error = new Error("Failed to parse AI response into valid JSON.");
            error.status = 502; // Bad Gateway / Bad Response from upstream
            throw error;
        }
    }


module.exports = {
    generateInterviewReport
}; 
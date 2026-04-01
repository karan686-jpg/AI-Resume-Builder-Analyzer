const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Endpoint: /api/ai/enhance-summary
const enhanceSummary = async (req, res) => {
  try {
    const { draftSummary } = req.body;

    if (!draftSummary) {
      return res.status(400).json({ error: "draftSummary is required." });
    }

    const prompt = `
      You are an expert resume writer and career coach. 
      Please take the following draft professional summary and rewrite it into a powerful, ATS-friendly, 2-sentence version that highlights the candidate's value.
      
      Draft Summary:
      ${draftSummary}

      Return ONLY the final 2-sentence summary without any extra conversational text.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const enhancedSummary = response.text.trim();

    res.status(200).json({ success: true, enhancedSummary });
  } catch (error) {
    console.error("Enhance Summary Error:", error);
    if (error.status === 429) {
      return res.status(429).json({ error: "Gemini API Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ error: "Failed to enhance summary." });
  }
};

// Endpoint: /api/ai/enhance-experience
const enhanceExperience = async (req, res) => {
  try {
    const { draftDescription, jobTitle, companyName } = req.body;

    if (!draftDescription || !jobTitle || !companyName) {
      return res.status(400).json({ 
        error: "draftDescription, jobTitle, and companyName are required." 
      });
    }

    const prompt = `
      You are an expert resume writer. Please improve the following draft job description for a ${jobTitle} at ${companyName}.
      
      Draft Description:
      ${draftDescription}
      
      Rewrite it into a highly professional, strong, bulleted description using powerful action verbs focusing on achievements and impact. 
      Limit to 3-5 concise bullet points. Make it ATS-friendly.
      Return ONLY the bullet points (use standard bullet characters or markdown hyphens). Do not include extra conversational text.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const enhancedDescription = response.text.trim();

    res.status(200).json({ success: true, enhancedDescription });
  } catch (error) {
    console.error("Enhance Experience Error:", error);
    if (error.status === 429) {
      return res.status(429).json({ error: "Gemini API Rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ error: "Failed to enhance experience." });
  }
};

module.exports = {
  enhanceSummary,
  enhanceExperience
};

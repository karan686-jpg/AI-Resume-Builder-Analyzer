require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function test() {
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: "Hello",
    });
    console.log("Response with gemini-1.5-flash:", response.text);
  } catch(error) {
    console.error("Error with 1.5-flash:", error.status, error.message);
  }

  try {
    const response2 = await genAI.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: "Hello",
    });
    console.log("Response with gemini-2.0-flash:", response2.text);
  } catch(error) {
    console.error("Error with 2.0-flash:", error.status, error.message);
    if(error.response) console.error("Response:", await error.response.json());
  }
}

test();

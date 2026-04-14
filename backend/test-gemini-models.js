require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function test() {
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const modelsToTest = [
    "gemini-2.0-flash",
    "gemini-1.5-flash", 
    "gemini-1.5-pro"
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: ${model}...`);
      const response = await genAI.models.generateContent({
        model: model,
        contents: "Hello",
      });
      console.log(`SUCCESS with ${model}: ${response.text}`);
    } catch(error) {
      console.log(`ERROR with ${model}: status=${error.status}`);
      if (error.response) {
        try {
          const r = await error.response.json();
          console.log(`DETAILS: ${JSON.stringify(r.error.message)}`);
        } catch(e) {
          console.log(`DETAILS: ${error.message}`);
        }
      } else {
        console.log(`DETAILS: ${error.message}`);
      }
    }
    console.log("-------------------------------------------------");
  }
}

test();

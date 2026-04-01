/**
 * Example Integration: Mapping CV Parser Output to the new Resume Schema
 * 
 * Let's assume you have a parsedCV object output from your existing logic (e.g., pdf-parse, OpenAI, or Gemini parser):
 * 
 * const parsedCV = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   phone: "123-456-7890",
 *   skills: ["React", "Express", "Node.js"],
 *   summary: "A passionate backend developer...",
 *   experience: [
 *     { company: "Tech Corp", jobTitle: "Backend Dev", duration: "Jan 2020 - Jan 2023", duties: "Built APIs" }
 *   ],
 *   education: [
 *     { school: "University X", degree: "B.S. CS", dates: "2016-2020" }
 *   ]
 * };
 * 
 * You can map this output directly when creating a new Resume document:
 */

const Resume = require("./models/resume.model");

async function createResumeFromCV(userId, parsedCV) {
  try {
    const newResumeData = {
      userId: userId,
      title: `${parsedCV.name || 'Candidate'}'s Generated Resume`,
      themeColor: "#2563EB", // Blue default
      activeTemplate: "modern",

      // Spread personal info
      personalInfo: {
        name: parsedCV.name || "",
        email: parsedCV.email || "",
        phone: parsedCV.phone || "",
        linkedIn: parsedCV.linkedIn || "", // If available
        imageUrl: "" // Set later via ImageKit if needed
      },

      professionalSummary: parsedCV.summary || "",

      // Map experience
      experience: (parsedCV.experience || []).map(exp => ({
        company: exp.company || "Unknown Company",
        role: exp.jobTitle || "Unknown Role",
        dates: exp.duration || "Present",
        description: exp.duties || ""
      })),

      // Map education
      education: (parsedCV.education || []).map(edu => ({
        institution: edu.school || "Unknown Institution",
        degree: edu.degree || "Degree",
        dates: edu.dates || "Present",
        fieldOfStudy: edu.fieldOfStudy || ""
      })),

      // Store skills
      skills: parsedCV.skills || []
    };

    // Save to the database
    const newResume = new Resume(newResumeData);
    await newResume.save();

    return newResume;
  } catch (error) {
    console.error("Error creating resume from CV:", error);
    throw error;
  }
}

module.exports = {
  createResumeFromCV
};

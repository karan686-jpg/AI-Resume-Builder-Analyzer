const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Resume"
  },
  themeColor: {
    type: String,
    default: "#000000"
  },
  activeTemplate: {
    type: String,
    default: "classic"
  },
  personalInfo: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
  },
  professionalSummary: {
    type: String,
    default: ""
  },
  experience: [{
    company: { type: String, required: true },
    role: { type: String, required: true },
    dates: { type: String, required: true },
    description: { type: String, default: "" }
  }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    dates: { type: String, required: true },
    fieldOfStudy: { type: String, default: "" }
  }],
  skills: [{
    type: String
  }]
}, {
  timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;

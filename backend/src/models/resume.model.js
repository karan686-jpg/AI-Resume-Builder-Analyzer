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
    default: "#2563eb"
  },
  activeTemplate: {
    type: String,
    default: "modern"
  },
  personalInfo: {
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
  },
  professionalSummary: {
    type: String,
    default: ""
  },
  experience: [{
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    dates: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  education: [{
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    dates: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" }
  }],
  skills: [{
    type: String
  }],
  customSections: [{
    id: { type: String },
    title: { type: String, default: "Projects" },
    items: [{
      id: { type: String },
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      dates: { type: String, default: "" },
      link: { type: String, default: "" },
      description: { type: String, default: "" }
    }]
  }]
}, {
  timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;

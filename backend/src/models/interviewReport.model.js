const mongoose = require("mongoose");

const qaItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"]
  },
  intention: {
    type: String,
    required: [true, "Intention is required"]
  },
  answer: {
    type: String,
    required: [true, "Answer is required"]
  }
}, {
  _id: false
});

const skillGapsSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: [true, "Skill name is required"]
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: [true, "Severity is required"]
  },
  description: {
    type: String,
    default: ""
  }
}, {
  _id: false
});

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"]
  },
  focus: {
    type: String,
    required: [true, "Focus is required"]
  },
  tasks: {
    type: [String],
    required: [true, "Tasks are required"]
  },
  title: {
    type: String,
    default: ""
  }
}, {
  _id: false
});

const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    default: ""
  },
  selfDescription: {
    type: String,
    default: ""
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  title: {
    type: String,
    default: "Interview Preparation"
  },
  technicalQuestions: [qaItemSchema],
  behavioralQuestions: [qaItemSchema],
  skillGaps: [skillGapsSchema],
  preparationPlan: [preparationPlanSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Index for rapid user-scoped report listing sorted by date
interviewReportSchema.index({ user: 1, createdAt: -1 });

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);
module.exports = interviewReportModel;


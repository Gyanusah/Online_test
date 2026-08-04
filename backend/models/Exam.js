const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
      required: true,
      comment: "Duration in minutes",
    },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "auto_submitted", "terminated"],
      default: "in_progress",
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: {
          type: Boolean,
          default: false,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number,
          default: 0,
          comment: "Time in seconds",
        },
      },
    ],
    objectiveScore: {
      type: Number,
      default: 0,
    },
    subjectiveScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewComments: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
    },
    autoSubmitReason: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
    browserInfo: {
      type: String,
      default: "",
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Exam", examSchema);

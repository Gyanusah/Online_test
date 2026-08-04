const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: false,
    },
    type: {
      type: String,
      enum: ["mcq", "listening", "speaking", "writing"],
      required: true,
    },
    language: {
      type: String,
      default: "",
    },
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        text: String,
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
    },
    marks: {
      type: Number,
      required: true,
      default: 1,
    },
    order: {
      type: Number,
      required: true,
    },
    // For listening questions
    audioFile: {
      type: String,
      default: "",
    },
    audioDuration: {
      type: Number,
      default: 0,
    },
    // For image-based questions
    image: {
      type: String,
      default: "",
    },
    // For reading comprehension
    passage: {
      type: String,
      default: "",
    },
    // For fill in blanks
    blanks: [
      {
        answer: String,
        caseSensitive: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // For matching questions
    matchingPairs: [
      {
        left: String,
        right: String,
      },
    ],
    explanation: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Question", questionSchema);

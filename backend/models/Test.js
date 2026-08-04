const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // language: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Language",
    //   required: true,
    // },
    language: {
      type: String,
    },
    level: {
      type: String,
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    duration: {
      type: Number,
      required: true,
      comment: "Duration in minutes",
    },
    instructor: {
      type: String,
      default: "",
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 0,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    instructions: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
    maxAttempts: {
      type: Number,
      default: 1,
    },
    fee: {
      type: Number,
      default: 0,
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
    pdfMaterial: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Test", testSchema);

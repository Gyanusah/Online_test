const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    name: {
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
    levels: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "1 Month",
    },
    instituteName: {
      type: String,
      default: "Language Institute",
      trim: true,
    },
    subscriptionAmount: {
      type: Number,
      default: 800,
      min: 600,
      max: 800,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Language", languageSchema);

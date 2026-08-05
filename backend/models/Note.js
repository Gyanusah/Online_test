const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true }, // relative URL to serve the file
    languageId: { type: String },
    languageName: { type: String },
    instituteId: { type: String },
    immutable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Note", NoteSchema);

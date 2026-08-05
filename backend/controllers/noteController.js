const path = require("path");
const fs = require("fs");
const Note = require("../models/Note");

// POST /api/notes - upload a PDF note
exports.createNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "PDF file is required" });
    }

    // validate it's a PDF
    const mime = req.file.mimetype || "";
    if (
      !mime.includes("pdf") &&
      !req.file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      // remove uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
      return res
        .status(400)
        .json({ success: false, message: "Only PDF files are allowed" });
    }

    const relPath = `/uploads/notes/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get("host")}${relPath}`;

    const note = await Note.create({
      title: req.body.title || req.file.originalname,
      fileName: req.file.originalname,
      filePath: fullUrl,
      languageId: req.body.languageId || req.body.language || null,
      languageName: req.body.languageName || req.body.languageName || null,
      instituteId: req.body.instituteId || null,
      immutable: true,
    });

    res.json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

// GET /api/notes - list notes (optional query: languageId, instituteId)
exports.listNotes = async (req, res, next) => {
  try {
    const q = {};
    if (req.query.languageId) q.languageId = req.query.languageId;
    if (req.query.instituteId) q.instituteId = req.query.instituteId;

    const notes = await Note.find(q).sort({ createdAt: -1 }).lean();

    // ensure filePath is absolute URL (for older records it may be stored as relative)
    const mapped = notes.map((n) => {
      if (!n.filePath) return n;
      if (typeof n.filePath === "string" && n.filePath.startsWith("/")) {
        return {
          ...n,
          filePath: `${req.protocol}://${req.get("host")}${n.filePath}`,
        };
      }
      return n;
    });

    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
};

// GET /api/notes/:id - get single note metadata
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).lean();
    if (!note)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    res.json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

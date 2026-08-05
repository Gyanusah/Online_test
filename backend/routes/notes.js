const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const noteController = require("../controllers/noteController");

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads", "notes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// POST upload
router.post("/", upload.single("file"), noteController.createNote);

// GET list
router.get("/", noteController.listNotes);

// GET single
router.get("/:id", noteController.getNote);

module.exports = router;

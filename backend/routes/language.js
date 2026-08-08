const express = require("express");

const {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
} = require("../controllers/languageController");

const router = express.Router();

// Create
router.post("/", createLanguage);

// Get all
router.get("/", getAllLanguages);

// Get one
router.get("/:id", getLanguageById);

// Update
router.put("/:id", updateLanguage);

// Delete
router.delete("/:id", deleteLanguage);

module.exports = router;

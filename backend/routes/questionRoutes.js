const express = require("express");
const router = express.Router();

const {
  createQuestion,
  createBulkQuestions,
  getAllQuestions,
  getQuestionsByTest,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

// Create Single Question
router.post("/", createQuestion);

// Create Bulk Questions
router.post("/bulk", createBulkQuestions);

// Get All Questions
router.get("/", getAllQuestions);

// Get Questions By Test
router.get("/test/:testId", getQuestionsByTest);

// Get Question By ID
router.get("/:id", getQuestionById);

// Update Question
router.put("/:id", updateQuestion);

// Delete Question
router.delete("/:id", deleteQuestion);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createTest,
  getAllTests,
  getTestDetails,
  getTestById,
  getAllLanguages,
  getLanguageById,
  updateTest,
  deleteTest,
} = require("../controllers/testController");

// Public routes
router.post("/", createTest);
router.get("/", getAllTests);
router.get("/languages/all", getAllLanguages);
router.get("/languages/:id", getLanguageById);
router.get("/:id", getTestDetails);

router.put("/:id", updateTest);

router.delete("/:id", deleteTest);

module.exports = router;

const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  applyForTest,
  getApplicationById,
  cancelApplication,
} = require("../controllers/applicationController");

// Application routes
router.post("/apply", auth, applyForTest);
router.get("/:id", auth, getApplicationById);
router.patch("/:id/cancel", auth, cancelApplication);

module.exports = router;

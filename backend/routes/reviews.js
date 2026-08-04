const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Review = require("../models/Review");

// @route   GET /api/reviews
// @desc    Get all reviews for an institute
// @access  Private (Institute only)
router.get("/", auth, authorize("institute"), async (req, res) => {
  try {
    const reviews = await Review.find({
      institute: req.user._id,
      isApproved: true,
    })
      .populate("student", "firstName lastName email")
      .populate("test", "title code")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/reviews/test/:testId
// @desc    Get reviews for a specific test
// @access  Private
router.get("/test/:testId", auth, async (req, res) => {
  try {
    const reviews = await Review.find({
      test: req.params.testId,
      isApproved: true,
    })
      .populate("student", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Student only)
router.post("/", auth, authorize("student"), async (req, res) => {
  try {
    const { testId, rating, comment } = req.body;

    if (!testId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Test ID, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if student already reviewed this test
    const existingReview = await Review.findOne({
      student: req.user._id,
      test: testId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this test",
      });
    }

    const Test = require("../models/Test");
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const review = await Review.create({
      student: req.user._id,
      test: testId,
      institute: test.institute,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("student", "firstName lastName email")
      .populate("test", "title code");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: { review: populatedReview },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve or disapprove a review
// @access  Private (Institute only)
router.put("/:id/approve", auth, authorize("institute"), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.institute.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    review.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : true;
    await review.save();

    res.json({
      success: true,
      message: "Review updated successfully",
      data: { review },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Institute only)
router.delete("/:id", auth, authorize("institute"), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.institute.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;

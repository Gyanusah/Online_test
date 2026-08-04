const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");
const User = require("../models/User");
const Test = require("../models/Test");
const Application = require("../models/Application");
const Exam = require("../models/Exam");
const Review = require("../models/Review");

// @route   GET /api/institutes/students
// @desc    Get all students for an institute
// @access  Private (Institute only)
router.get("/students", auth, authorize("institute"), async (req, res) => {
  try {
    const studentFilter = {
      role: "student",
      $or: [{ institute: req.user._id }],
    };

    if (req.user.instituteName) {
      studentFilter.$or.push({ instituteName: req.user.instituteName });
    }

    const students = await User.find(studentFilter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { students },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/institutes/stats
// @desc    Get institute statistics
// @access  Private (Institute only)
router.get("/stats", auth, authorize("institute"), async (req, res) => {
  try {
    const studentFilter = {
      role: "student",
      $or: [{ institute: req.user._id }],
    };

    if (req.user.instituteName) {
      studentFilter.$or.push({ instituteName: req.user.instituteName });
    }

    const totalStudents = await User.countDocuments(studentFilter);
    const activeStudents = await User.countDocuments({
      ...studentFilter,
      isActive: true,
    });
    const totalTests = await Test.countDocuments({ institute: req.user._id });
    const pendingApplications = await Application.countDocuments({
      institute: req.user._id,
      status: "pending",
    });

    const Question = require("../models/Question");
    const totalQuestions = await Question.countDocuments({ institute: req.user._id });

    const pendingReviews = await Review.countDocuments({
      institute: req.user._id,
      isApproved: false,
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        totalTests,
        pendingApplications,
        totalQuestions,
        pendingReviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/institutes/analytics
// @desc    Get detailed analytics for institute
// @access  Private (Institute only)
router.get("/analytics", auth, authorize("institute"), async (req, res) => {
  try {
    const { timeRange = "30d" } = req.query;
    
    const daysMap = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
    const days = daysMap[timeRange] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const studentFilter = {
      role: "student",
      $or: [{ institute: req.user._id }],
    };

    if (req.user.instituteName) {
      studentFilter.$or.push({ instituteName: req.user.instituteName });
    }

    // Get exam statistics
    const exams = await Exam.find({
      student: { $in: await User.find(studentFilter).select("_id") },
      submittedAt: { $gte: startDate },
    }).populate("test");

    const totalExams = exams.length;
    const averageScore = exams.length > 0 
      ? exams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / exams.length 
      : 0;
    
    const passedExams = exams.filter(exam => exam.passed).length;
    const passRate = totalExams > 0 ? (passedExams / totalExams) * 100 : 0;

    // Get review statistics
    const reviews = await Review.find({
      institute: req.user._id,
      createdAt: { $gte: startDate },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    // Get course performance
    const courses = await Test.find({ institute: req.user._id });
    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        const courseExams = await Exam.find({
          test: course._id,
          submittedAt: { $gte: startDate },
        });
        const courseAvgScore = courseExams.length > 0
          ? courseExams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / courseExams.length
          : 0;
        return {
          title: course.title,
          averageScore: Math.round(courseAvgScore),
          examCount: courseExams.length,
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalExams,
        averageScore: Math.round(averageScore),
        passRate: Math.round(passRate),
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        coursePerformance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/institutes/recent-enrollments
// @desc    Get recent student enrollments
// @access  Private (Institute only)
router.get("/recent-enrollments", auth, authorize("institute"), async (req, res) => {
  try {
    const studentFilter = {
      role: "student",
      $or: [{ institute: req.user._id }],
    };

    if (req.user.instituteName) {
      studentFilter.$or.push({ instituteName: req.user.instituteName });
    }

    const recentStudents = await User.find(studentFilter)
      .select("firstName lastName createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const enrollments = recentStudents.map((student) => ({
      studentName: `${student.firstName} ${student.lastName}`,
      enrolledAt: student.createdAt,
      timeAgo: getTimeAgo(student.createdAt),
    }));

    res.json({
      success: true,
      data: { enrollments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/institutes/popular-courses
// @desc    Get popular courses by enrollment count
// @access  Private (Institute only)
router.get("/popular-courses", auth, authorize("institute"), async (req, res) => {
  try {
    const courses = await Test.find({ institute: req.user._id })
      .select("title")
      .sort({ createdAt: -1 })
      .limit(5);

    const popularCourses = await Promise.all(
      courses.map(async (course) => {
        const examCount = await Exam.countDocuments({
          test: course._id,
          status: { $in: ["submitted", "auto_submitted"] },
        });

        return {
          title: course.title,
          studentCount: examCount,
        };
      })
    );

    // Sort by student count
    popularCourses.sort((a, b) => b.studentCount - a.studentCount);

    res.json({
      success: true,
      data: { popularCourses },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Helper function to get time ago string
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return "Just now";
}

// @route   GET /api/institutes/courses
// @desc    Get all courses (tests) for institute
// @access  Private (Institute only)
router.get("/courses", auth, authorize("institute"), async (req, res) => {
  try {
    const courses = await Test.find({ institute: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: { courses },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/institutes/courses
// @desc    Create a new course (test)
// @access  Private (Institute only)
router.post(
  "/courses",
  auth,
  authorize("institute"),
  uploadSingle("courseMaterial"),
  async (req, res) => {
    try {
      const courseData = {
        ...req.body,
        institute: req.user._id,
        title: req.body.title,
        level: req.body.level || "Beginner",
        totalQuestions: Number(req.body.totalQuestions) || 0,
        totalMarks: Number(req.body.totalMarks) || 0,
        passingMarks: Number(req.body.passingMarks) || 0,
        code:
          req.body.code ||
          `${req.body.title
            ?.trim()
            .toUpperCase()
            .replace(/\s+/g, "-")
            .slice(0, 10)}-${Date.now().toString().slice(-4)}`,
        duration: Number(req.body.duration) || 0,
        startDate: req.body.startDate
          ? new Date(req.body.startDate)
          : new Date(),
        endDate: req.body.endDate
          ? new Date(req.body.endDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isPublished:
          req.body.isPublished !== undefined ? req.body.isPublished : true,
        requiresApproval:
          req.body.requiresApproval !== undefined
            ? req.body.requiresApproval
            : true,
      };

      if (req.file) {
        courseData.pdfMaterial = `materials/${req.file.filename}`;
      }

      const course = await Test.create(courseData);

      res.json({
        success: true,
        message: "Course created successfully",
        data: { course },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @route   PUT /api/institutes/courses/:id
// @desc    Update a course
// @access  Private (Institute only)
router.put(
  "/courses/:id",
  auth,
  authorize("institute"),
  uploadSingle("courseMaterial"),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        instructor: req.body.instructor || undefined,
        tags: req.body.tags
          ? Array.isArray(req.body.tags)
            ? req.body.tags
            : [req.body.tags]
          : undefined,
      };

      if (req.file) {
        updateData.pdfMaterial = `materials/${req.file.filename}`;
      }

      const course = await Test.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      res.json({
        success: true,
        message: "Course updated successfully",
        data: { course },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @route   DELETE /api/institutes/courses/:id
// @desc    Delete a course
// @access  Private (Institute only)
router.delete(
  "/courses/:id",
  auth,
  authorize("institute"),
  async (req, res) => {
    try {
      const course = await Test.findByIdAndDelete(req.params.id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      res.json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @route   GET /api/institutes/applications
// @desc    Get all applications for institute
// @access  Private (Institute only)
router.get("/applications", auth, authorize("institute"), async (req, res) => {
  try {
    const applications = await Application.find({ institute: req.user._id })
      .populate("student", "firstName lastName email")
      .populate("test", "title code")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { applications },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/institutes/applications/:id
// @desc    Update application status
// @access  Private (Institute only)
router.put(
  "/applications/:id",
  auth,
  authorize("institute"),
  async (req, res) => {
    try {
      const application = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      res.json({
        success: true,
        message: "Application updated successfully",
        data: { application },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

module.exports = router;

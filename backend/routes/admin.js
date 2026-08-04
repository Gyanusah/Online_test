const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const User = require("../models/User");
const Test = require("../models/Test");
const Application = require("../models/Application");
const Exam = require("../models/Exam");
const Language = require("../models/Language");

const getLanguageSubscriptionAmount = async (languageValue) => {
  if (!languageValue) return null;

  const normalizedLanguage = String(languageValue).trim();
  if (!normalizedLanguage) return null;

  const escaped = normalizedLanguage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const language = await Language.findOne({
    $or: [
      { name: new RegExp(`^${escaped}$`, "i") },
      { code: new RegExp(`^${escaped}$`, "i") },
    ],
  });

  if (!language) return null;

  const amount = Number(language.subscriptionAmount);
  return Number.isFinite(amount) ? amount : null;
};

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get("/users", auth, authorize("admin"), async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = role ? { role } : {};
    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
        },
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

// @route   GET /api/admin/institutes
// @desc    Get all institutes
// @access  Private (Admin only)
router.get("/institutes", auth, authorize("admin"), async (req, res) => {
  try {
    const institutes = await User.find({ role: "institute" })
      .select("-password")
      .sort({ createdAt: -1 });

    const enrichedInstitutes = await Promise.all(
      institutes.map(async (institute) => {
        const studentFilter = {
          role: "student",
          $or: [{ institute: institute._id }],
        };

        if (institute.instituteName) {
          studentFilter.$or.push({ instituteName: institute.instituteName });
        }

        const students = await User.countDocuments(studentFilter);
        const studentDetails = await User.find(studentFilter)
          .select(
            "firstName lastName email phone studentId preferredLanguage subscriptionStatus createdAt",
          )
          .sort({ createdAt: -1 });
        const courses = await Test.countDocuments({ institute: institute._id });
        const testDocs = await Test.find({ institute: institute._id })
          .populate("language", "name code")
          .select("language");
        const languages = Array.from(
          new Map(
            testDocs
              .filter((test) => test.language)
              .map((test) => {
                const languageData =
                  typeof test.language === "object"
                    ? test.language
                    : { name: test.language, code: test.language };
                const key =
                  languageData.code ||
                  languageData.name ||
                  String(test.language);

                return [
                  key,
                  {
                    name: languageData.name || key,
                    code: languageData.code || key,
                  },
                ];
              }),
          ).values(),
        );

        return {
          ...institute.toObject(),
          students,
          courses,
          studentDetails,
          languages,
        };
      }),
    );

    res.json({
      success: true,
      data: { institutes: enrichedInstitutes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/admin/subscriptions
// @desc    Get subscription requests for students
// @access  Private (Admin only)
router.get("/subscriptions", auth, authorize("admin"), async (req, res) => {
  try {
    const { status = "pending" } = req.query;
    const query = { role: "student" };

    if (status && status !== "all") {
      query.subscriptionStatus = status;
    }

    const students = await User.find(query)
      .select("-password")
      .populate("institute", "instituteName")
      .sort({ subscriptionRequestedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      data: { subscriptions: students },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/admin/languages
// @desc    Get language subscription prices
// @access  Private (Admin only)
router.get("/languages", auth, authorize("admin"), async (req, res) => {
  try {
    const languages = await Language.find().sort({ name: 1 });

    res.json({
      success: true,
      data: { languages },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/admin/languages/:id
// @desc    Update the one-month subscription amount for a language
// @access  Private (Admin only)
router.put("/languages/:id", auth, authorize("admin"), async (req, res) => {
  try {
    const { subscriptionAmount } = req.body;
    const normalizedAmount = Number(subscriptionAmount);

    if (
      !Number.isFinite(normalizedAmount) ||
      normalizedAmount < 600 ||
      normalizedAmount > 800
    ) {
      return res.status(400).json({
        success: false,
        message: "Subscription amount must be between 600 and 800",
      });
    }

    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    language.subscriptionAmount = normalizedAmount;
    await language.save();

    res.json({
      success: true,
      message: "Language subscription amount updated successfully",
      data: { language },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin only)
router.put("/users/:id/status", auth, authorize("admin"), async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User status updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/admin/institutes/:id/verify
// @desc    Verify institute
// @access  Private (Admin only)
router.put(
  "/subscriptions/:id/approve",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const { action = "approve", amount, notes } = req.body;
      const student = await User.findById(req.params.id);

      if (!student || student.role !== "student") {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      const normalizedAmount = Number(amount);
      const configuredAmount =
        normalizedAmount ||
        (await getLanguageSubscriptionAmount(student.preferredLanguage)) ||
        student.subscriptionAmount ||
        800;

      if (action === "approve") {
        if (configuredAmount < 600 || configuredAmount > 800) {
          return res.status(400).json({
            success: false,
            message: "Subscription amount must be between 600 and 800",
          });
        }
      }

      const update = {
        subscriptionApprovedBy: req.user._id,
        subscriptionApprovedAt: new Date(),
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subscriptionStatus: action === "approve" ? "active" : "cancelled",
        subscriptionAmount:
          action === "approve"
            ? configuredAmount
            : student.subscriptionAmount || configuredAmount,
      };

      if (action !== "approve") {
        update.subscriptionApprovedAt = null;
        update.subscriptionApprovedBy = null;
        update.subscriptionExpiresAt = null;
      }

      if (notes) {
        update.notes = notes;
      }

      const updatedStudent = await User.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
        },
      ).select("-password");

      res.json({
        success: true,
        message:
          action === "approve"
            ? "Subscription approved successfully"
            : "Subscription rejected successfully",
        data: { user: updatedStudent },
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

router.put(
  "/institutes/:id/verify",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const institute = await User.findByIdAndUpdate(
        req.params.id,
        { isVerified: true },
        { new: true },
      ).select("-password");

      if (!institute) {
        return res.status(404).json({
          success: false,
          message: "Institute not found",
        });
      }

      res.json({
        success: true,
        message: "Institute verified successfully",
        data: { institute },
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

router.put(
  "/institutes/:id/status",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const { isVerified } = req.body;
      const institute = await User.findByIdAndUpdate(
        req.params.id,
        { isVerified: Boolean(isVerified) },
        { new: true },
      ).select("-password");

      if (!institute) {
        return res.status(404).json({
          success: false,
          message: "Institute not found",
        });
      }

      res.json({
        success: true,
        message: "Institute status updated successfully",
        data: { institute },
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

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete("/users/:id", auth, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get admin analytics
// @access  Private (Admin only)
router.get("/analytics", auth, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInstitutes = await User.countDocuments({ role: "institute" });
    const totalStudents = await User.countDocuments({ role: "student" });
    let totalTeachers = await User.countDocuments({ role: "teacher" });
    if (!totalTeachers) {
      totalTeachers = totalInstitutes;
    }
    const totalTests = await Test.countDocuments();
    const totalApplications = await Application.countDocuments();
    const completedExams = await Exam.countDocuments({
      status: { $in: ["submitted", "auto_submitted", "terminated"] },
    });
    const pendingSubscriptions = await User.countDocuments({
      role: "student",
      subscriptionStatus: "pending",
    });
    const activeSubscriptions = await User.countDocuments({
      role: "student",
      subscriptionStatus: "active",
    });
    const paidSubscriptions = await User.countDocuments({
      role: "student",
      lastTransactionId: { $exists: true, $ne: "" },
    });
    const revenueRecords = await User.find({
      role: "student",
      lastPaymentAt: { $exists: true },
    })
      .select(
        "firstName lastName phone institute instituteName subscriptionAmount lastTransactionId lastPaymentAt",
      )
      .populate("institute", "instituteName")
      .sort({ lastPaymentAt: -1 });
    const totalRevenue = revenueRecords.reduce(
      (sum, record) => sum + Number(record.subscriptionAmount || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        totalInstitutes,
        totalStudents,
        totalTeachers,
        totalTests,
        totalApplications,
        completedExams,
        pendingSubscriptions,
        activeSubscriptions,
        paidSubscriptions,
        totalRevenue,
        revenueRecords,
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

// @route   GET /api/admin/reports
// @desc    Get admin reports
// @access  Private (Admin only)
router.get("/reports", auth, authorize("admin"), async (req, res) => {
  try {
    // For now, return empty array
    // In production, this would fetch reports from database
    res.json({
      success: true,
      data: { reports: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/admin/reports
// @desc    Generate a report
// @access  Private (Admin only)
router.post("/reports", auth, authorize("admin"), async (req, res) => {
  try {
    // For now, just return success
    // In production, this would generate and save a report
    res.json({
      success: true,
      message: "Report generated successfully",
      data: { report: req.body },
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

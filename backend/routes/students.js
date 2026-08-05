const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const {
  requireActiveSubscription,
  getActiveSubscriptions,
} = require("../middleware/subscription");
const User = require("../models/User");
const Test = require("../models/Test");
const Application = require("../models/Application");
const Exam = require("../models/Exam");
const Notification = require("../models/Notification");
const Language = require("../models/Language");
const { buildEsewaCheckoutUrl } = require("../utils/esewa");

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

const verifyEsewaPayment = (transactionId, amount) => {
  // Returns an object { success: boolean, message: string }
  return new Promise((resolve) => {
    const merchantCode = process.env.ESEWA_MERCHANT_CODE;
    const mode = process.env.ESEWA_MODE || "sandbox";
    const esewaUrl =
      mode === "production"
        ? "https://esewa.com.np/epay/transrec"
        : "https://uat.esewa.com.np/epay/transrec";

    if (!merchantCode) {
      // Server misconfiguration
      return resolve({ success: false, message: "missing_merchant" });
    }

    const payload = new URLSearchParams({
      amt: amount.toString(),
      psc: "0",
      pdc: "0",
      tAmt: amount.toString(),
      pid: transactionId,
      scd: merchantCode,
    }).toString();

    const url = new URL(esewaUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const isSuccess = /<status>\s*Success\s*<\/status>/i.test(body);
          if (isSuccess) {
            return resolve({ success: true, message: "verified" });
          }
          // Payment not verified
          return resolve({ success: false, message: "not_verified" });
        } catch (e) {
          return resolve({ success: false, message: "parsing_error" });
        }
      });
    });

    req.on("error", () => {
      // Network or upstream error
      return resolve({ success: false, message: "network_error" });
    });
    req.write(payload);
    req.end();
  });
};

// @route   GET /api/students/dashboard
// @desc    Get student dashboard data
// @access  Private (Student only)
router.post(
  "/subscription/request",
  auth,
  authorize("student"),
  async (req, res) => {
    try {
      const {
        referralCode,
        amount,
        language,
        languageId,
        level,
        preferredLanguage,
      } = req.body;
      const student = await User.findById(req.user._id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      let languageDoc = null;
      let chosenLevel = level || "Beginner";
      const requestedLanguageName =
        language || preferredLanguage || student.preferredLanguage;

      if (languageId && mongoose.Types.ObjectId.isValid(languageId)) {
        languageDoc = await Language.findById(languageId);
      }

      if (!languageDoc && requestedLanguageName) {
        const escaped = String(requestedLanguageName)
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        languageDoc = await Language.findOne({
          $or: [
            { name: new RegExp(`^${escaped}$`, "i") },
            { code: new RegExp(`^${escaped}$`, "i") },
          ],
        });
      }

      if (!languageDoc) {
        return res.status(400).json({
          success: false,
          message:
            "A supported language is required for subscription. Please choose a valid language.",
        });
      }

      const configuredAmount = await getLanguageSubscriptionAmount(
        languageDoc.name,
      );

      let effectiveAmount = configuredAmount || Number(amount) || 800;
      if (effectiveAmount < 600) {
        effectiveAmount = 600;
      }
      if (effectiveAmount > 800) {
        effectiveAmount = 800;
      }

      let referralDiscount = 0;
      let referrer = null;

      if (
        languageDoc &&
        Array.isArray(languageDoc.levels) &&
        languageDoc.levels.length > 0
      ) {
        chosenLevel = chosenLevel || languageDoc.levels[0];
      }

      if (referralCode) {
        referrer = await User.findOne({ referralCode, role: "student" });
        if (!referrer || referrer._id.toString() === student._id.toString()) {
          return res.status(400).json({
            success: false,
            message: "Invalid referral code",
          });
        }

        if (referrer.subscriptionStatus !== "active") {
          return res.status(400).json({
            success: false,
            message:
              "The referral code belongs to a student without an active subscription",
          });
        }

        referralDiscount = 100;
        if (effectiveAmount - referralDiscount < 600) {
          effectiveAmount = 600;
        } else {
          effectiveAmount -= referralDiscount;
        }
      }

      student.subscriptionStatus = "pending";
      student.subscriptionAmount = effectiveAmount;
      student.subscriptionRequestedAt = new Date();
      student.subscriptionApprovedAt = null;
      student.subscriptionApprovedBy = null;
      student.subscriptionExpiresAt = null;
      student.referralDiscountAmount = referralDiscount;
      student.referredBy = referrer ? referrer._id : null;
      student.preferredLanguage = languageDoc.name;
      student.pendingSubscription = {
        language: languageDoc._id,
        languageName: languageDoc.name,
        level: chosenLevel,
        amount: effectiveAmount,
        requestedAt: new Date(),
      };

      await student.save();

      res.json({
        success: true,
        message: "Subscription request submitted successfully",
        data: {
          user: student,
          amount: effectiveAmount,
          referralDiscount,
        },
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

router.post(
  "/subscription/pay",
  auth,
  authorize("student"),
  async (req, res) => {
    try {
      const { transactionId, paymentMethod } = req.body;
      const student = await User.findById(req.user._id);

      if (!student || student.role !== "student") {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      if (!student.subscriptionAmount || student.subscriptionAmount < 600) {
        student.subscriptionAmount = 800;
      }

      if (student.subscriptionStatus !== "pending") {
        return res.status(400).json({
          success: false,
          message: "No pending subscription request to pay for",
        });
      }

      if (!transactionId || typeof transactionId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Transaction ID is required for payment verification",
        });
      }

      if (!paymentMethod || paymentMethod !== "esewa") {
        return res.status(400).json({
          success: false,
          message:
            "Only eSewa payment method is supported for subscription activation",
        });
      }

      const checkoutUrl = buildEsewaCheckoutUrl({
        amount: student.subscriptionAmount || 800,
        transactionId,
        successUrl:
          process.env.ESEWA_SUCCESS_URL ||
          "http://localhost:5173/student/subscription?payment=success",
        failureUrl:
          process.env.ESEWA_FAILURE_URL ||
          "http://localhost:5173/student/subscription?payment=failed",
        merchantCode: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
        mode: process.env.ESEWA_MODE || "sandbox",
      });

      const shouldSkipVerification =
        process.env.ESEWA_SKIP_VERIFICATION === "true" ||
        (process.env.ESEWA_MODE || "sandbox") === "sandbox";

      let paymentResult = { success: true, message: "skipped" };

      if (!shouldSkipVerification) {
        paymentResult = await verifyEsewaPayment(
          transactionId,
          student.subscriptionAmount || 800,
        );
      }

      if (!paymentResult || paymentResult.success === false) {
        switch (paymentResult && paymentResult.message) {
          case "missing_merchant":
            return res.status(500).json({
              success: false,
              message:
                "eSewa configuration missing on server. Please set ESEWA_MERCHANT_CODE in the environment.",
            });
          case "network_error":
            return res.status(502).json({
              success: false,
              message:
                "Unable to reach eSewa for verification (network error). Please try again later.",
            });
          case "parsing_error":
            return res.status(502).json({
              success: false,
              message:
                "Received unexpected response from eSewa. Please contact support.",
            });
          case "not_verified":
          default:
            return res.status(400).json({
              success: false,
              message:
                "eSewa payment verification failed. Make sure the transaction ID and amount match the completed payment.",
            });
        }
      }

      const studentToUpdate = await User.findById(req.user._id);
      const activeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const subscriptionEntry = {
        languageId: studentToUpdate.pendingSubscription?.language || null,
        languageName:
          studentToUpdate.pendingSubscription?.languageName ||
          studentToUpdate.preferredLanguage ||
          "Unknown",
        level: studentToUpdate.pendingSubscription?.level || "Beginner",
        subscribedAt: new Date(),
        expiryDate: activeExpiry,
        status: "active",
      };

      const updatedStudent = await User.findByIdAndUpdate(
        req.user._id,
        {
          subscriptionStatus: "active",
          subscriptionApprovedAt: new Date(),
          subscriptionApprovedBy: null,
          subscriptionExpiresAt: activeExpiry,
          paymentMethod: "esewa",
          lastTransactionId: transactionId,
          lastPaymentAt: new Date(),
          $push: { subscribedLanguages: subscriptionEntry },
          pendingSubscription: {},
        },
        { new: true },
      ).select("-password");

      return res.status(200).json({
        success: true,
        message: "Subscription activated successfully",
        data: {
          checkoutUrl,
          pendingPayment: false,
          paymentConfirmed: true,
          sandboxMode: shouldSkipVerification,
          user: updatedStudent,
        },
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

router.get("/dashboard", auth, authorize("student"), async (req, res) => {
  try {
    const studentId = req.user._id;

    const activeSubscriptions = getActiveSubscriptions(req.user).length;
    const subscriptions = activeSubscriptions;

    const completedExams = await Exam.find({
      student: studentId,
      status: { $in: ["submitted", "auto_submitted", "terminated"] },
    });
    const notificationsCount = await Notification.countDocuments({
      recipient: studentId,
      recipientType: "student",
    });

    res.json({
      success: true,
      data: {
        subscriptions,
        completedExams: completedExams.length,
        notifications: notificationsCount,
        recentActivity: [],
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

// @route   GET /api/students/results
// @desc    Get student's exam results
// @access  Private (Student only)
router.get("/results", auth, authorize("student"), async (req, res) => {
  try {
    const studentId = req.user._id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const exams = await Exam.find({
      student: studentId,
      status: { $in: ["submitted", "auto_submitted", "terminated"] },
      submittedAt: { $gte: sevenDaysAgo },
    })
      .populate(
        "test",
        "title code language level totalMarks passingMarks tags",
      )
      .populate({
        path: "answers.question",
        select: "question type correctAnswer marks options blanks",
      })
      .sort({ submittedAt: -1, createdAt: -1 });

    const preferredLanguage = req.user.preferredLanguage?.trim().toLowerCase();
    const filteredExams = preferredLanguage
      ? exams.filter((exam) => {
          const testLanguage = exam.test?.language?.trim().toLowerCase();
          const testTags = (exam.test?.tags || []).map((tag) =>
            String(tag).trim().toLowerCase(),
          );

          return (
            testLanguage === preferredLanguage ||
            testTags.some((tag) => tag.includes(preferredLanguage))
          );
        })
      : exams;

    const results = filteredExams.map((exam) => {
      const percentage = Number(exam.percentage || 0);
      const totalMarks = exam.test?.totalMarks || 0;
      const passingMarks = exam.test?.passingMarks || 0;
      const passed = Boolean(exam.passed ?? percentage >= passingMarks);

      const answerBreakdown = (exam.answers || []).map((answer) => {
        const question = answer.question || null;
        let selectedAnswerText = answer.answer;
        let correctAnswerText = question?.correctAnswer || null;

        // Convert option IDs to text for MCQ questions
        if (question?.type === "mcq" && question?.options) {
          // Get selected answer text
          if (selectedAnswerText) {
            const selectedOption = question.options.find(
              (opt) => String(opt._id) === String(selectedAnswerText),
            );
            selectedAnswerText = selectedOption?.text || selectedAnswerText;
          }

          // Get correct answer text
          const correctOption = question.options.find((opt) => opt.isCorrect);
          correctAnswerText = correctOption?.text || "Not available";
        } else if (question?.type === "true_false") {
          // Convert boolean to text
          correctAnswerText =
            question.correctAnswer === true ? "True" : "False";
          selectedAnswerText =
            answer.answer === true
              ? "True"
              : answer.answer === false
                ? "False"
                : selectedAnswerText;
        } else if (
          question?.type === "fill_in_blanks" &&
          question?.blanks?.length > 0
        ) {
          // Get correct answer from blanks
          correctAnswerText = question.blanks[0]?.answer || "Not available";
        }

        return {
          id: answer.question?._id || answer.question || null,
          questionText: question?.question || "Question",
          selectedAnswer: selectedAnswerText,
          isCorrect: Boolean(answer.isCorrect),
          marksObtained: Number(answer.marksObtained || 0),
          correctAnswer: correctAnswerText,
          questionType: question?.type || "unknown",
        };
      });

      return {
        ...exam.toObject(),
        percentage,
        totalMarks,
        passingMarks,
        passed,
        score: percentage,
        testTitle: exam.test?.title || "Test",
        answerBreakdown,
      };
    });

    res.json({
      success: true,
      data: { results },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/students/certificates
// @desc    Get student's certificates (placeholder - certificates feature removed)
// @access  Private (Student only)
router.get("/certificates", auth, authorize("student"), async (req, res) => {
  try {
    res.json({
      success: true,
      data: { certificates: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/students/notifications
// @desc    Get student's notifications
// @access  Private (Student only)
router.get("/notifications", auth, authorize("student"), async (req, res) => {
  try {
    const studentId = req.user._id;
    const notifications = await Notification.find({
      recipient: studentId,
      recipientType: "student",
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { notifications },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/students/all-tests
// @desc    Get all available tests for student
// @access  Private (Student only)
router.get("/all-tests", auth, authorize("student"), async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    const activeSubscriptions = (student.subscribedLanguages || []).filter(
      (sub) => sub.status === "active" && new Date(sub.expiryDate) > new Date(),
    );

    const subscribedLanguageNames = activeSubscriptions
      .map((sub) => String(sub.languageName).trim())
      .filter(Boolean);

    if (
      subscribedLanguageNames.length === 0 &&
      student.subscriptionStatus === "active" &&
      student.preferredLanguage
    ) {
      subscribedLanguageNames.push(String(student.preferredLanguage).trim());
    }

    const featuredTests = await Test.find({ isActive: true })
      .populate("institute", "name instituteName")
      .sort({ createdAt: -1 });

    const filteredTests = featuredTests.filter((test) => {
      if (!test.language) return false;
      const testLanguage = String(test.language).trim().toLowerCase();
      return subscribedLanguageNames.some(
        (languageName) =>
          testLanguage === String(languageName).trim().toLowerCase(),
      );
    });

    res.json({
      success: true,
      data: { tests: filteredTests },
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

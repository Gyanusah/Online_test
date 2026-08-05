const mongoose = require("mongoose");
const Exam = require("../models/Exam");
const Test = require("../models/Test");
const Application = require("../models/Application");
const Question = require("../models/Question");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { shouldAllowUnlimitedAttempts } = require("../utils/examAccess");

const startExam = async (req, res) => {
  console.log("=== START EXAM CALLED ===");
  console.log("Request body:", req.body);
  console.log("User:", req.user);

  try {
    const { applicationId, testId } = req.body;
    const resolvedId = applicationId || testId;

    if (!resolvedId) {
      return res.status(400).json({
        success: false,
        message: "Application ID or Test ID is required",
      });
    }

    const isValidId = mongoose.Types.ObjectId.isValid(resolvedId);
    let application = null;

    if (isValidId) {
      application = await Application.findById(resolvedId)
        .populate("test")
        .populate("student");
    }

    if (!application) {
      const query = {
        student: req.user._id,
        status: { $in: ["approved", "pending"] },
      };

      if (isValidId) {
        query.test = resolvedId;
      }

      application = await Application.findOne(query)
        .populate("test")
        .populate("student");
    }

    if (!application) {
      if (!isValidId) {
        return res.status(404).json({
          success: false,
          message: "Test not found",
        });
      }

      const test = await Test.findById(resolvedId);

      if (!test) {
        return res.status(404).json({
          success: false,
          message: "Test not found",
        });
      }

      const existingApplication = await Application.findOne({
        student: req.user._id,
        test: test._id,
      });

      if (existingApplication) {
        application = existingApplication;
      } else {
        const fallbackInstitute =
          test.institute || req.user.institute || req.user._id;

        if (!fallbackInstitute) {
          return res.status(400).json({
            success: false,
            message:
              "This test cannot be started because institute data is missing.",
          });
        }

        application = await Application.create({
          test: test._id,
          student: req.user._id,
          institute: fallbackInstitute,
          status: "approved",
          paymentAmount: test.fee || 0,
          paymentStatus: test.fee > 0 ? "pending" : "completed",
        });
      }

      application = await Application.findById(application._id)
        .populate("test")
        .populate("student");
    }

    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "This test is not approved for your account yet",
      });
    }

    // Verify student
    if (application.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const student = await User.findById(req.user._id);
    const hasActiveSubscription =
      student?.role === "student" &&
      student.subscriptionStatus === "active" &&
      (!student.subscriptionExpiresAt ||
        new Date(student.subscriptionExpiresAt) > new Date());

    if (!hasActiveSubscription) {
      return res.status(403).json({
        success: false,
        message:
          "Subscription is required before starting this test. Please request and wait for admin approval.",
      });
    }

    const activeSubscriptions = (student.subscribedLanguages || [])
      .filter(
        (sub) =>
          sub.status === "active" && new Date(sub.expiryDate) > new Date(),
      )
      .map((sub) =>
        String(sub.languageName || "")
          .trim()
          .toLowerCase(),
      );

    const testLanguage = String(application.test.language || "")
      .trim()
      .toLowerCase();
    if (!activeSubscriptions.includes(testLanguage)) {
      return res.status(403).json({
        success: false,
        message:
          "Your active subscription does not cover this test's language. Please subscribe to the correct language before starting this exam.",
      });
    }

    // Get all questions for the test while using the student's chosen language
    // where possible. Fall back to test-specific questions if no language tag
    // matches are found.
    console.log("Test ID:", application.test._id);
    console.log("Application ID:", application._id);

    const languagePreference =
      application.student.preferredLanguage?.trim() ||
      application.test.language?.trim();

    const escapedLanguagePreference = languagePreference
      ? languagePreference.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      : "";

    // Find all active questions for this test first.
    const testQuestions = await Question.find({
      test: application.test._id,
      isActive: true,
    }).sort({ order: 1 });

    let questions = testQuestions;
    let languageQuestions = [];
    let fallbackQuestions = [];
    let languageGlobalQuestions = [];
    let usedLanguageFilter = false;
    let hasTaggedQuestions = false;
    let hasLanguageField = false;
    let fallbackToFullSet = false;
    let usedGlobalFallback = false;

    const languageTagRegex = languagePreference
      ? new RegExp(escapedLanguagePreference, "i")
      : null;

    if (languagePreference && testQuestions.length > 0) {
      languageQuestions = testQuestions.filter((question) => {
        const tagsMatch =
          Array.isArray(question.tags) &&
          question.tags.some((tag) =>
            String(tag).trim().match(languageTagRegex),
          );

        const languageFieldMatch =
          question.language &&
          String(question.language).trim().match(languageTagRegex);

        return tagsMatch || languageFieldMatch;
      });

      hasTaggedQuestions = testQuestions.some(
        (question) => Array.isArray(question.tags) && question.tags.length > 0,
      );
      hasLanguageField = testQuestions.some(
        (question) =>
          question.language && String(question.language).trim().length,
      );

      if (languageQuestions.length > 0) {
        usedLanguageFilter = true;
        const languageQuestionIds = new Set(
          languageQuestions.map((q) => q._id.toString()),
        );
        questions = [
          ...languageQuestions,
          ...testQuestions.filter(
            (q) => !languageQuestionIds.has(q._id.toString()),
          ),
        ];
      } else {
        questions = testQuestions;
        fallbackToFullSet = true;
      }
    }

    if (questions.length === 0 && languagePreference) {
      fallbackQuestions = await Question.find({
        isActive: true,
        $or: [{ language: languageTagRegex }, { tags: languageTagRegex }],
      })
        .sort({ order: 1 })
        .limit(20);

      if (fallbackQuestions.length > 0) {
        languageQuestions = fallbackQuestions;
        usedLanguageFilter = true;
        usedGlobalFallback = false;
        questions = fallbackQuestions;
      }
    }

    if (questions.length === 0) {
      const allActiveQuestions = await Question.find({ isActive: true })
        .sort({ order: 1 })
        .limit(20);
      questions = allActiveQuestions;
      usedGlobalFallback = true;
    }

    const debugInfo = {
      languagePreference,
      testQuestionsCount: testQuestions.length,
      languageQuestionsCount: languageQuestions.length,
      languageGlobalQuestionsCount: languageGlobalQuestions.length,
      usedLanguageFilter,
      hasTaggedQuestions,
      fallbackToFullSet,
      usedGlobalFallback,
      selectedQuestionCount: questions.length,
    };

    console.log("Language preference:", languagePreference);
    console.log("Final questions count:", questions.length);
    console.log(
      "Question IDs:",
      questions.map((q) => ({
        id: q._id,
        order: q.order,
        test: q.test,
        tags: q.tags,
      })),
    );

    // Check existing exam
    console.log("Checking for existing exam...");
    let exam = await Exam.findOne({
      application: application._id,
      student: req.user._id,
      status: "in_progress",
    });
    console.log("Existing exam found:", exam ? "Yes" : "No");

    // Return existing exam
    if (exam) {
      console.log("Returning existing exam");
      return res.status(200).json({
        success: true,
        message: "Existing exam loaded",
        exam,
        questions,
        debug: debugInfo,
      });
    }

    // Count attempts
    console.log("Counting attempts...");
    const attemptCount = await Exam.countDocuments({
      application: application._id,
      student: req.user._id,
    });
    console.log("Attempt count:", attemptCount);

    const allowUnlimitedAttempts = shouldAllowUnlimitedAttempts(
      student,
      application.test.maxAttempts,
      attemptCount,
    );
    console.log("Allow unlimited attempts:", allowUnlimitedAttempts);

    if (!allowUnlimitedAttempts) {
      console.log("Maximum attempts reached");
      return res.status(400).json({
        success: false,
        message: "Maximum attempts reached",
      });
    }

    // Create exam
    console.log("Creating new exam...");
    try {
      exam = await Exam.create({
        test: application.test._id,
        student: req.user._id,
        application: application._id,
        institute: application.institute,
        duration: application.test.duration,
        status: "in_progress",
        attempts: attemptCount + 1,
        ipAddress: req.ip,
        browserInfo: req.headers["user-agent"],

        answers: questions.map((question) => ({
          question: question._id,
          answer: null,
          isCorrect: false,
          marksObtained: 0,
          timeSpent: 0,
        })),
      });
      console.log("Exam created successfully:", exam._id);
    } catch (createError) {
      console.error("Error creating exam:", createError);
      return res.status(500).json({
        success: false,
        message: "Failed to create exam: " + createError.message,
      });
    }

    console.log("Sending response with exam and questions");
    return res.status(201).json({
      success: true,
      message: "Exam started successfully",
      exam,
      questions,
      debug: debugInfo,
    });
  } catch (error) {
    console.error("Start Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("test")
      .populate("student", "firstName lastName");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Check if student owns the exam
    if (
      req.user.role === "student" &&
      exam.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save answer
// const saveAnswer = async (req, res) => {
//   try {
//     const { examId, questionId, answer, timeSpent } = req.body;

//     const exam = await Exam.findById(examId).populate("test");

//     if (!exam) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Exam not found" });
//     }

//     if (exam.status !== "in_progress") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Exam is not in progress" });
//     }

//     if (exam.student.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Question not found" });
//     }

//     // Find and update the answer
//     const answerIndex = exam.answers.findIndex(
//       (a) => a.question.toString() === questionId,
//     );
//     if (answerIndex === -1) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Question not found in exam" });
//     }

//     exam.answers[answerIndex].answer = answer;
//     exam.answers[answerIndex].timeSpent =
//       timeSpent || exam.answers[answerIndex].timeSpent;

//     // Auto-grade objective questions
//     if (
//       ["mcq", "true_false", "fill_in_blanks", "matching"].includes(
//         question.type,
//       )
//     ) {
//       exam.answers[answerIndex].isCorrect = checkAnswer(question, answer);
//       exam.answers[answerIndex].marksObtained = exam.answers[answerIndex]
//         .isCorrect
//         ? question.marks
//         : 0;
//     }

//     await exam.save();

//     res.status(200).json({ success: true, exam });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const saveAnswer = async (req, res) => {
  try {
    const { examId, questionId, answer, timeSpent } = req.body;

    // Check required fields
    if (!examId || !questionId || answer === undefined) {
      return res.status(400).json({
        success: false,
        message: "examId, questionId and answer are required",
      });
    }

    // Find exam
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check exam status
    if (exam.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "Exam is already submitted",
      });
    }

    // Check owner
    if (exam.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Find question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Find answer in exam
    const answerIndex = exam.answers.findIndex(
      (item) =>
        String(item.question) === String(questionId) ||
        String(item.question?._id) === String(questionId),
    );

    const isCorrect = checkAnswer(question, answer);

    if (answerIndex === -1) {
      // If the exam answer entry is missing, add it instead of failing.
      exam.answers.push({
        question: question._id,
        answer,
        isCorrect,
        marksObtained: isCorrect ? question.marks : 0,
        timeSpent: timeSpent || 0,
      });
    } else {
      exam.answers[answerIndex].answer = answer;
      exam.answers[answerIndex].timeSpent = timeSpent || 0;
      exam.answers[answerIndex].isCorrect = isCorrect;
      exam.answers[answerIndex].marksObtained = isCorrect ? question.marks : 0;
    }

    await exam.save();

    const savedAnswer =
      answerIndex === -1
        ? exam.answers[exam.answers.length - 1]
        : exam.answers[answerIndex];

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully",
      answer: savedAnswer,
    });
  } catch (error) {
    console.error("Save Answer Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to check answers
const checkAnswer = (question, answer) => {
  if (!question) return false;

  const normalizedAnswer = typeof answer === "string" ? answer.trim() : answer;
  const normalizedCorrectAnswer =
    typeof question.correctAnswer === "string"
      ? question.correctAnswer.trim()
      : question.correctAnswer;

  switch (question.type) {
    case "mcq": {
      if (Array.isArray(answer)) {
        return answer.every(
          (item, idx) =>
            item === question.options?.[idx]?.isCorrect ||
            String(item) === String(question.options?.[idx]?.isCorrect),
        );
      }

      const optionIndex = question.options?.findIndex((opt) => {
        if (opt?._id && answer && String(opt._id) === String(answer)) {
          return true;
        }
        return String(opt?.text || "") === String(answer);
      });

      if (optionIndex === -1) {
        return false;
      }

      return Boolean(question.options?.[optionIndex]?.isCorrect);
    }
    case "true_false":
      return normalizedAnswer === normalizedCorrectAnswer;
    case "fill_in_blanks": {
      if (Array.isArray(answer) && Array.isArray(question.blanks)) {
        return answer.every((ans, idx) => {
          const blank = question.blanks[idx];
          const candidate = typeof ans === "string" ? ans.trim() : ans;
          const expected =
            typeof blank?.answer === "string"
              ? blank.answer.trim()
              : blank?.answer;
          if (blank?.caseSensitive) {
            return candidate === expected;
          }
          return (
            String(candidate).toLowerCase() === String(expected).toLowerCase()
          );
        });
      }

      if (
        typeof normalizedAnswer === "string" &&
        Array.isArray(question.blanks)
      ) {
        const blank = question.blanks[0];
        const expected =
          typeof blank?.answer === "string"
            ? blank.answer.trim()
            : blank?.answer;
        if (blank?.caseSensitive) {
          return normalizedAnswer === expected;
        }
        return (
          String(normalizedAnswer).toLowerCase() ===
          String(expected).toLowerCase()
        );
      }

      return false;
    }
    case "matching": {
      if (typeof normalizedAnswer === "object" && normalizedAnswer !== null) {
        return (
          JSON.stringify(normalizedAnswer) ===
          JSON.stringify(normalizedCorrectAnswer)
        );
      }
      return normalizedAnswer === normalizedCorrectAnswer;
    }
    default:
      return normalizedAnswer === normalizedCorrectAnswer;
  }
};

// Submit exam
const submitExam = async (req, res) => {
  try {
    // const { examId } = req.params;
    const { id } = req.params;

    const exam = await Exam.findById(id).populate("test");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    if (exam.status !== "in_progress") {
      return res
        .status(400)
        .json({ success: false, message: "Exam already submitted" });
    }

    if (exam.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Calculate objective score
    let objectiveScore = 0;
    exam.answers.forEach((answer) => {
      objectiveScore += answer.marksObtained;
    });

    exam.objectiveScore = objectiveScore;
    exam.totalScore = objectiveScore; // Will be updated after subjective review
    exam.percentage = (exam.totalScore / exam.test.totalMarks) * 100;
    exam.status = "submitted";
    exam.submittedAt = new Date();

    // Check if passed (only based on objective score for now)
    exam.passed = exam.percentage >= exam.test.passingMarks;

    await exam.save();

    // Create notification
    await Notification.create({
      recipient: exam.student,
      type: "result_declared",
      title: "Exam Submitted",
      message: `Your exam for ${exam.test.title} has been submitted successfully.`,
      data: { examId: exam._id },
    });

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Auto submit exam (called by cron or when time expires)
const autoSubmitExam = async (req, res) => {
  try {
    const { id: examId } = req.params;

    const exam = await Exam.findById(examId).populate("test");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    if (exam.status !== "in_progress") {
      return res
        .status(400)
        .json({ success: false, message: "Exam already submitted" });
    }

    // Calculate objective score
    let objectiveScore = 0;
    exam.answers.forEach((answer) => {
      objectiveScore += answer.marksObtained;
    });

    exam.objectiveScore = objectiveScore;
    exam.totalScore = objectiveScore;
    exam.percentage = (exam.totalScore / exam.test.totalMarks) * 100;
    exam.status = "auto_submitted";
    exam.submittedAt = new Date();
    exam.autoSubmitReason = "Time expired";

    await exam.save();

    // Create notification
    await Notification.create({
      recipient: exam.student,
      type: "result_declared",
      title: "Exam Auto-Submitted",
      message: `Your exam for ${exam.test.title} was auto-submitted due to time expiry.`,
      data: { examId: exam._id },
    });

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get exam results
const getExamResults = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("test", "title code totalMarks passingMarks duration")
      .populate("student", "firstName lastName email studentId")
      .populate("institute", "name")
      .populate("answers.question", "type question marks options blanks");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    if (
      req.user.role === "student" &&
      exam.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Build answer breakdown with human-readable answers
    const answerBreakdown = exam.answers.map((answer) => {
      const question = answer.question;
      let selectedAnswerText = answer.answer;
      let correctAnswerText = "";

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
        correctAnswerText = question.correctAnswer === true ? "True" : "False";
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
      } else {
        correctAnswerText = question?.correctAnswer || "Not available";
      }

      return {
        questionText: question?.question || "Question not available",
        selectedAnswer: selectedAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: answer.isCorrect,
        marks: question?.marks || 0,
        marksObtained: answer.marksObtained || 0,
      };
    });

    res.status(200).json({
      success: true,
      exam: {
        ...exam.toObject(),
        answerBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student's exam history
const getExamHistory = async (req, res) => {
  try {
    const exams = await Exam.find({ student: req.user._id })
      .populate("test", "title code language level totalMarks passingMarks")
      .populate("answers.question", "type question marks options blanks")
      .sort({ submittedAt: -1 });

    // Build answer breakdown for each exam
    const examsWithBreakdown = exams.map((exam) => {
      const answerBreakdown = exam.answers.map((answer) => {
        const question = answer.question;
        let selectedAnswerText = answer.answer;
        let correctAnswerText = "";

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
        } else {
          correctAnswerText = question?.correctAnswer || "Not available";
        }

        return {
          questionText: question?.question || "Question not available",
          selectedAnswer: selectedAnswerText,
          correctAnswer: correctAnswerText,
          isCorrect: answer.isCorrect,
          marks: question?.marks || 0,
          marksObtained: answer.marksObtained || 0,
        };
      });

      return {
        ...exam.toObject(),
        answerBreakdown,
      };
    });

    res.status(200).json({ success: true, exams: examsWithBreakdown });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get active exam (in progress)
const getActiveExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      student: req.user._id,
      status: "in_progress",
    }).populate("test");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "No active exam found" });
    }

    // Get questions for the exam
    const questions = await Question.find({ test: exam.test._id }).sort({
      order: 1,
    });

    res.status(200).json({ success: true, exam, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  startExam,
  getExamById,
  saveAnswer,
  submitExam,
  autoSubmitExam,
  getExamResults,
  getExamHistory,
  getActiveExam,
};

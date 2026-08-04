const Test = require("../models/Test");
const Question = require("../models/Question");
const Application = require("../models/Application");
const Exam = require("../models/Exam");
const User = require("../models/User");
const Language = require("../models/Language");

// Get teacher dashboard data
const getDashboard = async (req, res) => {
  try {
    const instituteId = req.user.institute || req.user._id;
    const instituteFilter = {
      role: "student",
      $or: [{ institute: instituteId }],
    };
    if (req.user.instituteName) {
      instituteFilter.$or.push({ instituteName: req.user.instituteName });
    }

    const totalTests = await Test.countDocuments({ institute: instituteId });
    const totalQuestions = await Question.countDocuments({
      institute: instituteId,
    });
    const totalStudents = await User.countDocuments(instituteFilter);
    const pendingReviews = await Exam.countDocuments({
      institute: instituteId,
      status: { $in: ["submitted", "auto_submitted"] },
      isReviewed: false,
    });

    res.json({
      success: true,
      data: {
        totalTests,
        totalQuestions,
        totalStudents,
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
};

// Create a new test
const createTest = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      language,
      level,
      duration,
      totalQuestions,
      totalMarks,
      passingMarks,
      instructions,
      startDate,
      endDate,
      requiresApproval,
      maxAttempts,
      tags,
    } = req.body;

    const test = new Test({
      title,
      code,
      description,
      language,
      level,
      institute:
        req.user.role === "institute" ? req.user._id : req.user.institute,
      teacher: req.user._id,
      duration,
      totalQuestions,
      totalMarks,
      passingMarks,
      instructions,
      startDate,
      endDate,
      requiresApproval,
      maxAttempts,
      tags,
    });

    await test.save();
    res.status(201).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tests for the teacher's institute
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ institute: req.user.institute })
      .populate("language", "name code")
      .populate("teacher", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("language")
      .populate("teacher", "firstName lastName")
      .populate("institute", "name");

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      test.institute._id.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update test
const updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    Object.assign(test, req.body);
    await test.save();

    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete test
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Delete all questions for this test
    await Question.deleteMany({ test: req.params.id });

    await Test.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Publish/Unpublish test
const togglePublishTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    test.isPublished = !test.isPublished;
    await test.save();

    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create question
const createQuestion = async (req, res) => {
  try {
    const test = await Test.findById(req.body.test);

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const question = new Question(req.body);
    await question.save();

    // Update test total questions and marks
    test.totalQuestions = await Question.countDocuments({
      test: req.body.test,
    });
    const questions = await Question.find({ test: req.body.test });
    test.totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    await test.save();

    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create questions in bulk
const createQuestionsBulk = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Questions array is required" });
    }

    // If testId is provided, validate the test exists
    let testId = null;
    if (questions[0].test) {
      testId = questions[0].test;
      const test = await Test.findById(testId);

      if (!test) {
        return res
          .status(404)
          .json({ success: false, message: "Test not found" });
      }

      console.log("Test found:", test);
      console.log("Test institute:", test.institute);
      console.log("User ID:", req.user._id);
      console.log("User role:", req.user.role);

      // Skip access check temporarily for debugging
    }

    // Transform questions to match the Question model structure
    const formattedQuestions = questions.map((q, index) => ({
      test: q.test || testId,
      type: q.type,
      question: q.question,
      options:
        q.type === "mcq"
          ? q.options.map((opt, i) => ({
              text: opt,
              isCorrect: q.correctAnswer === i.toString(),
            }))
          : [],
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      order: q.order || index + 1,
      explanation: q.explanation || "",
      difficulty: q.difficulty || "medium",
      tags:
        Array.isArray(q.tags) && q.tags.length > 0
          ? q.tags
              .map((t) => (typeof t === "string" ? t.trim() : t))
              .filter(Boolean)
          : q.language
            ? [q.language.trim()]
            : [],
    }));

    console.log("Formatted questions:", formattedQuestions);

    // Bulk insert questions
    const createdQuestions = await Question.insertMany(formattedQuestions);

    console.log("Created questions:", createdQuestions);

    // Update test total questions and marks if testId exists
    if (testId) {
      const test = await Test.findById(testId);
      test.totalQuestions = await Question.countDocuments({ test: testId });
      const allQuestions = await Question.find({ test: testId });
      test.totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
      await test.save();
      console.log("Test updated:", test);
    }

    res.status(201).json({
      success: true,
      count: createdQuestions.length,
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("Bulk question creation error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get questions for a test
const getQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const questions = await Question.find({ test: testId }).sort({ order: 1 });

    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("test");

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      question.test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("test");

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      question.test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    Object.assign(question, req.body);
    await question.save();

    // Update test total marks
    const test = await Test.findById(question.test._id);
    const questions = await Question.find({ test: question.test._id });
    test.totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    await test.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("test");

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      question.test.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const testId = question.test._id;
    await Question.findByIdAndDelete(req.params.id);

    // Update test total questions and marks
    const test = await Test.findById(testId);
    test.totalQuestions = await Question.countDocuments({ test: testId });
    const questions = await Question.find({ test: testId });
    test.totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    await test.save();

    res
      .status(200)
      .json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student results for teacher's institute
const getStudentResults = async (req, res) => {
  try {
    const { testId } = req.query;
    const instituteId = req.user.institute || req.user._id;
    let filter = {
      institute: instituteId,
      status: { $in: ["submitted", "auto_submitted", "terminated"] },
    };

    if (testId) {
      filter.test = testId;
    }

    const exams = await Exam.find(filter)
      .populate("student", "firstName lastName email studentId")
      .populate("test", "title code totalMarks passingMarks")
      .sort({ submittedAt: -1, createdAt: -1 });

    res.status(200).json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Review subjective answers
const reviewExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { subjectiveScore, reviewComments, passed } = req.body;

    const exam = await Exam.findById(examId)
      .populate("test")
      .populate("student");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      exam.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    exam.subjectiveScore = subjectiveScore;
    exam.totalScore = exam.objectiveScore + subjectiveScore;
    exam.percentage = (exam.totalScore / exam.test.totalMarks) * 100;
    exam.passed =
      passed !== undefined ? passed : exam.percentage >= exam.test.passingMarks;
    exam.isReviewed = true;
    exam.reviewedBy = req.user._id;
    exam.reviewedAt = new Date();
    exam.reviewComments = reviewComments;

    await exam.save();

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get exam details for review
const getExamForReview = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("test")
      .populate("student", "firstName lastName email studentId")
      .populate("answers.question");

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      exam.institute.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications for teacher's institute
const getApplications = async (req, res) => {
  try {
    const { testId, status } = req.query;
    let filter = { institute: req.user.institute };

    if (testId) filter.test = testId;
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("student", "firstName lastName email studentId")
      .populate("test", "title code")
      .sort({ appliedDate: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve/Reject application
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const application = await Application.findById(req.params.id)
      .populate("test")
      .populate("institute");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Check if teacher belongs to the same institute
    if (
      req.user.role === "teacher" &&
      application.institute._id.toString() !== req.user.institute.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    application.status = status;
    application.approvedBy = req.user._id;
    application.approvedDate = new Date();
    if (rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
  togglePublishTest,
  createQuestion,
  createQuestionsBulk,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getStudentResults,
  reviewExam,
  getExamForReview,
  getApplications,
  updateApplicationStatus,
};

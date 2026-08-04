const Question = require("../models/Question");
const Test = require("../models/Test");

// ===============================
// Create Single Question
// ===============================
const createQuestion = async (req, res) => {
  try {
    const { type, question, marks, order, ...rest } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Question type is required",
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question text is required",
      });
    }

    // Auto-generate order if not provided
    const lastQuestion = await Question.findOne().sort({ order: -1 });
    const autoOrder = order || (lastQuestion ? lastQuestion.order + 1 : 1);

    const questionData = {
      type,
      question,
      marks: marks || 1,
      order: autoOrder,
      ...rest,
    };

    const createdQuestion = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: createdQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Create Bulk Questions
// ===============================
const createBulkQuestions = async (req, res) => {
  try {
    const { testId, questions } = req.body;

    // if (!testId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Test ID is required",
    //   });
    // }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required",
      });
    }

    const questionData = questions.map((question, index) => ({
      ...question,
      test: testId,
      order: index + 1,
    }));

    const savedQuestions = await Question.insertMany(questionData);

    if (testId) {
      const test = await Test.findById(testId);
      if (test) {
        test.totalQuestions = await Question.countDocuments({ test: testId });
        const allQuestions = await Question.find({ test: testId });
        test.totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
        await test.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Questions uploaded successfully",
      total: savedQuestions.length,
      questions: savedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Questions
// ===============================
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("test", "title code")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      exam: { duration: 60 }, // Default exam duration
      total: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Questions By Test
// ===============================
const getQuestionsByTest = async (req, res) => {
  try {
    const { testId } = req.params;

    let questions = await Question.find({
      test: testId,
      isActive: true,
    }).sort({ order: 1 });

    // Fallback: if no questions found for this test, return all active questions
    if (questions.length === 0) {
      questions = await Question.find({
        isActive: true,
      })
        .sort({ order: 1 })
        .limit(20);
    }

    res.status(200).json({
      success: true,
      total: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Question By ID
// ===============================
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "test",
      "title code",
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Question
// ===============================
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Question
// ===============================
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  createBulkQuestions,
  getAllQuestions,
  getQuestionsByTest,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};

const Test = require("../models/Test");
const Question = require("../models/Question");
const Language = require("../models/Language");

// ==============================
// Create Test
// ==============================
const createTest = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      title,
      code,
      description,
      language,
      level,
      institute,
      teacher,
      duration,
      totalQuestions,
      totalMarks,
      passingMarks,
      instructions,
      startDate,
      endDate,
      isPublished,
      requiresApproval,
      maxAttempts,
      tags,
      isActive,
    } = req.body;

    // Check duplicate code
    const existingTest = await Test.findOne({ code: code.toUpperCase() });

    if (existingTest) {
      return res.status(400).json({
        success: false,
        message: "Test code already exists",
      });
    }

    const test = await Test.create({
      title,
      code: code.toUpperCase(),
      description,
      language,
      level,
      institute,
      teacher,
      duration,
      totalQuestions,
      totalMarks,
      passingMarks,
      instructions,
      startDate,
      endDate,
      isPublished,
      requiresApproval,
      maxAttempts,
      tags,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating test",
      error: error.message,
    });
  }
};

// Get all published tests
const getAllTests = async (req, res) => {
  console.log(getAllTests);
  try {
    const {
      language,
      level,
      institute,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = { isPublished: true, isActive: true };

    if (language) filter.language = language;
    if (level) filter.level = level;
    if (institute) filter.institute = institute;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tests = await Test.find(filter)
      .populate("language", "name code")
      .populate("institute", "name location")
      .populate("teacher", "firstName lastName")
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Test.countDocuments(filter);

    res.status(200).json({
      success: true,
      tests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get test details
const getTestDetails = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("language", "name code levels")
      .populate("institute", "name location logo website")
      .populate("teacher", "firstName lastName qualifications");

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    if (!test.isPublished) {
      return res
        .status(403)
        .json({ success: false, message: "Test is not published" });
    }

    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Get Test By ID
// ==============================
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Test ID",
      });
    }

    const test = await Test.findById(id)
      .populate("language")
      .populate("teacher", "firstName lastName email")
      .populate("institute", "instituteName");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching test",
      error: error.message,
    });
  }
};

// Get all languages
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({ success: true, languages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get language by ID
const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res
        .status(404)
        .json({ success: false, message: "Language not found" });
    }

    res.status(200).json({ success: true, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTest = await Test.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTest) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: updatedTest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating test",
      error: error.message,
    });
  }
};

// ==============================
// Delete Test
// ==============================
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting test",
      error: error.message,
    });
  }
};

module.exports = {
  createTest,
  getAllTests,
  getTestDetails,
  getTestById,
  getAllLanguages,
  getLanguageById,
  updateTest,
  deleteTest,
};

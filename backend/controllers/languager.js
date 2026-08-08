const Language = require("../models/Language");

// ==========================================
// CREATE LANGUAGE
// ==========================================
const createLanguage = async (req, res) => {
  try {
    const {
      name,
      code,
      levels,
      description,
      shortDescription,
      imageUrl,
      duration,
      instituteName,
      subscriptionAmount,
      isActive,
    } = req.body;

    // Check required fields
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required",
      });
    }

    // Check duplicate code
    const existingLanguage = await Language.findOne({
      code: code.toUpperCase(),
    });

    if (existingLanguage) {
      return res.status(400).json({
        success: false,
        message: "Language code already exists",
      });
    }

    const language = await Language.create({
      name,
      code: code.toUpperCase(),
      levels,
      description,
      shortDescription,
      imageUrl,
      duration,
      instituteName,
      subscriptionAmount,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Language created successfully",
      language,
    });
  } catch (error) {
    console.error("Create language error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create language",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL LANGUAGES
// ==========================================
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: languages.length,
      languages,
    });
  } catch (error) {
    console.error("Get languages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch languages",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE LANGUAGE
// ==========================================
const getLanguageById = async (req, res) => {
  try {
    const { id } = req.params;

    const language = await Language.findById(id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    res.status(200).json({
      success: true,
      language,
    });
  } catch (error) {
    console.error("Get language error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch language",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE LANGUAGE
// ==========================================
const updateLanguage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      code,
      levels,
      description,
      shortDescription,
      imageUrl,
      duration,
      instituteName,
      subscriptionAmount,
      isActive,
    } = req.body;

    // Check language exists
    const language = await Language.findById(id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    // Check duplicate code
    if (code) {
      const existingLanguage = await Language.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id },
      });

      if (existingLanguage) {
        return res.status(400).json({
          success: false,
          message: "Language code already exists",
        });
      }
    }

    const updatedLanguage = await Language.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code: code.toUpperCase() }),
        ...(levels !== undefined && { levels }),
        ...(description !== undefined && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(duration !== undefined && { duration }),
        ...(instituteName !== undefined && { instituteName }),
        ...(subscriptionAmount !== undefined && {
          subscriptionAmount,
        }),
        ...(isActive !== undefined && { isActive }),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Language updated successfully",
      language: updatedLanguage,
    });
  } catch (error) {
    console.error("Update language error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update language",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE LANGUAGE
// ==========================================
const deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;

    const language = await Language.findByIdAndDelete(id);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Language deleted successfully",
      language,
    });
  } catch (error) {
    console.error("Delete language error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete language",
      error: error.message,
    });
  }
};

module.exports = {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
};

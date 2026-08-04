const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      instituteName,
      location,
      preferredLanguage,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    };

    // Add role-specific fields
    if (role === "institute") {
      userData.instituteName = instituteName;
      userData.location = location;
    } else if (role === "student") {
      userData.studentId = `STU${Date.now().toString().slice(-6)}`;
      userData.subscriptionStatus = "none";
      userData.subscriptionAmount = 800;
      userData.referralCode = `REF${Date.now().toString().slice(-8)}`;
      if (instituteName) {
        userData.instituteName = instituteName;
        const instituteUser = await User.findOne({
          role: "institute",
          instituteName,
        });
        if (instituteUser) {
          userData.institute = instituteUser._id;
        }
      }
      if (preferredLanguage) {
        userData.preferredLanguage = preferredLanguage;
      }
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role, deviceId } = req.body;
    const resolvedDeviceId = deviceId || req.headers["x-device-id"] || "";

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials for this role",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (
      user.role === "student" &&
      user.subscriptionStatus === "active" &&
      user.activeDeviceId &&
      resolvedDeviceId &&
      user.activeDeviceId !== resolvedDeviceId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This subscription is already active on another device. Please log out from the current device first.",
      });
    }

    if (user.role === "student" && resolvedDeviceId) {
      user.activeDeviceId = resolvedDeviceId;
      user.deviceLastSeenAt = new Date();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};

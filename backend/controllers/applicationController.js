const Application = require("../models/Application");
const Test = require("../models/Test");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Apply for a test
const applyForTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const studentId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    if (!test.isPublished) {
      return res
        .status(400)
        .json({ success: false, message: "Test is not published" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      test: testId,
      student: studentId,
      status: { $in: ["pending", "approved"] },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied for this test" });
    }

    const student = await User.findById(studentId);

    const hasActiveSubscription =
      student?.role === "student" &&
      student.subscriptionStatus === "active" &&
      (!student.subscriptionExpiresAt ||
        new Date(student.subscriptionExpiresAt) > new Date());

    if (!hasActiveSubscription) {
      return res.status(403).json({
        success: false,
        message:
          "Subscription is required to apply for tests. Please request and wait for admin approval.",
      });
    }

    const application = new Application({
      test: testId,
      student: studentId,
      institute: test.institute,
      status: test.requiresApproval ? "pending" : "approved",
      paymentAmount: test.fee,
      paymentStatus: test.fee > 0 ? "pending" : "completed",
    });

    if (!test.requiresApproval) {
      application.approvedDate = new Date();
    }

    await application.save();

    // Create notification for institute admin
    if (test.requiresApproval) {
      await Notification.create({
        recipient: test.institute,
        type: "application_status",
        title: "New Application",
        message: `${student.firstName} ${student.lastName} has applied for ${test.title}`,
        data: { applicationId: application._id },
      });
    }

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student's applications
const getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { student: req.user._id };

    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate(
        "test",
        "title code language level duration startDate endDate fee",
      )
      .populate("institute", "instituteName location")
      .sort({ appliedDate: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate(
        "test",
        "title code language level duration startDate endDate fee instructions",
      )
      .populate("institute", "instituteName location logo")
      .populate("student", "firstName lastName email studentId");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel application
const cancelApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (application.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Application already cancelled" });
    }

    if (application.status === "approved") {
      // Check if exam has been taken
      const Exam = require("../models/Exam");
      const examExists = await Exam.findOne({
        application: application._id,
      });

      if (examExists) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel application after exam has been taken",
        });
      }
    }

    application.status = "cancelled";
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForTest,
  getMyApplications,
  getApplicationById,
  cancelApplication,
};

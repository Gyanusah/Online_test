const Exam = require("../models/Exam");
const Test = require("../models/Test");
const Application = require("../models/Application");
const User = require("../models/User");

// Get dashboard analytics for teacher
const getTeacherAnalytics = async (req, res) => {
  try {
    const instituteId = req.user.institute;

    // Get total tests
    const totalTests = await Test.countDocuments({ institute: instituteId });

    // Get published tests
    const publishedTests = await Test.countDocuments({
      institute: instituteId,
      isPublished: true,
    });

    // Get total students who took exams
    const totalExamTakers = await Exam.distinct("student", {
      institute: instituteId,
    });

    // Get average score
    const exams = await Exam.find({ institute: instituteId });
    const averageScore =
      exams.length > 0
        ? exams.reduce((sum, exam) => sum + exam.percentage, 0) / exams.length
        : 0;

    // Get pass rate
    const passedExams = exams.filter((exam) => exam.passed).length;
    const passRate = exams.length > 0 ? (passedExams / exams.length) * 100 : 0;

    // Get recent exam activity
    const recentExams = await Exam.find({ institute: instituteId })
      .populate("student", "firstName lastName")
      .populate("test", "title")
      .sort({ submittedAt: -1 })
      .limit(10);

    // Get test performance
    const testPerformance = await Test.find({ institute: instituteId }).select(
      "title code totalMarks",
    );

    const testStats = await Promise.all(
      testPerformance.map(async (test) => {
        const testExams = await Exam.find({ test: test._id });
        const avgScore =
          testExams.length > 0
            ? testExams.reduce((sum, exam) => sum + exam.percentage, 0) /
              testExams.length
            : 0;
        const passCount = testExams.filter((exam) => exam.passed).length;

        return {
          testId: test._id,
          title: test.title,
          code: test.code,
          totalAttempts: testExams.length,
          averageScore: avgScore,
          passRate:
            testExams.length > 0 ? (passCount / testExams.length) * 100 : 0,
        };
      }),
    );

    res.status(200).json({
      success: true,
      analytics: {
        totalTests,
        publishedTests,
        totalStudents: totalExamTakers.length,
        averageScore: averageScore.toFixed(2),
        passRate: passRate.toFixed(2),
        recentExams,
        testStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard analytics for institute
const getInstituteAnalytics = async (req, res) => {
  try {
    const instituteId = req.user.institute || req.user._id;
    const studentFilter = {
      role: "student",
      $or: [{ institute: instituteId }],
    };
    if (req.user.instituteName) {
      studentFilter.$or.push({ instituteName: req.user.instituteName });
    }

    const teacherFilter = {
      role: "teacher",
      $or: [{ institute: instituteId }],
    };
    if (req.user.instituteName) {
      teacherFilter.$or.push({ instituteName: req.user.instituteName });
    }

    // Get total teachers
    const totalTeachers = await User.countDocuments(teacherFilter);

    // Get total students
    const totalStudents = await User.countDocuments(studentFilter);

    // Get total tests
    const totalTests = await Test.countDocuments({ institute: instituteId });

    // Get total applications
    const totalApplications = await Application.countDocuments({
      institute: instituteId,
    });

    // Get pending applications
    const pendingApplications = await Application.countDocuments({
      institute: instituteId,
      status: "pending",
    });

    // Get total exams taken
    const totalExams = await Exam.countDocuments({ institute: instituteId });

    // Get revenue
    const applications = await Application.find({
      institute: instituteId,
      paymentStatus: "completed",
    });
    const totalRevenue = applications.reduce(
      (sum, app) => sum + app.paymentAmount,
      0,
    );

    // Get monthly data
    const monthlyData = await getMonthlyData(instituteId);

    res.status(200).json({
      success: true,
      analytics: {
        totalTeachers,
        totalStudents,
        totalTests,
        totalApplications,
        pendingApplications,
        totalExams,
        totalRevenue,
        monthlyData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard analytics for super admin
const getAdminAnalytics = async (req, res) => {
  try {
    const totalInstitutes = await User.countDocuments({ role: "institute" });
    const pendingInstitutes = await User.countDocuments({
      role: "institute",
      isActive: false,
    });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTests = await Test.countDocuments();
    const totalExams = await Exam.countDocuments();
    const activeSubscriptions = await User.countDocuments({
      role: "student",
      subscriptionStatus: "active",
    });
    const pendingSubscriptions = await User.countDocuments({
      role: "student",
      subscriptionStatus: "pending",
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
      .sort({ lastPaymentAt: -1 })
      .limit(10);

    const totalRevenue = revenueRecords.reduce(
      (sum, record) => sum + Number(record.subscriptionAmount || 0),
      0,
    );

    const recentInstitutes = await User.find({ role: "institute" })
      .sort({ createdAt: -1 })
      .limit(5);
    const recentTests = await Test.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        totalInstitutes,
        pendingInstitutes,
        totalTeachers,
        totalStudents,
        totalTests,
        totalExams,
        activeSubscriptions,
        pendingSubscriptions,
        paidSubscriptions,
        totalRevenue,
        revenueRecords,
        recentInstitutes,
        recentTests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student performance analytics
const getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all exams
    const exams = await Exam.find({ student: studentId })
      .populate("test", "title language level")
      .sort({ submittedAt: -1 });

    // Calculate average score
    const averageScore =
      exams.length > 0
        ? exams.reduce((sum, exam) => sum + exam.percentage, 0) / exams.length
        : 0;

    // Get pass rate
    const passedExams = exams.filter((exam) => exam.passed).length;
    const passRate = exams.length > 0 ? (passedExams / exams.length) * 100 : 0;

    // Get performance by language
    const performanceByLanguage = await Exam.aggregate([
      { $match: { student: studentId } },
      {
        $lookup: {
          from: "tests",
          localField: "test",
          foreignField: "_id",
          as: "testData",
        },
      },
      {
        $lookup: {
          from: "languages",
          localField: "testData.language",
          foreignField: "_id",
          as: "languageData",
        },
      },
      {
        $unwind: "$languageData",
      },
      {
        $group: {
          _id: "$languageData.name",
          averageScore: { $avg: "$percentage" },
          totalExams: { $sum: 1 },
          passedExams: {
            $sum: { $cond: ["$passed", 1, 0] },
          },
        },
      },
    ]);

    // Get exam history
    const examHistory = exams.map((exam) => ({
      testTitle: exam.test.title,
      language: exam.test.language,
      level: exam.test.level,
      score: exam.totalScore,
      percentage: exam.percentage,
      passed: exam.passed,
      submittedAt: exam.submittedAt,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalExams: exams.length,
        averageScore: averageScore.toFixed(2),
        passRate: passRate.toFixed(2),
        performanceByLanguage,
        examHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get monthly data
const getMonthlyData = async (instituteId) => {
  const months = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1,
    );
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const exams = await Exam.find({
      institute: instituteId,
      submittedAt: { $gte: monthStart, $lte: monthEnd },
    });

    const applications = await Application.find({
      institute: instituteId,
      appliedDate: { $gte: monthStart, $lte: monthEnd },
    });

    months.push({
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      examsTaken: exams.length,
      applicationsReceived: applications.length,
      revenue: applications.reduce((sum, app) => sum + app.paymentAmount, 0),
    });
  }

  return months;
};

// Generate report
const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate, instituteId } = req.body;

    let data = {};

    switch (type) {
      case "exam_performance":
        data = await generateExamPerformanceReport(
          instituteId,
          startDate,
          endDate,
        );
        break;
      case "student_progress":
        data = await generateStudentProgressReport(
          instituteId,
          startDate,
          endDate,
        );
        break;
      case "test_statistics":
        data = await generateTestStatisticsReport(
          instituteId,
          startDate,
          endDate,
        );
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid report type" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateExamPerformanceReport = async (
  instituteId,
  startDate,
  endDate,
) => {
  const filter = { institute: instituteId };
  if (startDate && endDate) {
    filter.submittedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const exams = await Exam.find(filter)
    .populate("student", "firstName lastName studentId")
    .populate("test", "title code");

  const averageScore =
    exams.length > 0
      ? exams.reduce((sum, exam) => sum + exam.percentage, 0) / exams.length
      : 0;

  return {
    totalExams: exams.length,
    averageScore: averageScore.toFixed(2),
    exams: exams.map((exam) => ({
      student: exam.student,
      test: exam.test,
      score: exam.totalScore,
      percentage: exam.percentage,
      passed: exam.passed,
      submittedAt: exam.submittedAt,
    })),
  };
};

const generateStudentProgressReport = async (
  instituteId,
  startDate,
  endDate,
) => {
  const filter = { institute: instituteId };
  if (startDate && endDate) {
    filter.submittedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const exams = await Exam.find(filter)
    .populate("student", "firstName lastName studentId")
    .populate("test", "title language level");

  const studentProgress = {};

  exams.forEach((exam) => {
    const studentId = exam.student._id.toString();
    if (!studentProgress[studentId]) {
      studentProgress[studentId] = {
        student: exam.student,
        totalExams: 0,
        passedExams: 0,
        averageScore: 0,
        languages: new Set(),
      };
    }

    studentProgress[studentId].totalExams++;
    if (exam.passed) studentProgress[studentId].passedExams++;
    studentProgress[studentId].averageScore += exam.percentage;
    studentProgress[studentId].languages.add(exam.test.language);
  });

  Object.values(studentProgress).forEach((student) => {
    student.averageScore = student.averageScore / student.totalExams;
    student.languages = Array.from(student.languages);
  });

  return Object.values(studentProgress);
};

const generateTestStatisticsReport = async (
  instituteId,
  startDate,
  endDate,
) => {
  const filter = { institute: instituteId };
  if (startDate && endDate) {
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const tests = await Test.find(filter).populate("language", "name");

  const testStats = await Promise.all(
    tests.map(async (test) => {
      const exams = await Exam.find({ test: test._id });
      const averageScore =
        exams.length > 0
          ? exams.reduce((sum, exam) => sum + exam.percentage, 0) / exams.length
          : 0;
      const passCount = exams.filter((exam) => exam.passed).length;

      return {
        test: test,
        totalAttempts: exams.length,
        averageScore: averageScore.toFixed(2),
        passRate:
          exams.length > 0 ? ((passCount / exams.length) * 100).toFixed(2) : 0,
      };
    }),
  );

  return testStats;
};

module.exports = {
  getTeacherAnalytics,
  getInstituteAnalytics,
  getAdminAnalytics,
  getStudentPerformance,
  generateReport,
};

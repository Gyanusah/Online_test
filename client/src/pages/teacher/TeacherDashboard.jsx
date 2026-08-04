import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { teacherAPI } from "../../utils/api";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalTests: 0,
    totalQuestions: 0,
    totalStudents: 0,
    pendingReviews: 0,
  });

  const [recentTests, setRecentTests] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardResponse = await teacherAPI.getDashboard();
      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data);
      }

      const resultsResponse = await teacherAPI.getStudentResults();
      const exams = resultsResponse?.data?.exams || [];

      setRecentResults(
        exams.slice(0, 5).map((exam) => ({
          _id: exam._id,
          student: exam.student
            ? `${exam.student.firstName || ""} ${exam.student.lastName || ""}`.trim() ||
              exam.student.email
            : "Unknown student",
          test: exam.test?.title || "Untitled test",
          score: exam.totalScore || 0,
          percentage: exam.percentage || 0,
          status: exam.passed ? "passed" : "failed",
        })),
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        totalTests: 0,
        totalQuestions: 0,
        totalStudents: 0,
        pendingReviews: 0,
      });
      setRecentResults([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Tests",
      value: stats.totalTests,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Total Questions",
      value: stats.totalQuestions,
      icon: ClipboardCheck,
      color: "green",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "purple",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Clock,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your teaching activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${colorClasses[stat.color]} bg-opacity-10`}
              >
                <stat.icon
                  size={24}
                  className={colorClasses[stat.color].replace("bg-", "text-")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Tests</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-3 font-medium">Test Name</th>
                  <th className="pb-3 font-medium">Language</th>
                  <th className="pb-3 font-medium">Level</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Students</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentTests.map((test) => (
                  <tr key={test._id} className="border-b last:border-b-0">
                    <td className="py-4 font-medium text-gray-900">
                      {test.title}
                    </td>
                    <td className="py-4 text-gray-600">{test.language}</td>
                    <td className="py-4 text-gray-600">{test.level}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {test.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">{test.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Results
          </h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Test</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Percentage</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentResults.map((result) => (
                  <tr key={result._id} className="border-b last:border-b-0">
                    <td className="py-4 font-medium text-gray-900">
                      {result.student}
                    </td>
                    <td className="py-4 text-gray-600">{result.test}</td>
                    <td className="py-4 text-gray-600">{result.score}</td>
                    <td className="py-4 text-gray-600">{result.percentage}%</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                          result.status === "passed"
                            ? "bg-green-100 text-green-700"
                            : result.status === "pending_review"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.status === "passed" && (
                          <CheckCircle size={12} />
                        )}
                        {result.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

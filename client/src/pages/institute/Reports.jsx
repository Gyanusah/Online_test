import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, BookOpen, Download, Filter } from "lucide-react";
import { instituteAPI } from "../../utils/api";

const Reports = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalExams: 0,
    averageScore: 0,
    passRate: 0,
    totalReviews: 0,
    averageRating: 0,
    coursePerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        instituteAPI.getStats(),
        instituteAPI.getAnalytics(timeRange),
      ]);

      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats((prev) => ({
          ...prev,
          totalStudents: data.totalStudents || 0,
          totalCourses: data.totalTests || 0,
        }));
      }

      if (analyticsResponse.data.success) {
        const data = analyticsResponse.data.data;
        setStats((prev) => ({
          ...prev,
          totalExams: data.totalExams || 0,
          averageScore: data.averageScore || 0,
          passRate: data.passRate || 0,
          totalReviews: data.totalReviews || 0,
          averageRating: data.averageRating || 0,
          coursePerformance: data.coursePerformance || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Track your institute's performance metrics</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Export Report
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Filter size={20} className="text-gray-400" />
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
              <p className="text-sm text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalExams}</p>
              <p className="text-sm text-gray-500">Total Exams</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.averageScore}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Course Performance</h2>
          {stats.coursePerformance.length === 0 ? (
            <p className="text-gray-500">No course data available</p>
          ) : (
            <div className="space-y-4">
              {stats.coursePerformance.map((course, index) => {
                const colors = ["blue", "green", "purple", "orange"];
                const color = colors[index % colors.length];
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{course.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${course.averageScore}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{course.averageScore}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Engagement</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Active Students</span>
              <span className="text-2xl font-bold text-green-600">{Math.round(stats.totalStudents * 0.8)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Completed Exams</span>
              <span className="text-2xl font-bold text-blue-600">{stats.totalExams}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pass Rate</span>
              <span className="text-2xl font-bold text-purple-600">{stats.passRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Reviews</span>
              <span className="text-2xl font-bold text-orange-600">{stats.totalReviews}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">5 new students enrolled</p>
              <p className="text-sm text-gray-500">Today</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">12 exams completed</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Average score increased by 5%</p>
              <p className="text-sm text-gray-500">This week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

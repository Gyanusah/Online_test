import { useState, useEffect } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import {
  Users,
  GraduationCap,
  FileText,
  BookOpen,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { instituteAPI, teacherAPI } from "../../utils/api";

const InstituteDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTests: 0,
    pendingApplications: 0,
    totalQuestions: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [instituteName, setInstituteName] = useState("Institute");
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.instituteName) {
          setInstituteName(parsedUser.instituteName);
        }
      } catch (error) {
        console.error("Unable to parse stored user:", error);
      }
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsResponse, enrollmentsResponse, coursesResponse] = await Promise.all([
        instituteAPI.getStats(),
        instituteAPI.getRecentEnrollments().catch(() => ({ data: { success: false, data: { enrollments: [] } } })),
        instituteAPI.getPopularCourses().catch(() => ({ data: { success: false, data: { popularCourses: [] } } })),
      ]);

      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats({
          totalStudents: Number(data.totalStudents) || 0,
          activeStudents: Number(data.activeStudents) || 0,
          totalTests: Number(data.totalTests) || 0,
          pendingApplications: Number(data.pendingApplications) || 0,
          totalQuestions: Number(data.totalQuestions) || 0,
          pendingReviews: Number(data.pendingReviews) || 0,
        });
      }

      if (enrollmentsResponse.data.success) {
        setRecentEnrollments(enrollmentsResponse.data.data.enrollments || []);
      }

      if (coursesResponse.data.success) {
        setPopularCourses(coursesResponse.data.data.popularCourses || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {instituteName}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your institute's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={Users}
          title="Total Students"
          value={loading ? "..." : stats.totalStudents}
          description="Active enrollments"
          color="purple"
        />
        <DashboardCard
          icon={GraduationCap}
          title="Active Courses"
          value={loading ? "..." : stats.totalTests}
          description="Available courses"
          color="blue"
        />
        <DashboardCard
          icon={FileText}
          title="Applications"
          value={loading ? "..." : stats.pendingApplications}
          description="Pending reviews"
          color="green"
        />
        <DashboardCard
          icon={BookOpen}
          title="Total Questions"
          value={loading ? "..." : stats.totalQuestions}
          description="Question bank"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          icon={Clock}
          title="Pending Reviews"
          value={loading ? "..." : stats.pendingReviews}
          description="Awaiting review"
          color="yellow"
        />
        <DashboardCard
          icon={ClipboardCheck}
          title="Active Students"
          value={loading ? "..." : stats.activeStudents}
          description="Currently active"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Enrollments
          </h2>
          <div className="space-y-4">
            {recentEnrollments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent enrollments</p>
            ) : (
              recentEnrollments.map((enrollment, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {enrollment.studentName} enrolled
                    </p>
                    <p className="text-sm text-gray-500">{enrollment.timeAgo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Popular Courses
          </h2>
          <div className="space-y-4">
            {popularCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No courses available</p>
            ) : (
              popularCourses.map((course, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {course.title}
                    </p>
                    <p className="text-sm text-gray-500">{course.studentCount} students enrolled</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;

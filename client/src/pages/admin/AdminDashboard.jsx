import { useState, useEffect } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import {
  Users,
  Building2,
  Activity,
  TrendingUp,
  CreditCard,
  Mail,
  BookOpen,
} from "lucide-react";
import { adminAPI } from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalTests: 0,
    totalApplications: 0,
    completedExams: 0,
    pendingSubscriptions: 0,
  });
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsResponse, institutesResponse] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getInstitutes(),
      ]);

      if (analyticsResponse.data.success) {
        setStats(analyticsResponse.data.data);
      }

      if (institutesResponse.data.success) {
        setInstitutes(institutesResponse.data.data.institutes || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, Super Admin!
        </h1>
        <p className="text-gray-600">Overview of the entire platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <DashboardCard
          icon={Users}
          title="Total Users"
          value={loading ? "..." : stats.totalUsers}
          description="Registered users"
          color="green"
        />
        <DashboardCard
          icon={Building2}
          title="Institutes"
          value={loading ? "..." : stats.totalInstitutes}
          description="Active institutes"
          color="blue"
        />
        <DashboardCard
          icon={Activity}
          title="Tests"
          value={loading ? "..." : stats.totalTests}
          description="Total tests"
          color="purple"
        />
        <DashboardCard
          icon={TrendingUp}
          title="Completed Exams"
          value={loading ? "..." : stats.completedExams}
          description="Exam completions"
          color="orange"
        />
        <DashboardCard
          icon={CreditCard}
          title="Pending Subscriptions"
          value={loading ? "..." : stats.pendingSubscriptions}
          description="Awaiting approval"
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  New user registration: John Doe
                </p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  New institute approved: Tech Academy
                </p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  System backup completed
                </p>
                <p className="text-sm text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Platform Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Student Accounts</p>
                <p className="text-sm text-gray-500">Registered students</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.totalStudents}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Institute Accounts</p>
                <p className="text-sm text-gray-500">Verified institutes</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? "..." : stats.totalInstitutes}
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Teacher Accounts</p>
                <p className="text-sm text-gray-500">Registered teachers</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {loading ? "..." : stats.totalTeachers}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Institute Details</h2>
          <p className="text-sm text-gray-500">
            {institutes.length} institutes with student and language details
          </p>
        </div>

        <div className="space-y-4">
          {institutes.slice(0, 5).map((institute) => (
            <div
              key={institute._id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    {institute.instituteName || "Unnamed institute"}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} className="text-green-600" />
                    <span>{institute.email || "No email provided"}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="rounded-full bg-blue-50 px-3 py-1 text-center font-medium text-blue-700">
                    {institute.students || 0} students
                  </p>
                  <p className="mt-2">
                    {institute.languages?.length || 0} languages
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(institute.languages || []).slice(0, 4).map((language) => (
                  <span
                    key={`${language.name}-${language.code}`}
                    className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700"
                  >
                    {language.name} ({language.code})
                  </span>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                {(institute.studentDetails || []).slice(0, 3).map((student) => (
                  <div
                    key={student._id}
                    className="flex flex-col gap-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between"
                  >
                    <span>
                      {student.firstName} {student.lastName}
                    </span>
                    <span>{student.email}</span>
                    <span>{student.preferredLanguage || "No language"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

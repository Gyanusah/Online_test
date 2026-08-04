import { useState, useEffect } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ProfileCard from "../../components/dashboard/ProfileCard";
import { Layers, Clock, Bell, Globe, BookOpen, FileText } from "lucide-react";
import { studentAPI, userAPI } from "../../utils/api";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    subscriptions: 0,
    completedExams: 0,
    notifications: 0,
    preferredLanguage: "English",
    recentActivity: [],
  });
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",
    location: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const user = response?.data?.data?.user;
      if (user) {
        setProfile(user);
        setStats((prev) => ({
          ...prev,
          preferredLanguage: user.preferredLanguage || prev.preferredLanguage,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await studentAPI.getDashboard();
      if (response.data.success) {
        setStats((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Student";

  const handleLanguageChange = async (event) => {
    const selectedLanguage = event.target.value;
    setStats((prev) => ({ ...prev, preferredLanguage: selectedLanguage }));
    try {
      await userAPI.updateProfile({ preferredLanguage: selectedLanguage });
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {fullName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your studies today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={Layers}
          title="Subscriptions"
          value={loading ? "..." : stats.subscriptions}
          description="Active subscriptions"
          color="blue"
        />
        <DashboardCard
          icon={Clock}
          title="Completed Exams"
          value={loading ? "..." : stats.completedExams}
          description="Finished exams"
          color="green"
        />
        <DashboardCard
          icon={Bell}
          title="Notifications"
          value={loading ? "..." : stats.notifications}
          description="Unread alerts"
          color="purple"
        />
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-2">
                Choose Language
              </p>
              <select
                value={stats.preferredLanguage}
                onChange={handleLanguageChange}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>Japanese</option>
                <option>French</option>
              </select>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <Globe size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    Started a new test
                  </p>
                  <p className="text-sm text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    Downloaded PDF notes
                  </p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    Reviewed study notes
                  </p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ProfileCard
            student={{
              name: fullName,
              studentId: profile.studentId,
              email: profile.email,
              phone: profile.phone,
              location: profile.location,
              joinDate: profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "Recent",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Calendar,
  Trophy,
  Bell,
  Settings,
  LogOut,
  CreditCard,
  BookOpen,
} from "lucide-react";

const StudentSidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/profile", icon: User, label: "My Profile" },
    {
      path: "/student/subscription",
      icon: CreditCard,
      label: "Subscription",
    },
    { path: "/student/results", icon: Trophy, label: "Results" },
    { path: "/student/notifications", icon: Bell, label: "Notifications" },
    { path: "/student/settings", icon: Settings, label: "Settings" },
  ];

  // Determine subscription status from stored user
  let user = null;
  try {
    user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  } catch (err) {
    user = null;
  }

  const hasActiveSubscription = (() => {
    if (!user) return false;
    if (user.subscriptionStatus === "active") return true;
    if (Array.isArray(user.subscribedLanguages)) {
      return user.subscribedLanguages.some((sub) => {
        if (!sub || !sub.status) return false;
        if (sub.status !== "active") return false;
        if (!sub.expiryDate) return true;
        return new Date(sub.expiryDate) > new Date();
      });
    }
    return false;
  })();

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">Student Portal</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {hasActiveSubscription && (
            <>
              <li>
                <Link
                  to="/student/all-tests"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/student/all-tests"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <BookOpen size={20} />
                  <span className="font-medium">All Tests</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/student/notes"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/student/notes"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <FileText size={20} />
                  <span className="font-medium">Notes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/student/vocabulary"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/student/vocabulary"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <BookOpen size={20} />
                  <span className="font-medium">Vocabulary</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;

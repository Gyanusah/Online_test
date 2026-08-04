import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  BarChart3,
  FileText,
  CreditCard,
  DollarSign,
  Bell,
} from "lucide-react";

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/institutes", icon: Building2, label: "Institutes" },
    { path: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { path: "/admin/revenue", icon: DollarSign, label: "Revenue" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/admin/reports", icon: FileText, label: "Reports" },
    { path: "/admin/notifications", icon: Bell, label: "Notifications" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-green-600">Admin Portal</h1>
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
                      ? "bg-green-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
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

export default AdminSidebar;

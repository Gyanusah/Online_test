import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Lock,
  Building,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { authAPI } from "../../utils/api";

const allowedRoles = ["student", "institute", "admin"];

const Login = () => {
  const navigate = useNavigate();
  const { role: routeRole } = useParams();
  const [role, setRole] = useState("student");

  useEffect(() => {
    if (routeRole && allowedRoles.includes(routeRole)) {
      setRole(routeRole);
    }
  }, [routeRole]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap, color: "blue" },
    { id: "institute", label: "Institute", icon: Building, color: "purple" },
    { id: "admin", label: "Admin", icon: Shield, color: "green" },
  ];

  const visibleRoles =
    routeRole && allowedRoles.includes(routeRole)
      ? roles.filter((r) => r.id === routeRole)
      : roles.filter((r) => r.id === "student");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({ ...formData, role });

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Store token and user in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate to respective dashboard based on role
        switch (role) {
          case "student":
            navigate("/student/dashboard");
            break;
          case "institute":
            navigate("/institute/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/student/dashboard");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {visibleRoles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                const colorClasses = {
                  blue: isSelected
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-600 hover:border-blue-600",
                  orange: isSelected
                    ? "bg-orange-600 border-orange-600 text-white"
                    : "border-gray-300 text-gray-600 hover:border-orange-600",
                  purple: isSelected
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "border-gray-300 text-gray-600 hover:border-purple-600",
                  green: isSelected
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300 text-gray-600 hover:border-green-600",
                };

                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${colorClasses[r.color]}`}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-medium">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Secure login powered by Role-Based Access Control</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

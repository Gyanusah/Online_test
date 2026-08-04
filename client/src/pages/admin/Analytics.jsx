import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Activity,
  CreditCard,
} from "lucide-react";
import { analyticsAPI } from "../../utils/api";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalInstitutes: 0,
    totalStudents: 0,
    totalTests: 0,
    totalExams: 0,
    activeSubscriptions: 0,
    pendingSubscriptions: 0,
    paidSubscriptions: 0,
    totalRevenue: 0,
    revenueRecords: [],
    recentInstitutes: [],
    recentTests: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsAPI.getAdminAnalytics();
        if (response.data.success) {
          setStats({ ...stats, ...response.data.analytics });
        }
      } catch (error) {
        console.error("Error fetching admin analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Live platform performance metrics from the database
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalStudents}
              </p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalInstitutes}
              </p>
              <p className="text-sm text-gray-500">Institutes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Activity className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalExams}
              </p>
              <p className="text-sm text-gray-500">Exams Taken</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-orange-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalTests}
              </p>
              <p className="text-sm text-gray-500">Tests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <CreditCard className="text-indigo-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.activeSubscriptions}
              </p>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.pendingSubscriptions}
              </p>
              <p className="text-sm text-gray-500">Pending Subscriptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : stats.totalRevenue}
              </p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Revenue
          </h2>
          <div className="space-y-3">
            {stats.revenueRecords.length === 0 ? (
              <p className="text-sm text-gray-500">No revenue records yet.</p>
            ) : (
              stats.revenueRecords.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {record.firstName} {record.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {record.phone || "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {record.subscriptionAmount}
                    </p>
                    <p className="text-sm text-gray-500">
                      {record.lastTransactionId || "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Institutes
          </h2>
          <div className="space-y-3">
            {stats.recentInstitutes.length === 0 ? (
              <p className="text-sm text-gray-500">No institutes found.</p>
            ) : (
              stats.recentInstitutes.map((institute) => (
                <div
                  key={institute._id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {institute.instituteName}
                    </p>
                    <p className="text-sm text-gray-500">{institute.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(institute.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

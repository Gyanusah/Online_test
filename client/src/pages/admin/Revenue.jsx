import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Phone, Building2 } from "lucide-react";
import { adminAPI } from "../../utils/api";

const Revenue = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await adminAPI.getAnalytics();
        setRecords(response?.data?.data?.revenueRecords || []);
      } catch (error) {
        console.error("Error fetching revenue records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Revenue Details
        </h1>
        <p className="text-gray-600">
          All subscription payment records from the database
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Subscription Payments
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading revenue records...</div>
        ) : records.length === 0 ? (
          <div className="p-6 text-gray-600">No revenue records found.</div>
        ) : (
          <div className="divide-y">
            {records.map((record, index) => (
              <div
                key={index}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {record.firstName} {record.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone size={14} /> {record.phone || "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 size={14} />{" "}
                        {record.institute?.instituteName ||
                          record.instituteName ||
                          "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <CreditCard size={16} /> {record.subscriptionAmount || 0}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Transaction: {record.lastTransactionId || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Paid:{" "}
                    {record.lastPaymentAt
                      ? new Date(record.lastPaymentAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Revenue;

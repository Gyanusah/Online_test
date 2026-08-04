import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock3, CreditCard } from "lucide-react";
import { adminAPI } from "../../utils/api";

const SubscriptionRequests = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [amountInputs, setAmountInputs] = useState({});

  const fetchSubscriptions = async () => {
    try {
      const response = await adminAPI.getSubscriptionRequests();
      setSubscriptions(response?.data?.data?.subscriptions || []);
    } catch (error) {
      console.error("Error fetching subscription requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAmountChange = (studentId, value) => {
    setAmountInputs((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleDecision = async (studentId, action) => {
    try {
      const payload = { action };
      if (action === "approve") {
        const amountValue = amountInputs[studentId];
        if (amountValue !== "" && amountValue !== undefined) {
          payload.amount = Number(amountValue);
        }
      }

      const response = await adminAPI.approveSubscription(studentId, payload);
      setMessage({
        type: "success",
        text: response?.data?.message || "Subscription updated",
      });
      await fetchSubscriptions();
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Unable to update subscription",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Subscription Requests
        </h1>
        <p className="text-gray-600">
          Review and approve student subscription requests.
        </p>
      </div>

      {message.text && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading requests...</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-6 text-gray-600">
            No subscription requests found.
          </div>
        ) : (
          <div className="divide-y">
            {subscriptions.map((student) => (
              <div
                key={student._id}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Phone: {student.phone || "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Institute:{" "}
                      {student.institute?.instituteName ||
                        student.instituteName ||
                        "-"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested amount: {student.subscriptionAmount || 800} ·
                      Status: {student.subscriptionStatus}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="600"
                        max="800"
                        value={
                          amountInputs[student._id] ??
                          student.subscriptionAmount ??
                          800
                        }
                        onChange={(event) =>
                          handleAmountChange(student._id, event.target.value)
                        }
                        className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Referral discount: {student.referralDiscountAmount || 0}
                    </p>
                    {student.lastTransactionId && (
                      <p className="text-sm text-gray-500">
                        Transaction ID: {student.lastTransactionId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {student.subscriptionStatus === "pending" ? (
                    <>
                      <button
                        onClick={() => handleDecision(student._id, "approve")}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleDecision(student._id, "reject")}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  ) : (
                    <div
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${student.subscriptionStatus === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {student.subscriptionStatus === "active" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Clock3 size={16} />
                      )}
                      {student.subscriptionStatus}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionRequests;

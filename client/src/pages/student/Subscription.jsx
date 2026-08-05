import { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI, studentAPI, testAPI } from "../../utils/api";

const MIN_AMOUNT = 600;
const MAX_AMOUNT = 800;

const Subscription = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({
    referralCode: "",
    amount: "800",
    language: "",
    languageId: "",
  });
  const [subscription, setSubscription] = useState({
    subscriptionStatus: "none",
    subscriptionAmount: 800,
    subscriptionExpiresAt: null,
    subscriptionRequestedAt: null,
    referralDiscountAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [paymentStep, setPaymentStep] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const fetchSubscription = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const user = response?.data?.data?.user;

      if (user) {
        setSubscription({
          subscriptionStatus: user.subscriptionStatus || "none",
          subscriptionAmount: user.subscriptionAmount || 800,
          subscriptionExpiresAt: user.subscriptionExpiresAt || null,
          subscriptionRequestedAt: user.subscriptionRequestedAt || null,
          referralDiscountAmount: user.referralDiscountAmount || 0,
        });
        setFormData((prev) => ({
          ...prev,
          amount: String(user.subscriptionAmount || 800),
          language: user.preferredLanguage || prev.language || "",
          languageId: prev.languageId || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await testAPI.getLanguages();
      setLanguages(
        response?.data?.data?.languages || response?.data?.languages || [],
      );
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  useEffect(() => {
    fetchSubscription();
    fetchLanguages();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await studentAPI.requestSubscription({
        referralCode: formData.referralCode.trim(),
        amount: Number(formData.amount) || 800,
        languageId: formData.languageId || undefined,
        language: formData.language || undefined,
      });

      const updatedUser = response?.data?.data?.user;
      setSubscription((prev) => ({
        ...prev,
        subscriptionStatus: updatedUser?.subscriptionStatus || "pending",
        subscriptionAmount:
          updatedUser?.subscriptionAmount || Number(formData.amount) || 800,
        subscriptionRequestedAt:
          updatedUser?.subscriptionRequestedAt || new Date().toISOString(),
        referralDiscountAmount: updatedUser?.referralDiscountAmount || 0,
      }));

      setMessage({
        type: "success",
        text:
          response?.data?.message ||
          "Subscription request submitted successfully. Please complete payment to activate it.",
      });
      setPaymentStep(true);
      setTransactionId(`ESW-${Date.now()}`);
      setFormData({
        referralCode: "",
        amount: String(updatedUser?.subscriptionAmount || 800),
        language: updatedUser?.preferredLanguage || formData.language || "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Unable to submit subscription request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEsewaPayment = async () => {
    setPaying(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await studentAPI.paySubscription({
        transactionId,
        paymentMethod: "esewa",
      });

      const checkoutUrl = response?.data?.data?.checkoutUrl;
      const paymentConfirmed = response?.data?.data?.paymentConfirmed;

      if (!paymentConfirmed && checkoutUrl) {
        window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      }

      if (paymentConfirmed) {
        await fetchSubscription();
        setMessage({
          type: "success",
          text:
            response?.data?.message ||
            "Sandbox payment completed. Your subscription is now active.",
        });
        setPaymentStep(false);
        setTimeout(() => navigate("/student/all-tests"), 1500);
        return;
      }

      setMessage({
        type: "success",
        text: "The eSewa checkout page has been opened. Complete the payment and return here to confirm it.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Payment could not be completed.",
      });
    } finally {
      setPaying(false);
    }
  };

  const getStatusDetails = () => {
    switch (subscription.subscriptionStatus) {
      case "active":
        return {
          label: "Active",
          color: "bg-green-100 text-green-700",
          icon: CheckCircle2,
          text: "Your subscription is active and you can take tests.",
        };
      case "pending":
        return {
          label: "Pending",
          color: "bg-yellow-100 text-yellow-700",
          icon: Clock3,
          text: "Your subscription request is pending. Complete the eSewa payment to activate it.",
        };
      default:
        return {
          label: "Not Active",
          color: "bg-gray-100 text-gray-700",
          icon: AlertCircle,
          text: "A valid subscription is required before applying for tests.",
        };
    }
  };

  const statusInfo = getStatusDetails();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription</h1>
        <p className="text-gray-600">
          Subscribe once for one month of test access. After the month ends, you
          will need to request a new subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Request a new subscription
              </h2>
              <p className="text-sm text-gray-500">
                Amount must be between {MIN_AMOUNT} and {MAX_AMOUNT}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly subscription amount
              </label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 font-medium">
                ₹{formData.amount}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This amount is fixed by the admin for your one-month
                subscription.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={formData.languageId}
                onChange={(event) => {
                  const selected = languages.find(
                    (lang) => lang._id === event.target.value,
                  );
                  setFormData((prev) => ({
                    ...prev,
                    languageId: event.target.value,
                    language: selected?.name || "",
                    amount: String(selected?.subscriptionAmount || prev.amount),
                  }));
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a language</option>
                {languages.map((lang) => (
                  <option key={lang._id} value={lang._id}>
                    {lang.name} ({lang.code}) - ₹
                    {lang.subscriptionAmount || 800}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Choose the language you want to subscribe to.
              </p>
              {languages.length === 0 && (
                <p className="text-xs text-red-500 mt-2">
                  No languages available yet. Contact support or try again
                  later.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Code
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    referralCode: event.target.value,
                  }))
                }
                placeholder="Enter referral code if available"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                A valid referral can reduce the amount by 100.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !formData.languageId}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Subscription Request"}
            </button>
          </form>

          {paymentStep && (
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={18} className="text-blue-600" />
                <h3 className="font-semibold text-blue-700">Pay with eSewa</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Complete the payment using eSewa with the transaction ID below,
                then verify the payment to activate your subscription.
              </p>
              <div className="space-y-3">
                <div className="rounded-lg bg-white p-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Merchant</span>
                    <span className="font-semibold">SkillTest Nepal</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Amount</span>
                    <span className="font-semibold">
                      {formData.amount || subscription.subscriptionAmount}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Transaction ID</span>
                    <span className="font-semibold">{transactionId}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleEsewaPayment}
                  disabled={paying}
                  className="w-full rounded-lg bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {paying ? "Opening checkout..." : "Pay with eSewa"}
                </button>
              </div>
            </div>
          )}

          {message.text && (
            <div
              className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${statusInfo.color}`}>
              <StatusIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current status</p>
              <p className="font-semibold text-gray-800">{statusInfo.label}</p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            {loading ? "Loading subscription status..." : statusInfo.text}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Requested amount</span>
              <span className="font-medium text-gray-800">
                {subscription.subscriptionAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Referral discount</span>
              <span className="font-medium text-gray-800">
                {subscription.referralDiscountAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Expiry</span>
              <span className="font-medium text-gray-800">
                {subscription.subscriptionExpiresAt
                  ? new Date(
                      subscription.subscriptionExpiresAt,
                    ).toLocaleDateString()
                  : "Pending approval"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700 flex items-start gap-2">
            <Sparkles size={18} className="mt-0.5" />
            <span>
              Each approved subscription gives you one month of test access.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { testAPI, studentAPI } from "../utils/api";

const LanguageDetails = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [subscriptionRequested, setSubscriptionRequested] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await testAPI.getLanguageById(languageId);
        setLanguage(response?.data?.data?.language || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load language details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguage();
  }, [languageId]);

  const handleSubscribe = async () => {
    if (!language) return;
    setRequesting(true);
    setMessage(null);

    try {
      const response = await studentAPI.requestSubscription({
        languageId: language._id,
        amount: language.subscriptionAmount,
      });

      setSubscriptionRequested(true);
      setMessage({
        type: "success",
        text:
          response?.data?.message ||
          "Subscription request submitted. Please complete payment to activate.",
      });
      setTimeout(() => {
        navigate("/student/subscription");
      }, 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to submit subscription request.",
      });
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading language details...</p>
        </div>
      </div>
    );
  }

  if (!language || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error || "Language not found."}</p>
          <button
            onClick={() => navigate("/languages")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Back to languages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8 px-6 lg:px-16">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-blue-50 p-4 text-blue-600">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-700">
                  Language
                </p>
                <h1 className="text-4xl font-bold text-gray-900">
                  {language.name}
                </h1>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {language.description ||
                "Subscribe to this language to unlock tests and the student dashboard."}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 p-6">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {language.duration || "1 Month"}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 p-6">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  ₹{language.subscriptionAmount || 800}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Institute</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {language.instituteName || "Language Institute"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-100">
                Subscription
              </p>
              <h2 className="mt-4 text-3xl font-bold">Unlock access</h2>
            </div>
            <div className="rounded-3xl bg-white/15 p-3">
              <CreditCard size={24} />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-blue-500/20 p-5">
              <p className="text-sm text-blue-100">Includes</p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>Unlimited course access for 30 days</li>
                <li>Tests in this language</li>
                <li>Personalized dashboards</li>
                <li>Study resources and practice materials</li>
              </ul>
            </div>

            {message && (
              <div
                className={`rounded-2xl p-4 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              disabled={requesting || subscriptionRequested}
              onClick={handleSubscribe}
              className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {subscriptionRequested ? (
                <>
                  <CheckCircle2 size={18} />
                  Request sent
                </>
              ) : (
                "Subscribe now"
              )}
            </button>

            <button
              onClick={() => navigate("/student/subscription")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View subscription status
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDetails;

import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, BookOpen, Calendar, User, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../../utils/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AllTests = () => {
  const [tests, setTests] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [subscribedLanguages, setSubscribedLanguages] = useState([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const currentUser = JSON.parse(storedUser);
        const activeLanguages = new Set();

        if (Array.isArray(currentUser.subscribedLanguages)) {
          currentUser.subscribedLanguages.forEach((sub) => {
            if (!sub || !sub.status) return;
            if (sub.status !== "active") return;
            if (sub.expiryDate && new Date(sub.expiryDate) <= new Date())
              return;
            if (sub.language) activeLanguages.add(sub.language);
            if (sub.languageName) activeLanguages.add(sub.languageName);
            if (sub.name) activeLanguages.add(sub.name);
          });
        }

        if (currentUser.subscriptionStatus === "active") {
          if (currentUser.preferredLanguage) {
            activeLanguages.add(currentUser.preferredLanguage);
          }
        }

        const subscribedLangs = Array.from(activeLanguages);
        setSubscribedLanguages(subscribedLangs);
        if (!selectedLanguage && subscribedLangs.length > 0) {
          setSelectedLanguage(subscribedLangs[0]);
        }
        setHasActiveSubscription(
          subscribedLangs.length > 0 ||
            currentUser.subscriptionStatus === "active",
        );
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }

    fetchAllTests();
  }, []);

  const normalizeLanguageName = (language) =>
    String(language || "")
      .trim()
      .toLowerCase();

  const fetchAllTests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/students/all-tests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const serverTests = response.data.data.tests || [];
      setTests(serverTests);

      if (subscribedLanguages.length === 0 && serverTests.length > 0) {
        const uniqueLanguages = Array.from(
          new Set(
            serverTests
              .map((test) => String(test.language || "").trim())
              .filter(Boolean),
          ),
        );
        setSubscribedLanguages(uniqueLanguages);
        if (!selectedLanguage && uniqueLanguages.length > 0) {
          setSelectedLanguage(uniqueLanguages[0]);
        }
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load tests");
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    try {
      console.log("Starting test with ID:", testId);

      const { data: response } = await studentAPI.startExam({ testId });

      console.log("Exam start response:", response);

      if (response.success) {
        const applicationId = response.exam?.application || testId;
        navigate(`/student/exam/${applicationId}`);
      } else {
        alert(response.message || "Failed to start test");
      }
    } catch (err) {
      console.error("Error starting test:", err);
      console.error("Error response:", err.response?.data);
      alert(
        `Failed to start test: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  const normalizedSubscribedLanguages = new Set(
    subscribedLanguages
      .map((language) => normalizeLanguageName(language))
      .filter(Boolean),
  );

  const availableTests = tests.filter((test) => {
    const normalizedTestLanguage = normalizeLanguageName(test.language);
    return normalizedSubscribedLanguages.has(normalizedTestLanguage);
  });

  const filteredTests = selectedLanguage
    ? availableTests.filter(
        (test) =>
          normalizeLanguageName(test.language) ===
          normalizeLanguageName(selectedLanguage),
      )
    : availableTests;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          All Available Tests
        </h1>
        <p className="text-gray-600">Browse and start available tests</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-600">Filter tests by language:</p>
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full sm:w-auto border rounded-lg px-4 py-2 text-gray-700"
        >
          <option value="">All subscribed languages</option>
          {subscribedLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      {!hasActiveSubscription ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Active Subscription
          </h3>
          <p className="text-gray-500 mb-4">
            You need an active subscription to access tests. Subscribe to a
            language and activate your plan.
          </p>
          <button
            onClick={() => navigate("/student/subscription")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Subscription
          </button>
        </div>
      ) : availableTests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Tests Available
          </h3>
          <p className="text-gray-500 mb-4">
            There are currently no tests available for your subscribed
            language(s). Please check back later or contact support.
          </p>
          <button
            onClick={() => navigate("/student/subscription")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Manage Subscription
          </button>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Tests Available
            {selectedLanguage ? ` for ${selectedLanguage}` : ""}
          </h3>
          <p className="text-gray-500 mb-4">
            There are no tests available in the selected language. Please choose
            a different subscribed language.
          </p>
          <button
            onClick={() => setSelectedLanguage("")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Show All Subscribed Languages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {test.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{test.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen size={16} />
                    <span>
                      {test.totalQuestions ?? test.questions?.length ?? 0}{" "}
                      questions
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>
                      {test.institute?.instituteName ||
                        test.institute?.name ||
                        "Unknown Institute"}
                    </span>
                  </div>
                  {test.language && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {test.language}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartTest(test._id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play size={16} />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTests;

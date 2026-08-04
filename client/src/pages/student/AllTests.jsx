import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, BookOpen, Calendar, User, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../../utils/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AllTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTests();
  }, []);

  const fetchAllTests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/students/all-tests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTests(response.data.data.tests);
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

      {tests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Tests Available
          </h3>
          <p className="text-gray-500">
            There are no tests available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
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

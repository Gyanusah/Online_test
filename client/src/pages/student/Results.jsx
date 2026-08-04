import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { studentAPI } from "../../utils/api";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await studentAPI.getResults();
        const examResults = response?.data?.data?.results || [];
        setResults(examResults);
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const mappedResults = useMemo(
    () =>
      results.map((result) => {
        const percentage = Number(result.percentage ?? result.score ?? 0);
        const grade =
          percentage >= 90
            ? "A+"
            : percentage >= 80
              ? "A"
              : percentage >= 70
                ? "B+"
                : percentage >= 60
                  ? "B"
                  : percentage >= 50
                    ? "C"
                    : "F";

        return {
          id: result._id,
          testId: result.test?._id,
          course: result.test?.title || result.testTitle || "Test",
          score: Math.round(percentage),
          grade,
          totalMarks: result.test?.totalMarks || result.totalMarks || 0,
          semester: result.test?.level || "Current",
          status:
            result.passed || result.passingMarks === 0 ? "Passed" : "Failed",
          submittedAt: result.submittedAt,
          answerBreakdown: result.answerBreakdown || [],
        };
      }),
    [results],
  );

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleOpenReview = (testId, testTitle) => {
    setSelectedTest({ id: testId, title: testTitle });
    setReviewData({ rating: 5, comment: "" });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      await studentAPI.submitReview({
        testId: selectedTest.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReviewModal(false);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const averageScore = mappedResults.length
    ? Math.round(
        mappedResults.reduce((acc, r) => acc + r.score, 0) /
          mappedResults.length,
      )
    : 0;
  const passedCourses = mappedResults.filter(
    (r) => r.status === "Passed",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Results</h1>
        <p className="text-gray-600">View your latest exam performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Trophy className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {averageScore}%
              </p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Award className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {passedCourses}/{mappedResults.length || 0}
              </p>
              <p className="text-sm text-gray-500">Tests Passed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {mappedResults.length}
              </p>
              <p className="text-sm text-gray-500">Total Attempts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <TrendingDown className="text-orange-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {mappedResults.length ? "Live" : "—"}
              </p>
              <p className="text-sm text-gray-500">Result Source</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Exam Results</h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading your results...</div>
        ) : mappedResults.length === 0 ? (
          <div className="p-6 text-gray-600">
            No submitted exams yet. Complete an exam to see your scores here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mappedResults.map((result) => (
                  <Fragment key={result.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-bold ${getScoreColor(result.score)}`}
                        >
                          {result.score}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}
                        >
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.totalMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${result.status === "Passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenReview(result.testId || result.test?._id, result.course)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <Star size={14} />
                          Review
                        </button>
                      </td>
                    </tr>
                    {result.answerBreakdown.length > 0 && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-3">
                            <div className="text-sm font-semibold text-gray-700">
                              Answer Review
                            </div>
                            {result.answerBreakdown.map((item, index) => (
                              <div
                                key={`${result.id}-${index}`}
                                className="rounded-lg border border-gray-200 bg-white p-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {index + 1}. {item.questionText}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                      Your answer:{" "}
                                      {String(
                                        item.selectedAnswer ?? "Not answered",
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Correct answer:{" "}
                                      {String(
                                        item.correctAnswer ?? "Not available",
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {item.isCorrect ? (
                                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        <CheckCircle2 size={14} /> Correct
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                        <XCircle size={14} /> Wrong
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Review: {selectedTest?.title}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={star <= reviewData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;

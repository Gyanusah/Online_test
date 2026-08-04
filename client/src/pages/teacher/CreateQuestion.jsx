import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Plus, Trash2, Copy, AlertCircle } from "lucide-react";
import { teacherAPI } from "../../utils/api"; // adjust path to match your project

const MAX_QUESTIONS = 50;

const difficulties = ["easy", "medium", "hard"];
const languages = [
  "Japanese",
  "English",
  "German",
  "Korean",
  "Chinese",
  "IELTS",
];

const emptyQuestion = () => ({
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  marks: 1,
  difficulty: "medium",
  language: "",
  level: "",
});

const CreateQuestion = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [selectedTest, setSelectedTest] = useState(testId || "");
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // { [index]: message }

  // ---------- helpers to update a single question ----------

  const updateQuestion = (index, patch) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const options = [...next[qIndex].options];
      options[optIndex] = value;
      next[qIndex] = { ...next[qIndex], options };
      return next;
    });
  };

  const addOption = (qIndex) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = {
        ...next[qIndex],
        options: [...next[qIndex].options, ""],
      };
      return next;
    });
  };

  const removeOption = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = {
        ...next[qIndex],
        options: next[qIndex].options.filter((_, i) => i !== optIndex),
      };
      return next;
    });
  };

  // ---------- add / remove / duplicate whole questions ----------

  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return;
    setQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const addMany = (count) => {
    setQuestions((prev) => {
      const room = MAX_QUESTIONS - prev.length;
      const toAdd = Math.min(count, room);
      if (toAdd <= 0) return prev;
      return [...prev, ...Array.from({ length: toAdd }, emptyQuestion)];
    });
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const duplicateQuestion = (index) => {
    if (questions.length >= MAX_QUESTIONS) return;
    setQuestions((prev) => {
      const copy = JSON.parse(JSON.stringify(prev[index]));
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  // ---------- validation ----------

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await teacherAPI.getTests();
        setTests(response.data.tests || []);
      } catch (err) {
        console.error("Unable to load tests for question creation:", err);
      }
    };

    if (!testId) {
      fetchTests();
    }
  }, [testId]);

  const validateAll = () => {
    const errors = {};

    questions.forEach((q, i) => {
      if (!q.question.trim()) {
        errors[i] = "Question text is required";
        return;
      }
      if (!q.language) {
        errors[i] = "Language is required";
        return;
      }
      if (q.type === "mcq") {
        const validOptions = q.options.filter((opt) => opt.trim());
        if (validOptions.length < 2) {
          errors[i] = "At least 2 options are required";
          return;
        }
        if (q.correctAnswer === "" || q.correctAnswer === undefined) {
          errors[i] = "Select the correct answer";
          return;
        }
      }
      if (!q.marks || q.marks <= 0) {
        errors[i] = "Marks must be greater than 0";
        return;
      }
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError(
        `${Object.keys(errors).length} question(s) have errors. Fix the highlighted questions before saving.`,
      );
      return false;
    }

    setError("");
    return true;
  };

  // ---------- submit all questions in one request ----------

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (questions.length === 0) {
      setError("Add at least one question before saving.");
      return;
    }

    if (!validateAll()) return;

    const resolvedTestId = testId || selectedTest;

    if (!resolvedTestId) {
      setError("Select a test before saving questions.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        testId: resolvedTestId,
        questions: questions.map((q, index) => ({
          test: resolvedTestId,
          language: q.language,
          type: q.type,
          question: q.question,
          marks: q.marks,
          difficulty: q.difficulty,
          explanation: q.explanation,
          correctAnswer: Number(q.correctAnswer),
          options: q.options.map((option, optIndex) => ({
            text: option,
            isCorrect: Number(q.correctAnswer) === optIndex,
          })),
          order: index + 1,
          tags: q.language ? [q.language] : [],
        })),
      };

      const response = await teacherAPI.createQuestionsBulk(payload);

      console.log(response.data);

      setSuccess(true);
      setTimeout(() => {
        navigate("/teacher/question-bank");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error saving questions. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("institute/question-bank")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Question Bank</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Create Questions in Bulk
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add up to {MAX_QUESTIONS} questions and save them all at once.
            </p>
          </div>

          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
            {questions.length} / {MAX_QUESTIONS} questions
          </div>
        </div>

        {/* Success Notification */}
        {success && (
          <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
            {questions.length} question(s) created successfully! Redirecting...
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-6 flex items-start gap-2 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!testId && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Test *
            </label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a test</option>
              {tests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmitAll}>
          {/* Quick add controls */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={addQuestion}
              disabled={questions.length >= MAX_QUESTIONS}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add 1 Question
            </button>
            <button
              type="button"
              onClick={() => addMany(5)}
              disabled={questions.length >= MAX_QUESTIONS}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + 5 Questions
            </button>
            <button
              type="button"
              onClick={() => addMany(10)}
              disabled={questions.length >= MAX_QUESTIONS}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + 10 Questions
            </button>
            <button
              type="button"
              onClick={() =>
                addMany(MAX_QUESTIONS - questions.length > 0 ? 50 : 0)
              }
              disabled={questions.length >= MAX_QUESTIONS}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fill up to {MAX_QUESTIONS}
            </button>
          </div>

          {/* Question cards */}
          <div className="space-y-6">
            {questions.map((q, index) => {
              const hasError = Boolean(fieldErrors[index]);
              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 ${
                    hasError
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Question {index + 1}
                    </h2>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(index)}
                        disabled={questions.length >= MAX_QUESTIONS}
                        title="Duplicate this question"
                        className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-40"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        disabled={questions.length === 1}
                        title="Remove this question"
                        className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {hasError && (
                    <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                      {fieldErrors[index]}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language *
                      </label>
                      <select
                        value={q.language}
                        onChange={(e) =>
                          updateQuestion(index, { language: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Language</option>
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Level
                      </label>
                      <input
                        type="text"
                        value={q.level}
                        onChange={(e) =>
                          updateQuestion(index, { level: e.target.value })
                        }
                        placeholder="e.g., N5, A1, B2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Text *
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(index, { question: e.target.value })
                      }
                      rows={2}
                      placeholder="Enter your question here..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* MCQ Options */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Options * (select the correct one)
                    </label>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correctAnswer-${index}`}
                            value={optIndex}
                            checked={q.correctAnswer === optIndex.toString()}
                            onChange={(e) =>
                              updateQuestion(index, {
                                correctAnswer: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(index, optIndex, e.target.value)
                            }
                            placeholder={`Option ${optIndex + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optIndex)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Plus size={16} />
                      Add Option
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Marks *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={q.marks}
                        onChange={(e) =>
                          updateQuestion(index, {
                            marks: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={q.difficulty}
                        onChange={(e) =>
                          updateQuestion(index, { difficulty: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {difficulties.map((diff) => (
                          <option key={diff} value={diff}>
                            {diff}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={q.explanation}
                      onChange={(e) =>
                        updateQuestion(index, { explanation: e.target.value })
                      }
                      rows={2}
                      placeholder="Explain the correct answer..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="sticky bottom-0 mt-8 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 py-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving {questions.length} question(s)...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save All {questions.length} Question(s)</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("institute/question-bank")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;

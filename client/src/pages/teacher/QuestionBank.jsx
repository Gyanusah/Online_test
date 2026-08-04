import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { teacherAPI } from "../../utils/api";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const questionTypes = [
    "MCQ",
    "True/False",
    "Fill in Blanks",
    "Matching",
    "Reading Comprehension",
    "Listening",
    "Speaking",
    "Writing",
  ];

  const languages = [
    "Japanese",
    "English",
    "IELTS",
    "German",
    "Korean",
    "Chinese",
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await teacherAPI.getAllQuestions();
      setQuestions(response?.data?.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      setActionLoading(true);
      await teacherAPI.deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
      setActionError(
        error?.response?.data?.message || "Unable to delete question.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (question) => {
    setSelectedQuestion({ ...question });
    setActionError("");
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedQuestion) return;

    try {
      setActionLoading(true);
      const payload = {
        type: selectedQuestion.type,
        question: selectedQuestion.question,
        difficulty: selectedQuestion.difficulty,
        language: selectedQuestion.language,
        level: selectedQuestion.level,
        marks: selectedQuestion.marks,
        explanation: selectedQuestion.explanation || "",
        options: selectedQuestion.options || [],
      };

      const response = await teacherAPI.updateQuestion(
        selectedQuestion._id,
        payload,
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q._id === selectedQuestion._id ? response.data.question : q,
        ),
      );
      setShowEditModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Error updating question:", error);
      setActionError(
        error?.response?.data?.message || "Unable to update question.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedQuestion(null);
    setShowEditModal(false);
    setActionError("");
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || q.type === filterType;
    const matchesLanguage =
      filterLanguage === "all" || q.language === filterLanguage;
    return matchesSearch && matchesType && matchesLanguage;
  });

  const getTypeColor = (type) => {
    const colors = {
      MCQ: "bg-blue-100 text-blue-700",
      // "True/False": "bg-green-100 text-green-700",
      // "Fill in Blanks": "bg-yellow-100 text-yellow-700",
      // Matching: "bg-purple-100 text-purple-700",
      // "Reading Comprehension": "bg-pink-100 text-pink-700",
      // Listening: "bg-orange-100 text-orange-700",
      // Speaking: "bg-red-100 text-red-700",
      // Writing: "bg-indigo-100 text-indigo-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      hard: "bg-red-100 text-red-700",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };
  const navigate = useNavigate();
  // const setShowAddModal = () => {
  //   navigate("../teacher/CreateQuestion");
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-1">
            Manage your question bank for different tests
          </p>
        </div>
        <button
          //onClick={() => setShowAddModal(true)}
          onClick={() => navigate("/institute/create-question")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Questions ({filteredQuestions.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}
                    >
                      {question.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {question.language} - {question.level}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {question.question}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Marks: {question.marks}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(question)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question._id)}
                    disabled={actionLoading}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Filter size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No questions found</p>
              <p className="text-sm">
                Try adjusting your filters or add new questions
              </p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && selectedQuestion && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Question
                </h2>
                <p className="text-sm text-gray-500">
                  Update the question details and save your changes.
                </p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-500 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  rows={3}
                  value={selectedQuestion.question}
                  onChange={(e) => handleEditChange("question", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={selectedQuestion.type}
                    onChange={(e) => handleEditChange("type", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {questionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedQuestion.language}
                    onChange={(e) =>
                      handleEditChange("language", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <input
                    value={selectedQuestion.level || ""}
                    onChange={(e) => handleEditChange("level", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. N5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuestion.marks || ""}
                    onChange={(e) => handleEditChange("marks", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedQuestion.difficulty}
                    onChange={(e) =>
                      handleEditChange("difficulty", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation
                </label>
                <textarea
                  rows={3}
                  value={selectedQuestion.explanation || ""}
                  onChange={(e) =>
                    handleEditChange("explanation", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {actionError && (
                <p className="text-sm text-red-600">{actionError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {/* {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Question
              </h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {questionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your question..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Level</option>
                      <option value="N5">N5</option>
                      <option value="N4">N4</option>
                      <option value="N3">N3</option>
                      <option value="N2">N2</option>
                      <option value="N1">N1</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Add question functionality to be implemented");
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuestionBank;

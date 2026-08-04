import { useState } from "react";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { teacherAPI } from "../../utils/api";

const CreateTest = () => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    language: "",
    level: "",
    duration: "",
    totalQuestions: "",
    totalMarks: "",
    passingMarks: "",
    instructions: "",
    startDate: "",
    endDate: "",
    requiresApproval: false,
    maxAttempts: 1,
    fee: 0,
    tags: [],
  });

  const [errors, setErrors] = useState({});

  const languages = [
    "Japanese",
    "English",
    "IELTS",
    "German",
    "Korean",
    "Chinese",
  ];

  const levels = {
    Japanese: ["N5", "N4", "N3", "N2", "N1"],
    English: ["Beginner", "Intermediate", "Advanced"],
    IELTS: ["Academic", "General Training"],
    German: ["A1", "A2", "B1", "B2", "C1"],
    Korean: ["TOPIK I", "TOPIK II"],
    Chinese: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.code.trim()) newErrors.code = "Code is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.level) newErrors.level = "Level is required";
    if (!formData.duration || formData.duration <= 0)
      newErrors.duration = "Valid duration is required";
    if (!formData.totalQuestions || formData.totalQuestions <= 0)
      newErrors.totalQuestions = "Valid number is required";
    if (!formData.totalMarks || formData.totalMarks <= 0)
      newErrors.totalMarks = "Valid number is required";
    if (!formData.passingMarks || formData.passingMarks <= 0)
      newErrors.passingMarks = "Valid number is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await teacherAPI.createTest(formData);
      console.log(res.data);
      console.log("Test created:", formData);
      alert("Test created successfully!");
    } catch (error) {
      console.error("Error creating test:", error);
      const serverMessage = error.response?.data?.message;
      alert(
        serverMessage
          ? `Error creating test: ${serverMessage}`
          : "Error creating test. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/teacher"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
          <p className="text-gray-600 mt-1">
            Create a new language test for students
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
      >
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., JLPT N5 Practice Test"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                  errors.code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., JLPT-N5-001"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language *
              </label>
              {/* <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.language ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select> */}
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Language</option>

                {languages.map((lang, index) => (
                  <option key={`${lang}-${index}`} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="text-red-500 text-sm mt-1">{errors.language}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={!formData.language}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.level ? "border-red-500" : "border-gray-300"
                } ${!formData.language ? "bg-gray-100" : ""}`}
              >
                <option value="">Select Level</option>
                {formData.language &&
                  levels[formData.language]?.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
              </select>
              {errors.level && (
                <p className="text-red-500 text-sm mt-1">{errors.level}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide a brief description of the test..."
            />
          </div>
        </div>

        {/* Test Configuration */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Test Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., 60"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Questions *
              </label>
              <input
                type="number"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalQuestions ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., 50"
              />
              {errors.totalQuestions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalQuestions}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks *
              </label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalMarks ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., 100"
              />
              {errors.totalMarks && (
                <p className="text-red-500 text-sm mt-1">{errors.totalMarks}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Marks *
              </label>
              <input
                type="number"
                name="passingMarks"
                value={formData.passingMarks}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.passingMarks ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., 60"
              />
              {errors.passingMarks && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passingMarks}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attempts
              </label>
              <input
                type="number"
                name="maxAttempts"
                value={formData.maxAttempts}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee
              </label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide instructions for students taking this test..."
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="requiresApproval"
              checked={formData.requiresApproval}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Require approval for applications
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            <span>Save Test</span>
          </button>
          <button
            type="button"
            onClick={() =>
              console.log("Preview functionality to be implemented")
            }
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={20} />
            <span>Preview</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;

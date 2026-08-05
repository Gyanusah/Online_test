import { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  X,
} from "lucide-react";
import { instituteAPI } from "../../utils/api";

const Courses = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [level, setLevel] = useState("Beginner");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [passingMarks, setPassingMarks] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseMaterial, setCourseMaterial] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const apiBaseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/api\/?$/, "");

  const resetCourseForm = () => {
    setTitle("");
    setPrice(0);
    setLevel("Beginner");
  };

  const handleCourseMaterialChange = (event) => {
    const file = event.target.files?.[0];
    setCourseMaterial(file || null);
  };

  const handleAddCourse = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", Number(price) || 0);
      formData.append("level", level);

      const response = await instituteAPI.createCourse(formData);
      if (response.data.success) {
        setCourses((prev) => [response.data.data.course, ...prev]);
        setShowAddModal(false);
        resetCourseForm();
      }
    } finally {
      setLoading(false);
    }
  };

  const courseList = Array.isArray(courses) ? courses : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Archived":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Courses</h1>
          <p className="text-gray-600">Manage your institute's courses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courseList.length}
              </p>
              <p className="text-sm text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courseList.reduce(
                  (acc, c) =>
                    acc + Number(c.students ?? c.enrolledStudents ?? 0),
                  0,
                )}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Clock className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {
                  courseList.filter(
                    (c) => c.isPublished || c.status === "Active",
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Active Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-orange-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {
                  new Set(
                    courseList.flatMap((course) => {
                      if (Array.isArray(course.tags)) return course.tags;
                      if (course.category) return [course.category];
                      return [];
                    }),
                  ).size
                }
              </p>
              <p className="text-sm text-gray-500">Categories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">All Courses</h2>
        </div>

        {courseList.length === 0 ? (
          <div className="p-8">
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses available yet
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Create your first course to start inviting students and sharing
                valuable learning material.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Add First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
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
                {courseList.map((course) => {
                  const courseStatus = course.isPublished ? "Active" : "Draft";
                  const courseCategory = Array.isArray(course.tags)
                    ? course.tags[0]
                    : course.category ||
                      (typeof course.tags === "string"
                        ? course.tags
                        : "General");
                  const courseTitle = course.title || "Untitled course";

                  return (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <GraduationCap
                              size={20}
                              className="text-purple-600"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {courseTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {courseCategory || "General"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.teacher?.name ||
                          course.teacher?.firstName ||
                          course.instructor ||
                          "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.totalQuestions || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.duration ? `${course.duration} min` : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(courseStatus)}`}
                        >
                          {courseStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        {course.pdfMaterial && (
                          <a
                            href={`${apiBaseUrl}/uploads/${course.pdfMaterial}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-sm text-blue-600 hover:underline"
                          >
                            Download PDF
                          </a>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              console.log(
                                "Edit course functionality to be implemented",
                              )
                            }
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              console.log(
                                "Delete course functionality to be implemented",
                              )
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Course
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={handleAddCourse}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Full Stack Web Development"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 1000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

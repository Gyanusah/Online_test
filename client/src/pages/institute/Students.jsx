import { useEffect, useState } from "react";
import { Users, Search, Filter, MoreVertical, Mail, Phone } from "lucide-react";
import { instituteAPI } from "../../utils/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await instituteAPI.getStudents();
        const studentList = Array.isArray(response?.data?.data?.students)
          ? response.data.data.students
          : [];
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const studentList = Array.isArray(students) ? students : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Students</h1>
          <p className="text-gray-600">Manage enrolled students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {studentList.length}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {
                  studentList.filter(
                    (s) => s.isActive || s.subscriptionStatus === "active",
                  ).length
                }
              </p>
              <p className="text-sm text-gray-500">Active Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {studentList.reduce(
                  (acc, s) =>
                    acc + Number(s.enrolledCourses ?? s.enrolledCount ?? 0),
                  0,
                )}
              </p>
              <p className="text-sm text-gray-500">Total Enrollments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-orange-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {studentList.length
                  ? Math.round(
                      studentList.reduce(
                        (acc, s) =>
                          acc + Number(s.progress ?? s.examProgress ?? 0),
                        0,
                      ) / studentList.length,
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Student List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : studentList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-gray-500">
                    No student profiles found.
                  </td>
                </tr>
              ) : (
                studentList.map((student) => {
                  const name =
                    `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                    "Student";
                  const status =
                    student.isActive || student.subscriptionStatus === "active"
                      ? "Active"
                      : "Inactive";
                  const progress = Number(
                    student.progress ?? student.examProgress ?? 0,
                  );

                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                            {name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2) || "ST"}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.studentId || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            {student.email || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            {student.phone || student.contact || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.department ||
                          student.preferredLanguage ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;

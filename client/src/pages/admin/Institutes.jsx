import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Search,
  Check,
  X,
  Eye,
  MapPin,
  Users,
  Mail,
  BookOpen,
} from "lucide-react";
import { adminAPI } from "../../utils/api";

const Institutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstituteId, setSelectedInstituteId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await adminAPI.getInstitutes();
        setInstitutes(response?.data?.data?.institutes || []);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  const getStatusColor = (isVerified) => {
    if (isVerified) {
      return "bg-green-100 text-green-700";
    }
    return "bg-yellow-100 text-yellow-700";
  };

  const toggleInstituteDetails = (instituteId) => {
    setSelectedInstituteId((prev) =>
      prev === instituteId ? null : instituteId,
    );
  };

  const normalizeText = (value) =>
    String(value ?? "")
      .toLowerCase()
      .trim();

  const filteredInstitutes = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) return Array.isArray(institutes) ? institutes : [];

    return (Array.isArray(institutes) ? institutes : []).filter((institute) => {
      const searchableValues = [
        institute?.instituteName,
        institute?.email,
        institute?.location,
        institute?.students?.toString(),
        institute?.languages?.map((language) => language?.name).join(" "),
        institute?.studentDetails?.map((student) => student?.email).join(" "),
      ]
        .filter(Boolean)
        .join(" ");

      return normalizeText(searchableValues).includes(term);
    });
  }, [institutes, searchTerm]);

  const handleInstituteStatus = async (instituteId, isVerified) => {
    try {
      setProcessingId(instituteId);
      setMessage({ type: "", text: "" });
      const response = isVerified
        ? await adminAPI.verifyInstitute(instituteId)
        : await adminAPI.updateInstituteStatus(instituteId, {
            isVerified: false,
          });

      const updatedInstitute = response?.data?.data?.institute;
      if (updatedInstitute) {
        setInstitutes((prev) =>
          prev.map((institute) =>
            institute._id === instituteId
              ? { ...institute, isVerified: updatedInstitute.isVerified }
              : institute,
          ),
        );
      }

      setMessage({
        type: "success",
        text: isVerified
          ? "Institute verified successfully"
          : "Institute marked as pending",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Unable to update institute status",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Institutes</h1>
          <p className="text-gray-600">Manage registered institutes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search institutes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Building2 className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {institutes.length}
              </p>
              <p className="text-sm text-gray-500">Total Institutes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Check className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {institutes.filter((i) => i.isVerified).length}
              </p>
              <p className="text-sm text-gray-500">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {institutes
                  .reduce((acc, i) => acc + i.students, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Building2 className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {institutes.reduce((acc, i) => acc + i.courses, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Registered Institutes
          </h2>
        </div>

        <div className="divide-y">
          {filteredInstitutes.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No institutes match your search.
            </div>
          ) : (
            filteredInstitutes.map((institute) => (
              <div key={institute._id} className="p-6 hover:bg-gray-50">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleInstituteDetails(institute._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleInstituteDetails(institute._id);
                    }
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building2 size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {institute.instituteName || "Unnamed Institute"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {institute.email || "No email"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(institute.isVerified)}`}
                      >
                        {institute.isVerified ? "Verified" : "Pending"}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        Students: {institute.students || 0}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={18} className="text-green-600" />
                        <span>{institute.location || "Location not set"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={18} className="text-green-600" />
                        <span>{institute.students || 0} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={18} className="text-green-600" />
                        <span>{institute.courses || 0} courses</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleInstituteDetails(institute._id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                      {selectedInstituteId === institute._id ? "Hide" : "View"}
                    </button>
                    {!institute.isVerified && (
                      <>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleInstituteStatus(institute._id, true);
                          }}
                          disabled={processingId === institute._id}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                          <Check size={18} />
                          {processingId === institute._id
                            ? "Processing..."
                            : "Verify"}
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleInstituteStatus(institute._id, false);
                          }}
                          disabled={processingId === institute._id}
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          <X size={18} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {selectedInstituteId === institute._id && (
                  <div className="mt-4 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-800">
                        Institute details
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700">
                          This institute has {institute.students || 0} students.
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-green-600" />
                          <span>{institute.email || "No email provided"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-green-600" />
                          <span>
                            {institute.location || "Location not set"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-gray-800">
                        Languages
                      </h4>
                      {institute.languages?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {institute.languages.map((language) => (
                            <span
                              key={`${language.name}-${language.code}`}
                              className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700"
                            >
                              {language.name} ({language.code})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No language data yet.
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-2">
                      <h4 className="mb-2 font-semibold text-gray-800">
                        Students
                      </h4>
                      {institute.studentDetails?.length ? (
                        <div className="space-y-2">
                          {institute.studentDetails.map((student) => (
                            <div
                              key={student._id}
                              className="rounded-lg border border-gray-200 bg-white p-3"
                            >
                              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {student.email}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <p>
                                    Language:{" "}
                                    {student.preferredLanguage || "Not set"}
                                  </p>
                                  <p>
                                    Status:{" "}
                                    {student.subscriptionStatus || "none"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No students linked yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Institutes;

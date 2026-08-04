import { useState, useEffect } from "react";
import { FileText, Check, X, Eye, Clock } from "lucide-react";
import { instituteAPI } from "../../utils/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const applicationList = Array.isArray(applications) ? applications : [];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await instituteAPI.getApplications();
      if (response?.data?.success) {
        setApplications(response.data.data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await instituteAPI.updateApplication(id, { status: "Approved" });
      setApplications((prev) =>
        prev.map((app) =>
          (app._id || app.id) === id ? { ...app, status: "Approved" } : app,
        ),
      );
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await instituteAPI.updateApplication(id, { status: "Rejected" });
      setApplications((prev) =>
        prev.map((app) =>
          (app._id || app.id) === id ? { ...app, status: "Rejected" } : app,
        ),
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = String(status || "Pending").toLowerCase();
    switch (normalizedStatus) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    const normalizedStatus = String(status || "Pending").toLowerCase();
    if (normalizedStatus === "approved") return "Approved";
    if (normalizedStatus === "rejected") return "Rejected";
    return "Pending";
  };

  const getStatusCount = (status) => {
    return applicationList.filter((application) => {
      const normalizedStatus = String(
        application.status || "pending",
      ).toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  const getApplicantName = (application) => {
    if (application?.student && typeof application.student === "object") {
      const fullName = [
        application.student.firstName,
        application.student.lastName,
      ]
        .filter(Boolean)
        .join(" ");
      return fullName || "Student";
    }
    return "Student application";
  };

  const getSubmittedDate = (application) => {
    return application?.appliedDate || application?.createdAt || "N/A";
  };

  const getCourseName = (application) => {
    if (application?.test && typeof application.test === "object") {
      return application.test.title || "Course";
    }
    return "Course";
  };

  const getApplicationId = (application) => application._id || application.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Applications</h1>
        <p className="text-gray-600">Review and manage student applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {applications.length}
              </p>
              <p className="text-sm text-gray-500">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {getStatusCount("pending")}
              </p>
              <p className="text-sm text-gray-500">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Check className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {getStatusCount("approved")}
              </p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <X className="text-red-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {getStatusCount("rejected")}
              </p>
              <p className="text-sm text-gray-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Application Queue</h2>
        </div>

        <div className="divide-y">
          {applicationList.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No applications found.
            </div>
          ) : (
            applicationList.map((application) => {
              const applicationId = getApplicationId(application);
              const statusLabel = getStatusLabel(application.status);

              return (
                <div key={applicationId} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {getApplicantName(application)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span>{" "}
                          {application.type || "Course Application"}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Course:</span>{" "}
                          {getCourseName(application)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Submitted:</span>{" "}
                          {getSubmittedDate(application)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          console.log(
                            "View application functionality to be implemented",
                          )
                        }
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                        View
                      </button>
                      {statusLabel === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(applicationId)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check size={18} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(applicationId)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X size={18} />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;

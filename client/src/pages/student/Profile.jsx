import { useEffect, useState } from "react";
import ProfileCard from "../../components/dashboard/ProfileCard";
import { Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react";
import { userAPI } from "../../utils/api";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",
    location: "",
    department: "",
    year: "",
    instituteName: "",
    preferredLanguage: "English",
    createdAt: "",
    profilePicture: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    department: "",
    year: "",
    instituteName: "",
    preferredLanguage: "English",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, "")
      : "http://localhost:5000";
    return `${baseUrl}${path}`;
  };

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const user = response?.data?.data?.user;
      if (!user) return;

      setStudent({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        studentId: user.studentId || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        year: user.year || "",
        instituteName: user.instituteName || "",
        preferredLanguage: user.preferredLanguage || "English",
        createdAt: user.createdAt || "",
        profilePicture: user.profilePicture || "",
      });
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        year: user.year || "",
        instituteName: user.instituteName || "",
        preferredLanguage: user.preferredLanguage || "English",
      });
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("phone", formData.phone);
      payload.append("location", formData.location);
      payload.append("department", formData.department);
      payload.append("year", formData.year);
      payload.append("instituteName", formData.instituteName);
      payload.append("preferredLanguage", formData.preferredLanguage);
      if (selectedFile) {
        payload.append("profilePicture", selectedFile);
      }

      const response = await userAPI.updateProfile(payload);
      const updatedUser = response?.data?.data?.user;
      if (updatedUser) {
        setStudent({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          studentId: updatedUser.studentId || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          location: updatedUser.location || "",
          department: updatedUser.department || "",
          year: updatedUser.year || "",
          createdAt: updatedUser.createdAt || "",
          profilePicture: updatedUser.profilePicture || "",
        });
        setSelectedFile(null);
        setPreviewUrl("");
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error?.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const fullName =
    `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
  const joinDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={20} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          Loading profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <ProfileCard
              student={{
                name: fullName,
                studentId: student.studentId,
                email: student.email,
                phone: student.phone,
                location: student.location,
                instituteName: student.instituteName,
                preferredLanguage: student.preferredLanguage,
                joinDate,
                profilePicture: student.profilePicture,
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Personal Information
              </h2>

              {isEditing && (
                <div className="mb-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                      {previewUrl || student.profilePicture ? (
                        <img
                          src={
                            previewUrl || getImageUrl(student.profilePicture)
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-500">
                          {(student.firstName?.[0] || "") +
                            (student.lastName?.[0] || "") || "JD"}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Profile photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 block w-full text-sm text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, or WEBP up to 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Department
                    </label>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Academic Year
                    </label>
                    <input
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Institute
                    </label>
                    <input
                      name="instituteName"
                      value={formData.instituteName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Preferred Language
                    </label>
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Japanese</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-800 font-medium">{fullName}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Student ID
                    </label>
                    <p className="text-gray-800 font-medium">
                      {student.studentId}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 text-gray-800">
                      <Mail size={16} className="text-gray-400" />
                      <span className="font-medium">{student.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 text-gray-800">
                      <Phone size={16} className="text-gray-400" />
                      <span className="font-medium">{student.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <div className="flex items-center gap-2 text-gray-800">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-medium">{student.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Join Date
                    </label>
                    <div className="flex items-center gap-2 text-gray-800">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="font-medium">{joinDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Department
                    </label>
                    <p className="text-gray-800 font-medium">
                      {student.department || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Academic Year
                    </label>
                    <p className="text-gray-800 font-medium">
                      {student.year || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Institute
                    </label>
                    <p className="text-gray-800 font-medium">
                      {student.instituteName || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Preferred Language
                    </label>
                    <p className="text-gray-800 font-medium">
                      {student.preferredLanguage || "English"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

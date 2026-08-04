import { Mail, Phone, MapPin, Calendar, Building2 } from "lucide-react";

const getProfileImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, "")
    : "http://localhost:5000";
  return `${baseUrl}${path}`;
};

const ProfileCard = ({ student }) => {
  const profileImageUrl = getProfileImageUrl(student?.profilePicture);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${student?.name || "Profile"} photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            student?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "JD"
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {student?.name || "John Doe"}
        </h2>
        <p className="text-gray-500 mb-4">{student?.studentId || "STU001"}</p>

        <div className="w-full space-y-3 text-left">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail size={18} className="text-blue-600" />
            <span>{student?.email || "john.doe@example.com"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Phone size={18} className="text-blue-600" />
            <span>{student?.phone || "+1 234 567 8900"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <MapPin size={18} className="text-blue-600" />
            <span>{student?.location || "New York, USA"}</span>
          </div>

          {student?.instituteName && (
            <div className="flex items-center gap-3 text-gray-600">
              <Building2 size={18} className="text-blue-600" />
              <span>{student.instituteName}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-600">
            <Calendar size={18} className="text-blue-600" />
            <span>Joined {student?.joinDate || "January 2024"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

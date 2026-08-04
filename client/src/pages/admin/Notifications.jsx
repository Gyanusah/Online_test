import { Bell, Check, Trash2, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { notificationAPI } from "../../utils/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      const data = response?.data?.notifications || [];
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "result_declared":
        return "bg-green-100 text-green-700";
      case "application_status":
        return "bg-yellow-100 text-yellow-700";
      case "exam_reminder":
        return "bg-blue-100 text-blue-700";
      case "announcement":
      case "system":
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "result_declared":
        return Check;
      case "application_status":
        return Bell;
      case "exam_reminder":
        return Bell;
      case "announcement":
      case "system":
      default:
        return Bell;
    }
  };

  const formatNotificationDate = (createdAt) => {
    const date = new Date(createdAt);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} • ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with important announcements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check size={18} />
            Mark All Read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Bell className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {notifications.length}
              </p>
              <p className="text-sm text-gray-500">Total Notifications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Bell className="text-red-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">{unreadCount}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Check className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {notifications.length - unreadCount}
              </p>
              <p className="text-sm text-gray-500">Read</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Notifications
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading notifications...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-gray-600">You have no notifications.</div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);

              return (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-green-50" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${getTypeColor(notification.type)}`}
                    >
                      <TypeIcon size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

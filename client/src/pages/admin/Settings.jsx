import { useEffect, useState } from "react";
import { Shield, User, Bell, Lock, Save, Globe, Database } from "lucide-react";
import { adminAPI } from "../../utils/api";

const AdminSettings = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchLanguages = async () => {
    try {
      const response = await adminAPI.getLanguages();
      setLanguages(response?.data?.data?.languages || []);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Could not load language prices",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleAmountChange = (languageId, value) => {
    setLanguages((prev) =>
      prev.map((language) =>
        language._id === languageId
          ? { ...language, subscriptionAmount: Number(value) }
          : language,
      ),
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      await Promise.all(
        languages.map((language) =>
          adminAPI.updateLanguage(language._id, {
            subscriptionAmount: language.subscriptionAmount,
          }),
        ),
      );

      setMessage({
        type: "success",
        text: "Language subscription prices updated successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Unable to update language prices",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Shield size={24} className="text-green-600" />
              Platform Configuration
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="EduPlatform"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Platform URL
                </label>
                <input
                  type="text"
                  defaultValue="https://eduplatform.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@eduplatform.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Database size={24} className="text-green-600" />
              Database Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Auto Backup</p>
                  <p className="text-sm text-gray-500">
                    Automatically backup database daily
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Data Retention</p>
                  <p className="text-sm text-gray-500">Keep logs for 90 days</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Bell size={24} className="text-green-600" />
              System Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Email Alerts</p>
                  <p className="text-sm text-gray-500">
                    Receive critical system alerts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    New User Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Get notified for new registrations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe size={24} className="text-green-600" />
              Language Subscription Prices
            </h2>

            {message.text && (
              <div
                className={`mb-4 rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
              >
                {message.text}
              </div>
            )}

            {loading ? (
              <div className="text-sm text-gray-600">
                Loading language prices...
              </div>
            ) : (
              <div className="space-y-4">
                {languages.map((language) => (
                  <div
                    key={language._id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {language.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Code: {language.code}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          1 month price
                        </label>
                        <input
                          type="number"
                          min="600"
                          max="800"
                          value={language.subscriptionAmount || 800}
                          onChange={(event) =>
                            handleAmountChange(language._id, event.target.value)
                          }
                          className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <User size={18} className="text-gray-600" />
                <span className="text-gray-700">Manage Admins</span>
              </button>
              <button className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Lock size={18} className="text-gray-600" />
                <span className="text-gray-700">Change Password</span>
              </button>
              <button className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Database size={18} className="text-gray-600" />
                <span className="text-gray-700">Backup Database</span>
              </button>
              <button className="w-full px-4 py-3 text-left border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-3">
                <Lock size={18} />
                <span>System Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

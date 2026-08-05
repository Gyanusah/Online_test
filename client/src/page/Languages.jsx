import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, BookOpen, ChevronRight } from "lucide-react";
import { testAPI } from "../utils/api";

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await testAPI.getLanguages();
        setLanguages(response?.data?.data?.languages || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load languages.");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading languages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8 px-6 lg:px-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Languages</h1>
        <p className="text-gray-600 mt-2">
          Select a language course and subscribe to unlock the full dashboard
          and tests.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languages.map((language) => (
          <div
            key={language._id}
            className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {language.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{language.code}</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-2 text-blue-700 text-sm font-semibold">
                ₹{language.subscriptionAmount || 800}
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {language.shortDescription || language.description}
            </p>

            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
              <span className="rounded-full bg-gray-100 px-3 py-1">
                {language.duration || "1 Month"}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1">
                {language.instituteName || "Language Institute"}
              </span>
            </div>

            <button
              onClick={() => navigate(`/languages/${language._id}`)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white text-sm font-semibold transition hover:bg-blue-700"
            >
              View details
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;

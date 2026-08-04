import React from "react";
import { Clock, CalendarDays, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tests = [
  {
    id: 1,
    title: "Japanese Language Test (JLPT N5)",
    language: "Japanese",
    duration: "90 Minutes",
    date: "15 August 2026",
    questions: 50,
    level: "Beginner",
  },
  {
    id: 2,
    title: "IELTS Mock Test",
    language: "English",
    duration: "2 Hours",
    date: "20 August 2026",
    questions: 80,
    level: "Intermediate",
  },
  {
    id: 3,
    title: "German A1 Test",
    language: "German",
    duration: "60 Minutes",
    date: "25 August 2026",
    questions: 40,
    level: "Beginner",
  },
  {
    id: 4,
    title: "English Grammar Test",
    language: "English",
    duration: "45 Minutes",
    date: "30 August 2026",
    questions: 30,
    level: "Basic",
  },
  {
    id: 5,
    title: "Korean TOPIK I",
    language: "Korean",
    duration: "100 Minutes",
    date: "5 September 2026",
    questions: 70,
    level: "Beginner",
  },
  {
    id: 6,
    title: "Chinese HSK Level 1",
    language: "Chinese",
    duration: "60 Minutes",
    date: "10 September 2026",
    questions: 40,
    level: "Beginner",
  },
];

const TestPage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            Available Language Tests
          </h1>
          <p className="mt-4 text-gray-600">
            Choose your preferred language test and apply online.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {test.language}
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {test.level}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {test.title}
              </h2>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  {test.duration}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  {test.date}
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  {test.questions} Questions
                </div>
              </div>

              <button
                onClick={() => navigate(`/apply/${test.id}`)}
                className="mt-6 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                Apply Now
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestPage;

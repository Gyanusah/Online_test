import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  BookOpen,
  Building2,
  Users,
  Award,
} from "lucide-react";

const test = {
  id: 1,
  title: "Japanese Language Test (JLPT N5)",
  language: "Japanese",
  level: "Beginner",
  institute: "ABC Japanese Language Institute",
  duration: "90 Minutes",
  questions: 50,
  passingMarks: 32,
  examDate: "20 August 2026",
  deadline: "15 August 2026",
  seats: "25 / 40",
  image:
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop",
  description:
    "The JLPT N5 examination is designed for beginners who want to evaluate their Japanese language proficiency. The test covers vocabulary, grammar, reading comprehension, and listening skills.",
  syllabus: [
    "Basic Vocabulary",
    "Basic Grammar",
    "Reading Comprehension",
    "Listening",
  ],
  eligibility:
    "Anyone interested in learning Japanese can apply. No previous certification is required.",
};

const TestDetails = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Image */}
        <img
          src={test.image}
          alt={test.title}
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <div className="flex flex-col lg:flex-row justify-between">
            <div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {test.language}
              </span>

              <h1 className="text-4xl font-bold mt-4">{test.title}</h1>

              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Building2 size={18} />
                {test.institute}
              </p>
            </div>

            <div className="mt-6 lg:mt-0">
              <button
                onClick={() => navigate(`/apply/${test.id}`)}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <Clock className="text-blue-700 mb-2" />
            <h3 className="font-semibold">Duration</h3>
            <p>{test.duration}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <BookOpen className="text-blue-700 mb-2" />
            <h3 className="font-semibold">Questions</h3>
            <p>{test.questions}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <Award className="text-blue-700 mb-2" />
            <h3 className="font-semibold">Passing Marks</h3>
            <p>{test.passingMarks}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <CalendarDays className="text-blue-700 mb-2" />
            <h3 className="font-semibold">Exam Date</h3>
            <p>{test.examDate}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <CalendarDays className="text-red-600 mb-2" />
            <h3 className="font-semibold">Registration Deadline</h3>
            <p>{test.deadline}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <Users className="text-green-600 mb-2" />
            <h3 className="font-semibold">Available Seats</h3>
            <p>{test.seats}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <BookOpen className="text-purple-600 mb-2" />
            <h3 className="font-semibold">Level</h3>
            <p>{test.level}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">About This Test</h2>
          <p className="text-gray-700 leading-8">{test.description}</p>
        </div>

        {/* Syllabus */}
        <div className="bg-white rounded-xl shadow mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">Syllabus</h2>

          <ul className="list-disc ml-6 space-y-2">
            {test.syllabus.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-xl shadow mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">Eligibility</h2>

          <p className="text-gray-700 leading-8">{test.eligibility}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition"
          >
            Back
          </button>

          <button
            onClick={() => navigate(`/apply/${test.id}`)}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Apply for Test
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestDetails;

import { BookOpen, Languages, Pencil, ClipboardList, Star } from "lucide-react";

const stats = [
  {
    icon: <BookOpen size={30} />,
    value: "15,000+",
    label: "Vocabulary Words",
  },
  {
    icon: <Languages size={30} />,
    value: "2,500+",
    label: "Kanji",
  },
  {
    icon: <Pencil size={30} />,
    value: "1,200+",
    label: "Grammar Lessons",
  },
  {
    icon: <ClipboardList size={30} />,
    value: "500+",
    label: "Mock Exams",
  },
  {
    icon: <Star size={30} />,
    value: "98%",
    label: "Student Satisfaction",
  },
];

export default function CTASection() {
  return (
    <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl">
      {/* Top Stats */}
      <div className="bg-[#122544] text-white grid grid-cols-2 md:grid-cols-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center py-8 border-r border-white/10 last:border-r-0"
          >
            <div className="mb-3">{item.icon}</div>
            <h2 className="text-2xl font-bold">{item.value}</h2>
            <p className="text-sm text-gray-300 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-linear-to-r from-red-400 to-red-500 relative px-8 py-10">
        {/* Decorative */}
        <div className="absolute bottom-0 left-8 text-8xl opacity-20">⛩️</div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div className="lg:ml-36">
            <h2 className="text-4xl font-bold text-white">
              START YOUR JAPANESE JOURNEY TODAY!
            </h2>

            <p className="text-red-100 mt-3 max-w-xl">
              Join thousands of learners preparing for JLPT with expert-designed
              lessons and realistic mock exams.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              START FREE
            </button>

            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-500 transition">
              VIEW COURSES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

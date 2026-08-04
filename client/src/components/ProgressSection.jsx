import {
  BookOpen,
  Headphones,
  ClipboardList,
  Languages,
  FileText,
  ClipboardCheck,
} from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "Vocabulary",
    desc: "Learn thousands of JLPT words with flashcards and quizzes.",
  },
  {
    icon: BookOpen,
    title: "Kanji",
    desc: "Practice stroke order, meanings, readings and examples.",
  },
  {
    icon: FileText,
    title: "Grammar",
    desc: "Easy-to-understand grammar lessons with practice.",
  },
  {
    icon: Headphones,
    title: "Listening",
    desc: "Native Japanese audio with subtitles.",
  },
  {
    icon: BookOpen,
    title: "Reading",
    desc: "Improve your reading with passages and questions.",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Tests",
    desc: "Real JLPT exam simulation with scoring.",
  },
];

export default function ProgressSection() {
  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 py-12">
      {/* LEFT */}
      <div className="bg-white rounded-2xl border shadow p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          LEARN. PRACTICE. MASTER.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="border rounded-xl p-4 hover:shadow-lg transition"
              >
                <Icon className="w-10 h-10 text-blue-600 mb-3" />

                <h3 className="font-bold">{item.title}</h3>

                <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border shadow p-6">
          <h2 className="text-3xl font-bold text-center mb-6">YOUR PROGRESS</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold text-orange-500">N4</h1>

              <p className="text-gray-500 mb-5">Elementary</p>

              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 rotate-[-90deg]">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#eee"
                    strokeWidth="10"
                    fill="none"
                  />

                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="377"
                    strokeDashoffset="132"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <h3 className="text-2xl font-bold">65%</h3>

                  <span className="text-gray-500 text-sm">Complete</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span>📖 Lessons Completed</span>
                <span className="font-bold">42 / 64</span>
              </div>

              <div className="flex justify-between">
                <span>📝 Practice Tests</span>
                <span className="font-bold">8 / 12</span>
              </div>

              <div className="flex justify-between">
                <span>📚 Vocabulary</span>
                <span className="font-bold">560 / 800</span>
              </div>

              <div className="flex justify-between">
                <span>🔥 Study Streak</span>
                <span className="font-bold">12 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}

        <div className="bg-orange-50 rounded-2xl border p-6 flex items-center gap-5">
          <div className="text-5xl">🌸</div>

          <div>
            <h2 className="text-2xl font-bold">努力は必ず報われる。</h2>

            <p className="italic text-gray-600">
              Doryoku wa kanarazu mukuwareru.
            </p>

            <p className="text-gray-700 mt-2">Hard work will always pay off.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

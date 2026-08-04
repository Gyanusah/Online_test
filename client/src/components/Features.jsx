import {
  GraduationCap,
  Headphones,
  BookOpen,
  Pencil,
  BarChart3,
  Clock3,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Complete\nCurriculum",
    color: "text-green-600",
  },
  {
    icon: Headphones,
    title: "Listening\nPractice",
    color: "text-gray-700",
  },
  {
    icon: BookOpen,
    title: "Kanji\nLearning",
    color: "text-yellow-600",
  },
  {
    icon: BookOpen,
    title: "Vocabulary\nBuilder",
    color: "text-orange-500",
  },
  {
    icon: Pencil,
    title: "Grammar\nLessons",
    color: "text-orange-500",
  },
  {
    icon: BarChart3,
    title: "Progress\nTracking",
    color: "text-red-500",
  },
  {
    icon: Clock3,
    title: "Mock\nExams",
    color: "text-red-500",
  },
  {
    icon: Smartphone,
    title: "Mobile\nFriendly",
    color: "text-gray-700",
  },
];

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center cursor-pointer transition duration-300 hover:scale-110"
              >
                <Icon className={`w-10 h-10 ${item.color}`} />

                <p className="mt-3 text-sm font-medium text-gray-700 whitespace-pre-line">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

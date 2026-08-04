const levels = [
  {
    level: "N5",
    title: "BEGINNER",
    color: "green",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=300",
    points: [
      "Basic Hiragana & Katakana",
      "Everyday Vocabulary",
      "Simple Grammar",
      "Basic Listening",
    ],
  },
  {
    level: "N4",
    title: "ELEMENTARY",
    color: "amber",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=300",
    points: [
      "More Vocabulary",
      "Basic Kanji",
      "Intermediate Grammar",
      "Short Conversations",
    ],
  },
  {
    level: "N3",
    title: "INTERMEDIATE",
    color: "blue",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=300",
    points: [
      "Newspaper Reading",
      "Conversation Practice",
      "Listening Skills",
      "600+ Kanji",
    ],
  },
  {
    level: "N2",
    title: "UPPER INTERMEDIATE",
    color: "purple",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300",
    points: [
      "Advanced Grammar",
      "Business Japanese",
      "Reading Articles",
      "Academic Vocabulary",
    ],
  },
  {
    level: "N1",
    title: "ADVANCED",
    color: "red",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300",
    points: [
      "Native-Level Reading",
      "Research Articles",
      "Formal Expressions",
      "Professional Japanese",
    ],
  },
];

const colors = {
  green: {
    text: "text-green-700",
    button: "bg-green-700",
    border: "border-green-200",
  },
  amber: {
    text: "text-amber-500",
    button: "bg-amber-500",
    border: "border-amber-200",
  },
  blue: {
    text: "text-blue-600",
    button: "bg-blue-600",
    border: "border-blue-200",
  },
  purple: {
    text: "text-purple-600",
    button: "bg-purple-600",
    border: "border-purple-200",
  },
  red: {
    text: "text-red-600",
    button: "bg-red-600",
    border: "border-red-200",
  },
};

export default function LevelCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center">JLPT LEVELS</h2>

      <p className="text-center text-gray-500 mt-2 mb-10">
        Choose your level and start your journey
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {levels.map((item) => (
          <div
            key={item.level}
            className={`bg-white rounded-2xl border ${colors[item.color].border} shadow-md hover:shadow-xl transition duration-300 overflow-hidden`}
          >
            <div className="p-5">
              <h1
                className={`text-5xl font-extrabold text-center ${colors[item.color].text}`}
              >
                {item.level}
              </h1>

              <p
                className={`text-center font-semibold text-sm ${colors[item.color].text}`}
              >
                {item.title}
              </p>

              <img
                src={item.image}
                alt={item.level}
                className="w-full h-28 object-cover rounded-lg my-5"
              />

              <ul className="space-y-2 text-sm text-gray-700">
                {item.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>

              <button
                className={`w-full mt-6 py-2 rounded-lg text-white font-semibold ${colors[item.color].button} hover:opacity-90`}
              >
                START {item.level}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

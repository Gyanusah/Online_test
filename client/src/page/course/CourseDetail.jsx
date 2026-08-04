import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const courses = [
  {
    title: "Japanese",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop&auto=format",
    description:
      "Japanese is the official language of Japan and is spoken by more than 120 million people worldwide. Learn speaking, reading, writing, and Japanese culture.",
  },
  {
    title: "English",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&auto=format",
    description:
      "Improve your English speaking, writing, listening, and reading skills for study, work, and international communication.",
  },
  {
    title: "Korean",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c897c8e7b1f?w=600&h=400&fit=crop&auto=format",
    description:
      "Learn Korean from beginner to advanced level, including Hangul, grammar, vocabulary, and conversation skills.",
  },
  {
    title: "Chinese",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop&auto=format",
    description:
      "Master Mandarin Chinese with lessons on pronunciation, characters, grammar, and daily communication.",
  },
  {
    title: "IELTS Preparation",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&auto=format",
    description:
      "Prepare for the IELTS exam with expert guidance on Listening, Reading, Writing, and Speaking modules.",
  },
  {
    title: "Computer Basics",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format",
    description:
      "Learn essential computer skills including MS Office, internet usage, email, file management, and digital productivity.",
  },
];

export default function CourseCard() {
  return (
    <div className="container mx-auto px-5 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {courses.map((item) => (
          <Card
            key={item.title}
            className="  bg-blue-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            sx={{
              maxWidth: 345,
              margin: "auto",
              borderRadius: 3,
              backgroundColor: "#e0f2fe",
            }}
          >
            <CardMedia
              component="img"
              height="220"
              image={item.image}
              alt={item.title}
              sx={{
                objectFit: "cover",
              }}
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const instituteRoutes = require("./routes/institutes");
const adminRoutes = require("./routes/admin");
const teacherRoutes = require("./routes/teacher");
const studentRoutes = require("./routes/students");
const examRoutes = require("./routes/exams");
const testRoutes = require("./routes/tests");
const applicationRoutes = require("./routes/applications");
const notificationRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");
const questionRoutes = require("./routes/questionRoutes");
const reviewRoutes = require("./routes/reviews");
const notesRoutes = require("./routes/notes");
const languageRoutes = require("./routes/language");
const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Initialize Express app
const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const MONGODB_URI = process.env.MONGODB_URI;

if (NODE_ENV === "production" && !MONGODB_URI) {
  console.error(
    "MONGODB_URI is required in production. Please configure it in Vercel environment variables.",
  );
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://online-test-7u27.vercel.app",
  "https://online-test-pi.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    console.log("CORS origin:", origin);
    if (NODE_ENV === "production") return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectUri =
  MONGODB_URI ||
  (NODE_ENV === "development"
    ? "mongodb://127.0.0.1:27017/eduplatform"
    : undefined);

if (!connectUri) {
  throw new Error(
    "No MongoDB URI configured. Set MONGODB_URI in environment variables.",
  );
}

console.log("Connecting to MongoDB:", connectUri);

mongoose
  .connect(connectUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/languages", languageRoutes);

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { dotfiles: "ignore" }),
);

// Notes routes
app.use("/api/notes", notesRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

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
const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv6first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// __filename and __dirname are available automatically in CommonJS
console.log(__filename);
console.log(__dirname);

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = ["https://online-test-7u27.vercel.app/"];

      // Allow any Vercel preview deployment (rent-finder-XXXX.vercel.app)
      const isVercelPreview = origin.match(
        /https:\/\/rent-finder-[a-z0-9]+\.vercel\.app$/,
      );
      const isAllowed =
        allowedOrigins.includes(origin.replace(/\/$/, "")) || isVercelPreview;

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
// Serve uploaded files
//app.use("/uploads", express.static("uploads"));

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

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;

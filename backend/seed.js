const dns = require("dns");
const mongoose = require("mongoose");
const User = require("./models/User");
const Language = require("./models/Language");
require("dotenv").config();

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eduplatform";

const seedUsers = async () => {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create institute (merged with teacher functionality)
    const institute = new User({
      firstName: "Tech",
      lastName: "Institute",
      email: "institute@example.com",
      phone: "5555555555",
      password: "123456",
      role: "institute",
      instituteName: "Tech Institute",
      location: "Nepal",
      employeeId: "EMP123456",
      subjects: ["Mathematics", "Science", "English"],
      qualifications: ["Masters in Education", "Teaching Certification"],
    });
    await institute.save();
    console.log(`Created institute user: ${institute.email}`);

    // Create admin (no institute required)
    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      phone: "1111111111",
      password: "123456",
      role: "admin",
    });
    await admin.save();
    console.log(`Created admin user: ${admin.email}`);

    // Create student with institute reference
    const student = new User({
      firstName: "John",
      lastName: "Doe",
      email: "student@example.com",
      phone: "1234567890",
      password: "123456",
      role: "student",
      institute: institute._id,
      studentId: "STU123456",
    });
    await student.save();
    console.log(`Created student user: ${student.email}`);

    // Seed some languages
    await Language.deleteMany({});
    const languages = [
      { name: "I/PTE", code: "IPTE", subscriptionAmount: 600 },
      { name: "Japanese", code: "JP", subscriptionAmount: 800 },
      { name: "German", code: "DE", subscriptionAmount: 800 },
      { name: "Korean", code: "KR", subscriptionAmount: 800 },
    ];
    for (const lang of languages) {
      await Language.create(lang);
    }
    console.log("Seeded languages");

    console.log("Seed completed successfully");
    console.log("\nTest credentials:");
    console.log("Student: student@example.com / 123456");
    console.log(
      "Institute (merged with Teacher): institute@example.com / 123456",
    );
    console.log("Admin: admin@example.com / 123456");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedUsers();

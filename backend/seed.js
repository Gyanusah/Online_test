const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create institute (merged with teacher functionality)
    const institute = new User({
      firstName: 'Tech',
      lastName: 'Institute',
      email: 'institute@example.com',
      phone: '5555555555',
      password: '123456',
      role: 'institute',
      instituteName: 'Tech Institute',
      location: 'New York',
      employeeId: 'EMP123456',
      subjects: ['Mathematics', 'Science', 'English'],
      qualifications: ['Masters in Education', 'Teaching Certification']
    });
    await institute.save();
    console.log(`Created institute user: ${institute.email}`);

    // Create admin (no institute required)
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '1111111111',
      password: '123456',
      role: 'admin'
    });
    await admin.save();
    console.log(`Created admin user: ${admin.email}`);

    // Create student with institute reference
    const student = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'student@example.com',
      phone: '1234567890',
      password: '123456',
      role: 'student',
      institute: institute._id,
      studentId: 'STU123456'
    });
    await student.save();
    console.log(`Created student user: ${student.email}`);

    console.log('Seed completed successfully');
    console.log('\nTest credentials:');
    console.log('Student: student@example.com / 123456');
    console.log('Institute (merged with Teacher): institute@example.com / 123456');
    console.log('Admin: admin@example.com / 123456');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();

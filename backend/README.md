# EduPlatform Backend API

Backend API for the EduPlatform with role-based access control.

## Features

- Role-based authentication (Student, Institute, Admin)
- JWT token authentication
- MongoDB database integration
- RESTful API endpoints
- Password hashing with bcryptjs

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduplatform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

3. Start MongoDB server

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/password` - Change password (protected)

### Institutes

- `GET /api/institutes/students` - Get all students (institute only)
- `GET /api/institutes/stats` - Get institute statistics (institute only)

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/institutes` - Get all institutes (admin only)
- `PUT /api/admin/users/:id/status` - Update user status (admin only)
- `PUT /api/admin/institutes/:id/verify` - Verify institute (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## User Roles

- **Student**: Can access student dashboard, view courses, take tests
- **Institute**: Can manage courses, students, applications
- **Admin**: Can manage all users, institutes, platform settings

## Database Schema

### User Model
- firstName (String)
- lastName (String)
- email (String, unique)
- phone (String)
- password (String, hashed)
- role (String: 'student' | 'institute' | 'admin')
- instituteName (String, for institutes)
- location (String, for institutes)
- studentId (String, for students)
- isVerified (Boolean)
- isActive (Boolean)
- lastLogin (Date)
- timestamps

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Role-based access control middleware
- Input validation using express-validator

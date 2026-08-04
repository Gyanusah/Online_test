# Language Examination Platform

A comprehensive online examination platform for language learning and assessment. Supports multiple languages including Japanese (JLPT), IELTS, English, German, Korean, and Chinese with various question types and role-based access control.

## Features

### For Students

- Register and log in with secure authentication
- Complete profile management
- Browse available language tests with search and filters
- View detailed test information
- Apply for tests with approval workflow
- Take online exams with countdown timer
- Answer multiple question types (MCQ, True/False, Fill-in-blanks, Writing, Listening, Speaking)
- Auto-save answers and auto-submit on time expiry
- View immediate scores for objective questions
- View teacher-reviewed scores for subjective questions
- Download certificates after passing
- View exam history and progress
- Receive notifications for exams, results, and announcements

### For Teachers

- Create and manage language tests
- Build comprehensive question banks
- Organize questions by language and level
- Support for multiple question types:
  - Multiple Choice Questions (MCQ)
  - True/False
  - Fill in the Blanks
  - Matching
  - Reading Comprehension
  - Listening (Audio upload)
  - Speaking (Voice recording)
  - Writing (Essay)
- Upload audio files for listening tests
- Upload images for image-based questions
- Assign marks and set correct answers
- Configure exam duration and passing marks
- Publish/unpublish exams
- Review descriptive answers
- Approve/reject submitted exams
- View student performance reports

### For Institute Admins

- Create and edit institute profile
- Add and manage teachers
- Approve teacher accounts
- Manage students
- Create courses and language tests
- Assign teachers to tests
- View applications and payments
- Generate reports
- Manage certificates
- Publish announcements

### For Super Admin

- Manage all institutes
- Approve/reject institute registration
- Manage teachers and students
- Manage languages and exams
- View system analytics
- Manage payments
- Send global notifications
- Generate reports
- Manage certificates
- Configure system settings

## Technology Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- Lucide React (Icons)
- React Context API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File uploads)
- PDFKit (Certificate generation)
- Nodemailer (Email notifications)

## Project Structure

```
New folder/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── teacherController.js
│   │   ├── examController.js
│   │   ├── testController.js
│   │   ├── applicationController.js
│   │   ├── certificateController.js
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Institute.js
│   │   ├── Language.js
│   │   ├── Test.js
│   │   ├── Question.js
│   │   ├── Application.js
│   │   ├── Exam.js
│   │   ├── Certificate.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── teacher.js
│   │   ├── exams.js
│   │   ├── tests.js
│   │   ├── applications.js
│   │   ├── certificates.js
│   │   ├── notifications.js
│   │   └── analytics.js
│   ├── uploads/ (created dynamically)
│   ├── .env
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── questions/
│   │   │   │   ├── MCQQuestion.jsx
│   │   │   │   ├── TrueFalseQuestion.jsx
│   │   │   │   ├── FillInBlanksQuestion.jsx
│   │   │   │   ├── WritingQuestion.jsx
│   │   │   │   ├── ListeningQuestion.jsx
│   │   │   │   ├── SpeakingQuestion.jsx
│   │   │   │   └── MatchingQuestion.jsx
│   │   │   ├── dashboard/
│   │   │   ├── StudentSidebar.jsx
│   │   │   ├── StudentNavbar.jsx
│   │   │   ├── InstituteSidebar.jsx
│   │   │   ├── InstituteNavbar.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   └── AdminNavbar.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── Footer.jsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx
│   │   ├── layouts/
│   │   │   ├── StudentLayout.jsx
│   │   │   ├── TeacherLayout.jsx
│   │   │   ├── InstituteLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   ├── institute/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/eduplatform
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tests (Public)

- `GET /api/tests` - Get all published tests
- `GET /api/tests/:id` - Get test details
- `GET /api/tests/languages/all` - Get all languages

### Teacher Routes

- `POST /api/teacher/tests` - Create test
- `GET /api/teacher/tests` - Get teacher's tests
- `GET /api/teacher/tests/:id` - Get test by ID
- `PUT /api/teacher/tests/:id` - Update test
- `DELETE /api/teacher/tests/:id` - Delete test
- `PATCH /api/teacher/tests/:id/publish` - Toggle publish status
- `POST /api/teacher/questions` - Create question
- `GET /api/teacher/questions/test/:testId` - Get test questions
- `GET /api/teacher/questions/:id` - Get question by ID
- `PUT /api/teacher/questions/:id` - Update question
- `DELETE /api/teacher/questions/:id` - Delete question
- `GET /api/teacher/results` - Get student results
- `GET /api/teacher/exams/:id/review` - Get exam for review
- `PATCH /api/teacher/exams/:id/review` - Review exam
- `GET /api/teacher/applications` - Get applications
- `PATCH /api/teacher/applications/:id/status` - Update application status

### Exam Routes

- `POST /api/exams/start` - Start exam
- `GET /api/exams/active` - Get active exam
- `GET /api/exams/history` - Get exam history
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams/save-answer` - Save answer
- `POST /api/exams/:id/submit` - Submit exam
- `POST /api/exams/:id/auto-submit` - Auto-submit exam
- `GET /api/exams/:id/results` - Get exam results

### Application Routes

- `POST /api/applications/apply` - Apply for test
- `GET /api/applications/:id` - Get application by ID
- `PATCH /api/applications/:id/cancel` - Cancel application

### Certificate Routes

- `POST /api/certificates/generate/:examId` - Generate certificate
- `GET /api/certificates/my` - Get my certificates
- `GET /api/certificates/:id` - Get certificate by ID
- `GET /api/certificates/verify/:verificationCode` - Verify certificate
- `GET /api/certificates/:id/download` - Download certificate
- `PATCH /api/certificates/:id/revoke` - Revoke certificate

### Notification Routes

- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Analytics Routes

- `GET /api/analytics/teacher` - Get teacher analytics
- `GET /api/analytics/institute` - Get institute analytics
- `GET /api/analytics/admin` - Get admin analytics
- `GET /api/analytics/student` - Get student performance
- `POST /api/analytics/report` - Generate report

## Supported Languages

- Japanese (JLPT N5, N4, N3, N2, N1)
- English
- IELTS (Academic, General Training)
- German (A1, A2, B1, B2, C1)
- Korean (TOPIK I, TOPIK II)
- Chinese (HSK 1-6)

## Question Types

1. **Multiple Choice Questions (MCQ)** - Single or multiple correct answers
2. **True/False** - Binary choice questions
3. **Fill in the Blanks** - Text completion with single or multiple blanks
4. **Matching** - Match items from two columns
5. **Reading Comprehension** - Questions based on passages
6. **Listening** - Audio-based questions
7. **Speaking** - Voice recording answers
8. **Writing** - Essay/long-form text answers

## User Roles

1. **Student** - Takes exams, views results, downloads certificates
2. **Teacher** - Creates tests, manages questions, reviews exams
3. **Institute Admin** - Manages institute, teachers, students
4. **Super Admin** - Full system access and management

## Exam Workflow

1. Institute creates a language test
2. Teacher creates questions for the test
3. Teacher publishes the exam
4. Student applies for the exam
5. Institute approves the application (if required)
6. Student starts the exam
7. Countdown timer begins automatically
8. Student answers all questions
9. Exam auto-submits when time expires
10. Objective questions are graded automatically
11. Writing and speaking answers are reviewed by teacher
12. Final score is calculated
13. Student views results
14. Passing students can download certificates

## Features Implemented

### Core Features

- ✅ JWT Authentication
- ✅ Role-Based Authorization
- ✅ Multi-language support
- ✅ Multiple question types
- ✅ File upload for audio/images
- ✅ Voice recording for speaking tests
- ✅ Countdown timer with auto-submit
- ✅ Auto-save answers
- ✅ Automatic scoring for objective questions
- ✅ Manual evaluation for subjective questions
- ✅ Certificate generation (PDF)
- ✅ Notification system
- ✅ Analytics and reporting

### UI/UX Features

- ✅ Responsive design
- ✅ Dark/Light mode toggle
- ✅ Search and filter functionality
- ✅ Pagination
- ✅ Dashboard analytics
- ✅ Progress tracking
- ✅ Real-time exam timer

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/eduplatform
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Development

### Running Backend

```bash
cd backend
npm run dev
```

### Running Frontend

```bash
cd client
npm run dev
```

### Building for Production

```bash
cd client
npm run build
```

## Database Schema

### User

- Personal information (name, email, phone)
- Role (student, teacher, institute, admin)
- Institute reference (for teachers/students)
- Profile picture
- Verification status

### Institute

- Institute details (name, code, location)
- Subscription plan
- Settings (max teachers, students, tests)
- Approval status

### Test

- Test details (title, code, description)
- Language and level
- Duration and marks configuration
- Schedule (start/end dates)
- Publishing status

### Question

- Question type and content
- Options for MCQ
- Audio/image files
- Marks and difficulty
- Correct answers

### Application

- Student and test reference
- Status (pending, approved, rejected)
- Payment information
- Approval details

### Exam

- Test and student reference
- Answers and scores
- Status (in_progress, submitted)
- Review information

### Certificate

- Exam and student reference
- Score and grade
- Certificate number and verification code
- PDF generation

### Notification

- Recipient and type
- Title and message
- Read status

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- File upload validation
- Input validation with express-validator
- CORS configuration
- Secure API endpoints

## Future Enhancements

- Real-time exam monitoring
- Proctoring features
- Advanced analytics dashboard
- Integration with payment gateways
- Email notifications with Nodemailer
- Cloud storage integration
- Mobile app development
- AI-powered question generation
- Adaptive testing
- Peer review system

## License

ISC

## Support

For support and queries, please contact the development team.

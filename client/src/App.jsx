import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import Home from "./page/Home";
import Footer from "./components/Footer";
import CourseDetail from "./page/course/CourseDetail";
import Contact from "./page/Contact";
import About from "./page/About";
import TestPage from "./page/Test/TestPage";
import ApplyTest from "./page/Test/ApplyTest";
import TestDetails from "./page/Test/TestDetails";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import Subscription from "./pages/student/Subscription";
import Results from "./pages/student/Results";
//import Certificates from "./pages/student/Certificates";
import Notifications from "./pages/student/Notifications";
import StudentSettings from "./pages/student/Settings";
import TakeExam from "./pages/student/TakeExam";
import AllTests from "./pages/student/AllTests";
import InstituteLayout from "./layouts/InstituteLayout";
import InstituteDashboard from "./pages/institute/InstituteDashboard";
import InstituteCourses from "./pages/institute/Courses";
import InstituteStudents from "./pages/institute/Students";
//import InstituteApplications from "./pages/institute/Applications";
import InstituteSettings from "./pages/institute/Settings";
import InstituteNotifications from "./pages/institute/Notifications";
import InstituteReviews from "./pages/institute/Reviews";
import InstituteReports from "./pages/institute/Reports";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateTest from "./pages/teacher/CreateTest";
import QuestionBank from "./pages/teacher/QuestionBank";
import CreateQuestion from "./pages/teacher/CreateQuestion";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminInstitutes from "./pages/admin/Institutes";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import SubscriptionRequests from "./pages/admin/SubscriptionRequests";
import Revenue from "./pages/admin/Revenue";
import AdminNotifications from "./pages/admin/Notifications";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/course"
          element={
            <>
              <Navbar />
              <CourseDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/test"
          element={
            <>
              <Navbar />
              <TestPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/tests/:id"
          element={
            <>
              <Navbar />
              <TestDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/apply/:id"
          element={
            <>
              <Navbar />
              <ApplyTest />
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/:role" element={<Signup />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="all-tests" element={<AllTests />} />
          <Route path="exam/:applicationId" element={<TakeExam />} />
          <Route path="results" element={<Results />} />
          {/* <Route path="certificates" element={<Certificates />} /> */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        <Route
          path="/institute"
          element={
            <ProtectedRoute>
              <InstituteLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InstituteDashboard />} />
          <Route path="dashboard" element={<InstituteDashboard />} />
          <Route path="courses" element={<InstituteCourses />} />
          <Route path="students" element={<InstituteStudents />} />
          {/* <Route path="applications" element={<InstituteApplications />} /> */}
          <Route path="question-bank" element={<QuestionBank />} />

          <Route path="create-question" element={<CreateQuestion />} />
          <Route path="create-question/:testId" element={<CreateQuestion />} />
          <Route path="create-test" element={<CreateTest />} />
          <Route path="manage-tests" element={<CreateTest />} />
          <Route path="student-results" element={<TeacherDashboard />} />
          <Route path="reviews" element={<InstituteReviews />} />
          <Route path="reports" element={<InstituteReports />} />
          <Route path="notifications" element={<InstituteNotifications />} />
          <Route path="settings" element={<InstituteSettings />} />
        </Route>

        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <InstituteLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="create-question" element={<CreateQuestion />} />
          <Route path="create-question/:testId" element={<CreateQuestion />} />
          <Route path="create-test" element={<CreateTest />} />
          <Route path="manage-tests" element={<CreateTest />} />
          <Route path="student-results" element={<TeacherDashboard />} />
          <Route path="reviews" element={<TeacherDashboard />} />
          <Route path="reports" element={<TeacherDashboard />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="institutes" element={<AdminInstitutes />} />
          <Route path="subscriptions" element={<SubscriptionRequests />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

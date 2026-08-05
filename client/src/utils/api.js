import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available and set JSON content-type only when not sending FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
  getCurrentUser: () => api.get("/auth/me"),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return api.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put("/users/profile", data);
  },
  changePassword: (data) => api.put("/users/password", data),
};

// Institute API
export const instituteAPI = {
  getStudents: () => api.get("/institutes/students"),
  getStats: () => api.get("/institutes/stats"),
  getAnalytics: (timeRange) =>
    api.get(`/institutes/analytics?timeRange=${timeRange}`),
  getRecentEnrollments: () => api.get("/institutes/recent-enrollments"),
  getPopularCourses: () => api.get("/institutes/popular-courses"),
  getCourses: () => api.get("/institutes/courses"),
  createCourse: (data) => api.post("/institutes/courses", data),
  updateCourse: (id, data) => api.put(`/institutes/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/institutes/courses/${id}`),
  getApplications: () => api.get("/institutes/applications"),
  updateApplication: (id, data) =>
    api.put(`/institutes/applications/${id}`, data),
  getReviews: () => api.get("/reviews"),
};

// Teacher API
export const teacherAPI = {
  getDashboard: () => api.get("/teacher/dashboard"),
  getQuestions: () => api.get("/teacher/questions"),
  getStudentResults: () => api.get("/teacher/results"),
  getReviews: () => api.get("/teacher/reviews"),
  getReports: () => api.get("/teacher/reports"),
  getTests: () => api.get("/tests"),
  createQuestion: (data) => api.post("/questions", data),
  createQuestionsBulk: (data) => api.post("/questions/bulk", data),

  // Get All Questions
  getAllQuestions: () => api.get("/questions"),

  // Get Questions By Test
  getQuestionsByTest: (testId) => api.get(`/questions/test/${testId}`),

  // Create Test
  createTest: (data) => api.post("/teacher/tests", data),

  // Get Question By Id
  getQuestionById: (id) => api.get(`/questions/${id}`),

  // Update Question
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),

  // Delete Question
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get("/students/dashboard"),
  requestSubscription: (data) =>
    api.post("/students/subscription/request", data),
  paySubscription: (data) => api.post("/students/subscription/pay", data),
  getResults: () => api.get("/students/results"),
  getCertificates: () => api.get("/students/certificates"),
  getNotifications: () => api.get("/students/notifications"),
  startExam: ({ applicationId, testId }) =>
    api.post("/exams/start", { applicationId, testId }),
  saveAnswer: (data) => api.post("/exams/save-answer", data),
  autoSubmitExam: (examId, data) =>
    api.post(`/exams/${examId}/auto-submit`, data),
  submitExam: (examId, data) => api.post(`/exams/${examId}/submit`, data),
  submitReview: (data) => api.post("/reviews", data),
  getTestReviews: (testId) => api.get(`/reviews/test/${testId}`),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get("/admin/users", { params }),
  getInstitutes: () => api.get("/admin/institutes"),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  verifyInstitute: (id) => api.put(`/admin/institutes/${id}/verify`),
  updateInstituteStatus: (id, data) =>
    api.put(`/admin/institutes/${id}/status`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get("/admin/analytics"),
  getReports: () => api.get("/admin/reports"),
  generateReport: (data) => api.post("/admin/reports", data),
  getSubscriptionRequests: (params) =>
    api.get("/admin/subscriptions", { params }),
  approveSubscription: (id, data) =>
    api.put(`/admin/subscriptions/${id}/approve`, data),
  getLanguages: () => api.get("/admin/languages"),
  updateLanguage: (id, data) => api.put(`/admin/languages/${id}`, data),
};

// Exam API
export const examAPI = {
  getExams: () => api.get("/exams"),
  getExamById: (id) => api.get(`/exams/${id}`),
};

// Test API
export const testAPI = {
  getTests: () => api.get("/tests"),
  getTestById: (id) => api.get(`/tests/${id}`),
  getLanguages: () => api.get("/tests/languages/all"),
  getLanguageById: (id) => api.get(`/tests/languages/${id}`),
};

// Notes API
export const noteAPI = {
  uploadNote: (formData) =>
    api.post("/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getNotes: (params) => api.get("/notes", { params }),
  getNote: (id) => api.get(`/notes/${id}`),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getTeacherAnalytics: () => api.get("/analytics/teacher"),
  getInstituteAnalytics: () => api.get("/analytics/institute"),
  getAdminAnalytics: () => api.get("/analytics/admin"),
  getStudentPerformance: () => api.get("/analytics/student"),
  generateReport: (data) => api.post("/analytics/report", data),
};

export default api;

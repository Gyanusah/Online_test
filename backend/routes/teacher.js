const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
  togglePublishTest,
  createQuestion,
  createQuestionsBulk,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getStudentResults,
  reviewExam,
  getExamForReview,
  getApplications,
  updateApplicationStatus,
  getDashboard
} = require('../controllers/teacherController');

// Dashboard route
router.get('/dashboard', auth, getDashboard);

// Test routes
router.post('/tests', auth, createTest);
router.get('/tests', auth, getTests);
router.get('/tests/:id', auth, getTestById);
router.put('/tests/:id', auth, updateTest);
router.delete('/tests/:id', auth, deleteTest);
router.patch('/tests/:id/publish', auth, togglePublishTest);

// Question routes
router.post('/questions', auth, createQuestion);
router.post('/questions/bulk', auth, createQuestionsBulk);
router.get('/questions', auth, getQuestions);
router.get('/questions/test/:testId', auth, getQuestions);
router.get('/questions/:id', auth, getQuestionById);
router.put('/questions/:id', auth, updateQuestion);
router.delete('/questions/:id', auth, deleteQuestion);

// Results and review routes
router.get('/results', auth, getStudentResults);
router.get('/exams/:id/review', auth, getExamForReview);
router.patch('/exams/:id/review', auth, reviewExam);

// Application routes
router.get('/applications', auth, getApplications);
router.patch('/applications/:id/status', auth, updateApplicationStatus);

module.exports = router;

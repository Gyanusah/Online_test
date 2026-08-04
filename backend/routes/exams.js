const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  startExam,
  getExamById,
  saveAnswer,
  submitExam,
  autoSubmitExam,
  getExamResults,
  getExamHistory,
  getActiveExam
} = require('../controllers/examController');

// Exam routes
router.post('/start', auth, startExam);
router.get('/active', auth, getActiveExam);
router.get('/history', auth, getExamHistory);
router.get('/:id', auth, getExamById);
router.post('/save-answer', auth, saveAnswer);
router.post('/:id/submit', auth, submitExam);
router.post('/:id/auto-submit', auth, autoSubmitExam);
router.get('/:id/results', auth, getExamResults);

module.exports = router;

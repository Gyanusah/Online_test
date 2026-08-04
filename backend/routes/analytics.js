const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTeacherAnalytics,
  getInstituteAnalytics,
  getAdminAnalytics,
  getStudentPerformance,
  generateReport
} = require('../controllers/analyticsController');

// Analytics routes
router.get('/teacher', auth, getTeacherAnalytics);
router.get('/institute', auth, getInstituteAnalytics);
router.get('/admin', auth, getAdminAnalytics);
router.get('/student', auth, getStudentPerformance);
router.post('/report', auth, generateReport);

module.exports = router;

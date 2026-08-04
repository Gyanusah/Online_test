const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Validation middleware
const validateSignup = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'institute', 'admin']).withMessage('Invalid role')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['student', 'institute', 'admin']).withMessage('Invalid role')
];

// Routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', auth, getCurrentUser);

module.exports = router;

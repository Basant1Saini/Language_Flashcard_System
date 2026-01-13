const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validation');

// @route   POST /api/auth/register
router.post('/register', registerValidation, handleValidationErrors, register);

// @route   POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, login);

// @route   GET /api/auth/profile
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', auth, updateProfile);

module.exports = router;
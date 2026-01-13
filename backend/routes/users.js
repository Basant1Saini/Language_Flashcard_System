const express = require('express');
const router = express.Router();
const { getProgress, getStats } = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET /api/users/progress
router.get('/progress', auth, getProgress);

// @route   GET /api/users/progress/stats
router.get('/progress/stats', auth, getStats);

module.exports = router;
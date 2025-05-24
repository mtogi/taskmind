const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.get('/dashboard', userController.getDashboard);

module.exports = router; 
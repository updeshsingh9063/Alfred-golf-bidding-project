const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, requireSubscription } = require('../middleware/auth.middleware');

// All user routes require authentication
router.use(protect);

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PATCH /api/users/profile
router.patch('/profile', userController.updateProfile);

// PATCH /api/users/charity
router.patch('/charity', userController.updateCharity);

// GET /api/users/dashboard (requires login only)
router.get('/dashboard', userController.getDashboard);

// GET /api/users/winnings
router.get('/winnings', userController.getWinnings);

module.exports = router;

const express = require('express');
const router = express.Router();
const drawController = require('../controllers/draw.controller');
const { protect, requireSubscription } = require('../middleware/auth.middleware');

// Public routes
router.get('/', drawController.getPublicDraws);
router.get('/upcoming', drawController.getUpcomingDraw);
router.get('/:id', drawController.getDrawById);

// Subscriber-only routes
router.get('/my/history', protect, requireSubscription, drawController.getMyDrawHistory);
router.get('/my/entry', protect, requireSubscription, drawController.getCurrentEntry);

module.exports = router;

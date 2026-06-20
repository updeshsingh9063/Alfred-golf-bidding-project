const express = require('express');
const router = express.Router();
const winnerController = require('../controllers/winner.controller');
const { protect, requireSubscription } = require('../middleware/auth.middleware');

// Public: recent winners
router.get('/', winnerController.getPublicWinners);

// Subscriber routes
router.get('/my', protect, winnerController.getMyWinnings);

// POST upload proof (subscriber only — must be a winner)
router.post(
  '/:id/upload-proof',
  protect,
  requireSubscription,
  winnerController.uploadProofMiddleware,
  winnerController.uploadProof
);

module.exports = router;

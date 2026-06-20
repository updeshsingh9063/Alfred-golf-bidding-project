const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const scoreController = require('../controllers/score.controller');
const { protect, requireSubscription } = require('../middleware/auth.middleware');

// All score routes require auth + subscription
router.use(protect, requireSubscription);

const scoreValidation = [
  body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('score')
    .isInt({ min: 1, max: 45 })
    .withMessage('Score must be an integer between 1 and 45 (Stableford)'),
  body('course').optional().trim().isLength({ max: 100 }).withMessage('Course name too long'),
];

const updateScoreValidation = [
  body('date').optional().isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('score').optional().isInt({ min: 1, max: 45 }).withMessage('Score must be between 1 and 45'),
  body('course').optional().trim().isLength({ max: 100 }),
];

// GET /api/scores
router.get('/', scoreController.getMyScores);

// GET /api/scores/draw-numbers
router.get('/draw-numbers', scoreController.getDrawNumbers);

// POST /api/scores
router.post('/', scoreValidation, scoreController.addScore);

// PATCH /api/scores/:id
router.patch('/:id', updateScoreValidation, scoreController.updateScore);

// DELETE /api/scores/:id
router.delete('/:id', scoreController.deleteScore);

module.exports = router;

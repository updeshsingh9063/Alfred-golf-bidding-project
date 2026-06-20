const scoreService = require('../services/score.service');
const { validationResult } = require('express-validator');

// ── GET /api/scores ───────────────────────────────────────────────────────────
exports.getMyScores = async (req, res, next) => {
  try {
    const scores = await scoreService.getUserScores(req.user._id);
    res.json({ success: true, data: { scores } });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/scores ──────────────────────────────────────────────────────────
exports.addScore = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { date, score, course } = req.body;
    const result = await scoreService.addScore(req.user._id, { date, score, course });

    res.status(201).json({
      success: true,
      message: result.wasReplaced
        ? 'Score added. Your oldest score has been replaced to maintain the 5-score rolling window.'
        : 'Score added successfully.',
      data: { score: result.score },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// ── PATCH /api/scores/:id ─────────────────────────────────────────────────────
exports.updateScore = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { date, score, course } = req.body;
    const updatedScore = await scoreService.updateScore(req.user._id, req.params.id, {
      ...(date && { date }),
      ...(score !== undefined && { score }),
      ...(course !== undefined && { course }),
    });

    res.json({
      success: true,
      message: 'Score updated successfully.',
      data: { score: updatedScore },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// ── DELETE /api/scores/:id ────────────────────────────────────────────────────
exports.deleteScore = async (req, res, next) => {
  try {
    await scoreService.deleteScore(req.user._id, req.params.id);
    res.json({ success: true, message: 'Score deleted successfully.' });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// ── GET /api/scores/draw-numbers ──────────────────────────────────────────────
// Returns the user's current 5 score values (used as draw entry numbers)
exports.getDrawNumbers = async (req, res, next) => {
  try {
    const numbers = await scoreService.getUserDrawNumbers(req.user._id);
    res.json({ success: true, data: { drawNumbers: numbers } });
  } catch (error) {
    next(error);
  }
};

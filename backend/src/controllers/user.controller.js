const User = require('../models/User.model');
const Winner = require('../models/Winner.model');
const Score = require('../models/Score.model');
const Subscription = require('../models/Subscription.model');
const { sanitizeUser } = require('../utils/jwt.utils');

// ── GET /api/users/profile ────────────────────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('charityId', 'name slug logoUrl category description')
      .lean();

    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/users/profile ──────────────────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'country', 'avatar', 'notifications'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).populate('charityId', 'name slug logoUrl');

    res.json({ success: true, message: 'Profile updated.', data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/users/charity ──────────────────────────────────────────────────
exports.updateCharity = async (req, res, next) => {
  try {
    const { charityId, charityPercent } = req.body;

    const updates = {};
    if (charityId !== undefined) updates.charityId = charityId || null;
    if (charityPercent !== undefined) {
      if (charityPercent < 10 || charityPercent > 50) {
        return res.status(400).json({
          success: false,
          message: 'Charity percentage must be between 10% and 50%.',
        });
      }
      updates.charityPercent = charityPercent;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).populate('charityId', 'name slug logoUrl');

    res.json({ success: true, message: 'Charity preference updated.', data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/users/dashboard ──────────────────────────────────────────────────
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Parallel fetch
    const [user, scores, recentWinnings, subscription] = await Promise.all([
      User.findById(userId).populate('charityId', 'name slug logoUrl category').lean(),
      Score.find({ userId, isDeleted: false }).sort({ date: -1 }).limit(5).lean(),
      Winner.find({ userId }).sort({ createdAt: -1 }).limit(10)
        .populate('drawId', 'name month year scheduledDate winningNumbers')
        .lean(),
      Subscription.findOne({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    const totalWon = recentWinnings
      .filter((w) => w.status === 'paid')
      .reduce((sum, w) => sum + w.prize, 0);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        scores,
        subscription,
        winnings: {
          recent: recentWinnings,
          totalWon,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/users/winnings ───────────────────────────────────────────────────
exports.getWinnings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [winnings, total] = await Promise.all([
      Winner.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('drawId', 'name scheduledDate winningNumbers')
        .lean(),
      Winner.countDocuments({ userId: req.user._id }),
    ]);

    const totalWon = await Winner.aggregate([
      { $match: { userId: req.user._id, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$prize' } } },
    ]);

    res.json({
      success: true,
      data: {
        winnings,
        totalWon: totalWon[0]?.total || 0,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

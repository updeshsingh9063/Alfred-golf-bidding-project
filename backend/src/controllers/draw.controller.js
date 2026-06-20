const Draw = require('../models/Draw.model');
const Winner = require('../models/Winner.model');
const User = require('../models/User.model');
const { getUserDrawNumbers } = require('../services/score.service');

// ── GET /api/draws ─────────────────────────────────────────────────────────────
// Public: returns published draws + upcoming draw
exports.getPublicDraws = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [draws, total] = await Promise.all([
      Draw.find({ status: { $in: ['published', 'upcoming'] } })
        .select('-entries') // Exclude entries for public view (performance)
        .sort({ scheduledDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Draw.countDocuments({ status: { $in: ['published', 'upcoming'] } }),
    ]);

    res.json({
      success: true,
      data: {
        draws,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/draws/upcoming ────────────────────────────────────────────────────
exports.getUpcomingDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findOne({ status: 'upcoming' })
      .sort({ scheduledDate: 1 })
      .select('-entries')
      .lean();

    res.json({ success: true, data: { draw } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/draws/:id ────────────────────────────────────────────────────────
exports.getDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id)
      .select('-entries') // Don't expose all entries publicly
      .lean();

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found.' });
    }

    res.json({ success: true, data: { draw } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/draws/my-history ──────────────────────────────────────────────────
// Subscriber: get their personal draw participation history
exports.getMyDrawHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;
    const userIdStr = userId.toString();

    // Get draws where user participated
    const skip = (page - 1) * limit;
    const draws = await Draw.find({
      status: 'published',
      'entries.userId': userId,
    })
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // For each draw, extract user's entry
    const history = draws.map((draw) => {
      const userEntry = draw.entries?.find(
        (e) => e.userId?.toString() === userIdStr
      );
      return {
        drawId: draw._id,
        drawName: draw.name,
        month: draw.month,
        year: draw.year,
        date: draw.scheduledDate,
        winningNumbers: draw.winningNumbers,
        userNumbers: userEntry?.userNumbers || [],
        matchedCount: userEntry?.matchedCount || 0,
        tier: userEntry?.tier || null,
        prizeAmount: userEntry?.prizeAmount || 0,
        status: draw.status,
      };
    });

    const total = await Draw.countDocuments({
      status: 'published',
      'entries.userId': userId,
    });

    res.json({
      success: true,
      data: {
        history,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/draws/current-entry ──────────────────────────────────────────────
// Get logged-in user's entry numbers for the upcoming draw
exports.getCurrentEntry = async (req, res, next) => {
  try {
    const drawNumbers = await getUserDrawNumbers(req.user._id);
    const upcomingDraw = await Draw.findOne({ status: 'upcoming' })
      .sort({ scheduledDate: 1 })
      .select('name month year scheduledDate totalPrizePool jackpotRollover')
      .lean();

    res.json({
      success: true,
      data: {
        drawNumbers,
        upcomingDraw,
        isEligible: drawNumbers.length === 5,
      },
    });
  } catch (error) {
    next(error);
  }
};

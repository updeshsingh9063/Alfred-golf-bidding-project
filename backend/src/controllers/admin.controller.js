const User = require('../models/User.model');
const Score = require('../models/Score.model');
const Draw = require('../models/Draw.model');
const Winner = require('../models/Winner.model');
const Charity = require('../models/Charity.model');
const Subscription = require('../models/Subscription.model');
const { executeDraw, getEligibleParticipants, calculatePrizePool } = require('../services/draw.service');
const { sanitizeUser } = require('../utils/jwt.utils');

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════

exports.getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeSubscribers,
      totalPaid,
      charityContributions,
      totalDraws,
      totalWinners,
      prizePool,
      recentUsers,
      monthlyGrowth,
    ] = await Promise.all([
      User.countDocuments({ isActive: true, role: 'subscriber' }),
      User.countDocuments({ 'subscription.status': 'active', role: 'subscriber' }),
      Winner.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$prize' } } }]),
      User.aggregate([
        { $match: { 'subscription.status': 'active' } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: [
                  '$subscription.amount',
                  { $divide: ['$charityPercent', 100] },
                ],
              },
            },
          },
        },
      ]),
      Draw.countDocuments(),
      Winner.countDocuments(),
      calculatePrizePool(),
      User.find({ role: 'subscriber' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email subscription.status createdAt')
        .lean(),
      // Last 6 months user growth
      User.aggregate([
        { $match: { role: 'subscriber', createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeSubscribers,
          totalPaidOut: totalPaid[0]?.total || 0,
          charityContributed: charityContributions[0]?.total || 0,
          totalDraws,
          totalWinners,
          currentPrizePool: prizePool,
        },
        recentUsers,
        monthlyGrowth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      plan,
      search,
      sort = '-createdAt',
    } = req.query;

    const query = { role: 'subscriber' };
    if (status) query['subscription.status'] = status;
    if (plan) query['subscription.plan'] = plan;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('charityId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    for (const user of users) {
      user.scoresCount = await Score.countDocuments({ userId: user._id, isDeleted: false });
    }

    res.json({
      success: true,
      data: {
        users: users.map(sanitizeUser),
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('charityId', 'name slug logoUrl')
      .lean();

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const [scores, winnings, subscription] = await Promise.all([
      Score.find({ userId: user._id, isDeleted: false }).sort({ date: -1 }).lean(),
      Winner.find({ userId: user._id }).sort({ createdAt: -1 }).lean(),
      Subscription.findOne({ userId: user._id }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      success: true,
      data: { user: sanitizeUser(user), scores, winnings, subscription },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'isActive', 'charityId', 'charityPercent', 'role'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).lean();

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, message: 'User updated.', data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

exports.updateUserSubscription = async (req, res, next) => {
  try {
    const { status, plan } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (status) user.subscription.status = status;
    if (plan) user.subscription.plan = plan;
    await user.save();

    // Update Subscription model too
    await Subscription.findOneAndUpdate(
      { userId: user._id, status: 'active' },
      { ...(status && { status }), ...(plan && { plan }) }
    );

    res.json({ success: true, message: 'Subscription updated.', data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

// Admin: edit a user's score
exports.updateUserScore = async (req, res, next) => {
  try {
    const { date, score, course } = req.body;
    const scoreDoc = await Score.findOne({ _id: req.params.scoreId, userId: req.params.id });
    if (!scoreDoc) return res.status(404).json({ success: false, message: 'Score not found.' });

    if (date) scoreDoc.date = new Date(date);
    if (score !== undefined) scoreDoc.score = score;
    if (course !== undefined) scoreDoc.course = course;
    await scoreDoc.save();

    res.json({ success: true, message: 'Score updated by admin.', data: { score: scoreDoc } });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// DRAW MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

exports.getAllDraws = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [draws, total] = await Promise.all([
      Draw.find(query).sort({ scheduledDate: -1 }).skip(skip).limit(Number(limit)).lean(),
      Draw.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { draws, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    next(error);
  }
};

exports.createDraw = async (req, res, next) => {
  try {
    const { name, month, year, scheduledDate, drawMethod } = req.body;

    const draw = await Draw.create({
      name,
      month,
      year,
      scheduledDate: new Date(scheduledDate),
      drawMethod: drawMethod || 'random',
    });

    res.status(201).json({ success: true, message: 'Draw created.', data: { draw } });
  } catch (error) {
    next(error);
  }
};

exports.updateDraw = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'scheduledDate', 'drawMethod', 'notes'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const draw = await Draw.findByIdAndUpdate(req.params.id, updates, { new: true }).lean();
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found.' });

    res.json({ success: true, data: { draw } });
  } catch (error) {
    next(error);
  }
};

exports.simulateDraw = async (req, res, next) => {
  try {
    const { method = 'random' } = req.body;
    const draw = await executeDraw(req.params.id, { publish: false, method });

    res.json({
      success: true,
      message: 'Draw simulated. Review results before publishing.',
      data: { draw },
    });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

exports.publishDraw = async (req, res, next) => {
  try {
    const { method = 'random' } = req.body;
    const draw = await executeDraw(req.params.id, { publish: true, method });
    draw.publishedBy = req.user._id;
    await draw.save();

    res.json({
      success: true,
      message: 'Draw published. Winners notified by email.',
      data: { draw },
    });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

exports.getDrawParticipants = async (req, res, next) => {
  try {
    const participants = await getEligibleParticipants();
    const prizePool = await calculatePrizePool();

    res.json({
      success: true,
      data: { participants, participantCount: participants.length, estimatedPrizePool: prizePool },
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// CHARITY MANAGEMENT (Admin CRUD)
// ══════════════════════════════════════════════════════════════════════════════

exports.getAllCharities = async (req, res, next) => {
  try {
    const charities = await Charity.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: { charities } });
  } catch (error) {
    next(error);
  }
};

exports.createCharity = async (req, res, next) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({ success: true, message: 'Charity created.', data: { charity } });
  } catch (error) {
    next(error);
  }
};

exports.updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found.' });

    res.json({ success: true, message: 'Charity updated.', data: { charity } });
  } catch (error) {
    next(error);
  }
};

exports.deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found.' });

    res.json({ success: true, message: 'Charity deactivated.' });
  } catch (error) {
    next(error);
  }
};

exports.setFeaturedCharity = async (req, res, next) => {
  try {
    // Unset all featured
    await Charity.updateMany({}, { isFeatured: false });
    // Set this one as featured
    const charity = await Charity.findByIdAndUpdate(req.params.id, { isFeatured: true }, { new: true });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found.' });

    res.json({ success: true, message: 'Featured charity updated.', data: { charity } });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// WINNER MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

exports.getAllWinners = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, drawId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (drawId) query.drawId = drawId;

    const skip = (page - 1) * limit;
    const [winners, total] = await Promise.all([
      Winner.find(query)
        .populate('drawId', 'name month year scheduledDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Winner.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { winners, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyWinner = async (req, res, next) => {
  try {
    const { action, rejectionReason, paymentReference } = req.body; // action: 'approve' | 'reject' | 'pay'

    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner record not found.' });

    if (action === 'approve') {
      winner.status = 'approved';
      winner.verifiedBy = req.user._id;
      winner.verifiedAt = new Date();
    } else if (action === 'reject') {
      winner.status = 'rejected';
      winner.verifiedBy = req.user._id;
      winner.verifiedAt = new Date();
      winner.rejectionReason = rejectionReason || '';
    } else if (action === 'pay') {
      if (winner.status !== 'approved') {
        return res.status(400).json({ success: false, message: 'Winner must be approved before marking as paid.' });
      }
      winner.status = 'paid';
      winner.paidBy = req.user._id;
      winner.paidAt = new Date();
      winner.paymentReference = paymentReference || '';
    } else {
      return res.status(400).json({ success: false, message: 'Action must be "approve", "reject", or "pay".' });
    }

    await winner.save();

    res.json({ success: true, message: `Winner ${action}d successfully.`, data: { winner } });
  } catch (error) {
    next(error);
  }
};

const Draw = require('../models/Draw.model');
const Winner = require('../models/Winner.model');
const User = require('../models/User.model');
const Score = require('../models/Score.model');
const { sendDrawResultEmail, sendWinnerNotificationEmail } = require('./email.service');

const MAX_SCORES = 5;
const MIN_SCORES_FOR_ENTRY = 5;

/**
 * Get all active subscribers with exactly 5 scores (eligible for draw)
 */
const getEligibleParticipants = async () => {
  const users = await User.find({
    'subscription.status': 'active',
    isActive: true,
    role: 'subscriber',
  }).lean();

  const participants = [];

  for (const user of users) {
    const scores = await Score.find({ userId: user._id, isDeleted: false })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    if (scores.length === MIN_SCORES_FOR_ENTRY) {
      participants.push({
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userNumbers: scores.map((s) => s.score),
      });
    }
  }

  return participants;
};

/**
 * Generate random winning numbers (5 unique numbers between 1-45)
 */
const generateRandomWinningNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Generate algorithmic winning numbers weighted by frequency of scores
 * Picks numbers that balance between most and least frequent scores.
 */
const generateAlgorithmicWinningNumbers = async () => {
  // Aggregate score frequency from last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const scoreFrequencies = await Score.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: threeMonthsAgo },
      },
    },
    {
      $group: {
        _id: '$score',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  if (scoreFrequencies.length < 5) {
    // Fall back to random if not enough data
    return generateRandomWinningNumbers();
  }

  // Pick a mix: 2 most common, 2 least common, 1 random mid-range
  const mostCommon = scoreFrequencies.slice(0, 5).map((s) => s._id);
  const leastCommon = scoreFrequencies.slice(-5).map((s) => s._id);

  const candidates = [...new Set([...mostCommon, ...leastCommon])];
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).sort((a, b) => a - b);
};

/**
 * Count how many numbers from array A appear in array B
 */
const countMatches = (userNumbers, winningNumbers) => {
  const winSet = new Set(winningNumbers);
  return userNumbers.filter((n) => winSet.has(n)).length;
};

/**
 * Determine tier based on match count
 */
const getTier = (matchCount) => {
  if (matchCount >= 5) return 5;
  if (matchCount >= 4) return 4;
  if (matchCount >= 3) return 3;
  return null;
};

/**
 * Calculate prize pool from active subscribers
 */
const calculatePrizePool = async () => {
  const activeSubscribers = await User.find({ 'subscription.status': 'active' }).lean();
  
  let totalContributions = 0;
  for (const user of activeSubscribers) {
    const amount = user.subscription?.amount || 0;
    const charityPct = user.charityPercent || 15;
    const platformPct = 25; // Fixed
    const prizePct = 100 - charityPct - platformPct;
    const contribution = Math.floor(amount * (prizePct / 100));
    totalContributions += contribution;
  }

  return totalContributions;
};

/**
 * Run or simulate a draw
 */
const executeDraw = async (drawId, { publish = false, method = 'random' } = {}) => {
  const draw = await Draw.findById(drawId);
  if (!draw) {
    const err = new Error('Draw not found.');
    err.statusCode = 404;
    throw err;
  }

  if (draw.status === 'published') {
    const err = new Error('Draw has already been published.');
    err.statusCode = 400;
    throw err;
  }

  // Generate winning numbers
  let winningNumbers;
  if (method === 'algorithmic') {
    winningNumbers = await generateAlgorithmicWinningNumbers();
  } else {
    winningNumbers = generateRandomWinningNumbers();
  }

  // Get eligible participants
  const participants = await getEligibleParticipants();

  // Calculate prize pool
  const prizePool = await calculatePrizePool();
  
  // Add any jackpot rollover
  const totalPool = prizePool + (draw.jackpotRollover || 0);
  
  // Split prize pools
  const jackpotPool = Math.floor(totalPool * 0.40);
  const secondTierPool = Math.floor(totalPool * 0.35);
  const thirdTierPool = Math.floor(totalPool * 0.25);

  // Process each participant's entry
  const entries = [];
  const tier5Winners = [];
  const tier4Winners = [];
  const tier3Winners = [];

  for (const participant of participants) {
    const matchedCount = countMatches(participant.userNumbers, winningNumbers);
    const tier = getTier(matchedCount);

    const entry = {
      userId: participant.userId,
      userNumbers: participant.userNumbers,
      matchedCount,
      tier,
      prizeAmount: 0,
    };
    entries.push(entry);

    if (tier === 5) tier5Winners.push(entry);
    else if (tier === 4) tier4Winners.push(entry);
    else if (tier === 3) tier3Winners.push(entry);
  }

  // Calculate individual prizes (split equally within tier)
  const jackpotPrize = tier5Winners.length > 0 ? Math.floor(jackpotPool / tier5Winners.length) : 0;
  const secondPrize = tier4Winners.length > 0 ? Math.floor(secondTierPool / tier4Winners.length) : 0;
  const thirdPrize = tier3Winners.length > 0 ? Math.floor(thirdTierPool / tier3Winners.length) : 0;

  // Set prize amounts in entries
  for (const entry of entries) {
    if (entry.tier === 5) entry.prizeAmount = jackpotPrize;
    else if (entry.tier === 4) entry.prizeAmount = secondPrize;
    else if (entry.tier === 3) entry.prizeAmount = thirdPrize;
  }

  // Jackpot rollover if no tier-5 winners
  const nextJackpotRollover = tier5Winners.length === 0 ? jackpotPool : 0;

  // Update draw document
  draw.winningNumbers = winningNumbers;
  draw.entries = entries;
  draw.participantCount = participants.length;
  draw.totalPrizePool = totalPool;
  draw.jackpotPool = jackpotPool;
  draw.secondTierPool = secondTierPool;
  draw.thirdTierPool = thirdTierPool;
  draw.drawMethod = method;
  draw.winners = {
    tier5: { count: tier5Winners.length, prizeEach: jackpotPrize },
    tier4: { count: tier4Winners.length, prizeEach: secondPrize },
    tier3: { count: tier3Winners.length, prizeEach: thirdPrize },
  };

  if (publish) {
    draw.status = 'published';
    draw.publishedAt = new Date();
  } else {
    draw.status = 'simulated';
    draw.simulatedAt = new Date();
  }

  await draw.save();

  // If publishing, create Winner records and send notifications
  if (publish) {
    const allWinners = [
      ...tier5Winners.map((e) => ({ ...e, tier: 5 })),
      ...tier4Winners.map((e) => ({ ...e, tier: 4 })),
      ...tier3Winners.map((e) => ({ ...e, tier: 3 })),
    ];

    for (const winnerEntry of allWinners) {
      const user = participants.find(
        (p) => p.userId.toString() === winnerEntry.userId.toString()
      );
      if (!user) continue;

      // Create Winner record (upsert to avoid duplicates if re-run)
      const winnerRecord = await Winner.findOneAndUpdate(
        { userId: winnerEntry.userId, drawId: draw._id },
        {
          userId: winnerEntry.userId,
          drawId: draw._id,
          userName: user.userName,
          userEmail: user.userEmail,
          drawName: draw.name,
          drawDate: draw.scheduledDate,
          tier: winnerEntry.tier,
          userNumbers: winnerEntry.userNumbers,
          winningNumbers,
          matchedNumbers: winnerEntry.userNumbers.filter((n) => winningNumbers.includes(n)),
          prize: winnerEntry.prizeAmount,
          status: 'pending',
        },
        { upsert: true, new: true }
      );

      // Send winner notification email
      const userDoc = await User.findById(winnerEntry.userId).select('firstName email').lean();
      if (userDoc) {
        await sendWinnerNotificationEmail(userDoc, winnerRecord, draw);
      }
    }

    // Send draw result emails to all participants
    for (const participant of participants) {
      const userDoc = await User.findById(participant.userId).select('firstName email').lean();
      if (userDoc) {
        await sendDrawResultEmail(userDoc, draw);
      }
    }

    // Update next draw's jackpot rollover
    if (nextJackpotRollover > 0) {
      const nextDraw = await Draw.findOne({
        status: 'upcoming',
        scheduledDate: { $gt: draw.scheduledDate },
      }).sort({ scheduledDate: 1 });

      if (nextDraw) {
        nextDraw.jackpotRollover = (nextDraw.jackpotRollover || 0) + nextJackpotRollover;
        await nextDraw.save();
      }
    }
  }

  return draw;
};

module.exports = {
  getEligibleParticipants,
  generateRandomWinningNumbers,
  generateAlgorithmicWinningNumbers,
  executeDraw,
  calculatePrizePool,
};

const Score = require('../models/Score.model');

const MAX_SCORES = 5;

/**
 * Get a user's active scores (latest 5, sorted most recent first)
 */
const getUserScores = async (userId) => {
  return Score.find({ userId, isDeleted: false })
    .sort({ date: -1 })
    .limit(MAX_SCORES)
    .lean();
};

/**
 * Add or update a score for a user.
 * - Only one score per date allowed.
 * - Rolling window: if user already has 5 scores, oldest is soft-deleted.
 * @returns { score, wasReplaced } 
 */
const addScore = async (userId, { date, score, course }) => {
  const scoreDate = new Date(date);
  scoreDate.setUTCHours(0, 0, 0, 0);

  // Enforce one score per date
  const existingForDate = await Score.findOne({
    userId,
    date: scoreDate,
    isDeleted: false,
  });

  if (existingForDate) {
    const err = new Error('A score entry already exists for this date. Please edit the existing score.');
    err.statusCode = 409;
    throw err;
  }

  // Count current active scores
  const activeScores = await Score.find({ userId, isDeleted: false })
    .sort({ date: -1 })
    .lean();

  let wasReplaced = false;

  // If already at 5 scores, soft-delete the oldest
  if (activeScores.length >= MAX_SCORES) {
    const oldest = activeScores[activeScores.length - 1];
    await Score.findByIdAndUpdate(oldest._id, { isDeleted: true });
    wasReplaced = true;
  }

  // Create the new score
  const newScore = await Score.create({
    userId,
    date: scoreDate,
    score,
    course: course || '',
  });

  return { score: newScore, wasReplaced };
};

/**
 * Update an existing score (date + score + course)
 */
const updateScore = async (userId, scoreId, updates) => {
  const scoreDoc = await Score.findOne({ _id: scoreId, userId, isDeleted: false });
  if (!scoreDoc) {
    const err = new Error('Score not found or not owned by this user.');
    err.statusCode = 404;
    throw err;
  }

  // If date is changing, check uniqueness
  if (updates.date) {
    const newDate = new Date(updates.date);
    newDate.setUTCHours(0, 0, 0, 0);
    const conflict = await Score.findOne({
      userId,
      date: newDate,
      isDeleted: false,
      _id: { $ne: scoreId },
    });
    if (conflict) {
      const err = new Error('A score already exists for the new date.');
      err.statusCode = 409;
      throw err;
    }
    updates.date = newDate;
  }

  Object.assign(scoreDoc, updates);
  await scoreDoc.save();
  return scoreDoc;
};

/**
 * Soft-delete a score
 */
const deleteScore = async (userId, scoreId) => {
  const scoreDoc = await Score.findOne({ _id: scoreId, userId, isDeleted: false });
  if (!scoreDoc) {
    const err = new Error('Score not found.');
    err.statusCode = 404;
    throw err;
  }
  scoreDoc.isDeleted = true;
  await scoreDoc.save();
  return scoreDoc;
};

/**
 * Get a user's latest 5 score VALUES (for draw entry numbers)
 */
const getUserDrawNumbers = async (userId) => {
  const scores = await getUserScores(userId);
  return scores.map((s) => s.score);
};

module.exports = { getUserScores, addScore, updateScore, deleteScore, getUserDrawNumbers };

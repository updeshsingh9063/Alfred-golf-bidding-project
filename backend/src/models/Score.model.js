const mongoose = require('mongoose');

/**
 * Score Model
 * - Each user has a rolling window of up to 5 scores.
 * - Scores must be in Stableford format (1–45).
 * - Only one score per date per user is allowed.
 * - A new score beyond 5 replaces the oldest.
 */
const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Score date is required'],
    },
    score: {
      type: Number,
      required: [true, 'Score value is required'],
      min: [1, 'Score must be at least 1 (Stableford)'],
      max: [45, 'Score cannot exceed 45 (Stableford)'],
    },
    course: {
      type: String,
      trim: true,
      maxlength: [100, 'Course name cannot exceed 100 characters'],
      default: '',
    },
    // Soft-delete support
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// ── Compound index: one score per user per date ───────────────────────────────
scoreSchema.index({ userId: 1, date: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

// ── Helper: date-only string (YYYY-MM-DD) ─────────────────────────────────────
scoreSchema.methods.dateString = function () {
  return this.date.toISOString().split('T')[0];
};

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;

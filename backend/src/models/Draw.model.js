const mongoose = require('mongoose');

/**
 * Draw Model
 * Monthly draws. Winning numbers are 5 numbers drawn from participants' scores.
 * Each participating user's 5 most recent scores become their "entry numbers".
 */
const drawEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userNumbers: {
    type: [Number],
    validate: {
      validator: (v) => v.length === 5 && v.every((n) => n >= 1 && n <= 45),
      message: 'Entry must contain exactly 5 Stableford scores (1-45)',
    },
  },
  matchedCount: { type: Number, default: 0 },
  tier: { type: Number, enum: [3, 4, 5, null], default: null },
  prizeAmount: { type: Number, default: 0 },
}, { _id: false });

const drawSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Draw name is required'],
      trim: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2024,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'in_progress', 'simulated', 'published', 'cancelled'],
      default: 'upcoming',
    },
    // Draw logic
    drawMethod: {
      type: String,
      enum: ['random', 'algorithmic'],
      default: 'random',
    },
    winningNumbers: {
      type: [Number],
      validate: {
        validator: (v) => v.length === 0 || (v.length === 5 && v.every((n) => n >= 1 && n <= 45)),
        message: 'Winning numbers must be exactly 5 numbers between 1 and 45',
      },
      default: [],
    },
    // Prize pool
    totalPrizePool: { type: Number, default: 0 }, // in pence
    jackpotPool: { type: Number, default: 0 },    // 40% of total
    secondTierPool: { type: Number, default: 0 }, // 35% of total
    thirdTierPool: { type: Number, default: 0 },  // 25% of total
    // Jackpot rollover
    jackpotRollover: { type: Number, default: 0 }, // carried from previous month
    // Participants
    participantCount: { type: Number, default: 0 },
    entries: [drawEntrySchema],
    // Results summary
    winners: {
      tier5: { count: { type: Number, default: 0 }, prizeEach: { type: Number, default: 0 } },
      tier4: { count: { type: Number, default: 0 }, prizeEach: { type: Number, default: 0 } },
      tier3: { count: { type: Number, default: 0 }, prizeEach: { type: Number, default: 0 } },
    },
    // Admin notes
    publishedAt: Date,
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    simulatedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Compound unique: one draw per month/year ──────────────────────────────────
drawSchema.index({ month: 1, year: 1 }, { unique: true });
drawSchema.index({ status: 1 });
drawSchema.index({ scheduledDate: -1 });

const Draw = mongoose.model('Draw', drawSchema);
module.exports = Draw;

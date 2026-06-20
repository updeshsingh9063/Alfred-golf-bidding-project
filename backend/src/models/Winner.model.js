const mongoose = require('mongoose');

/**
 * Winner Model
 * Tracks prize winners who need to submit proof & get verified by admin.
 * States: pending → approved/rejected → paid
 */
const winnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
      required: true,
      index: true,
    },
    // Snapshot data to avoid join issues if user/draw is modified later
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    drawName: { type: String, required: true },
    drawDate: { type: Date, required: true },
    // Win details
    tier: {
      type: Number,
      enum: [3, 4, 5],
      required: true,
    },
    matchedNumbers: [Number],
    userNumbers: [Number],
    winningNumbers: [Number],
    prize: {
      type: Number,
      required: true,
      default: 0,
    }, // in pence
    // Proof & verification
    proofUrl: { type: String, default: '' },
    proofSubmittedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'proof_submitted', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    // Admin actions
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    rejectionReason: String,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paidAt: Date,
    paymentReference: String,
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Compound index: prevent duplicate winner records ──────────────────────────
winnerSchema.index({ userId: 1, drawId: 1 }, { unique: true });
winnerSchema.index({ status: 1 });

const Winner = mongoose.model('Winner', winnerSchema);
module.exports = Winner;

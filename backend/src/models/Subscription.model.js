const mongoose = require('mongoose');

/**
 * Subscription Model - tracks full subscription history & billing
 */
const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'lapsed', 'past_due'],
      default: 'inactive',
    },
    amount: { type: Number, required: true }, // in pence
    currency: { type: String, default: 'gbp' },
    // Stripe integration
    stripeCustomerId: String,
    stripeSubscriptionId: { type: String, unique: true, sparse: true },
    stripePriceId: String,
    stripeCurrentPeriodStart: Date,
    stripeCurrentPeriodEnd: Date,
    stripeStatus: String,
    // Dates
    startDate: { type: Date, required: true },
    renewalDate: Date,
    cancelledAt: Date,
    lapsedAt: Date,
    // Prize pool contribution (pre-calculated monthly amount in pence)
    prizeContribution: { type: Number, default: 0 },
    // Billing history (sub-documents)
    billingHistory: [
      {
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ['paid', 'failed', 'refunded'], default: 'paid' },
        stripeInvoiceId: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ status: 1, renewalDate: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;

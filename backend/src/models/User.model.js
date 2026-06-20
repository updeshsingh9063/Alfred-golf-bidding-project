const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['subscriber', 'admin'],
      default: 'subscriber',
    },
    // Subscription info (denormalized for quick access)
    subscription: {
      plan: {
        type: String,
        enum: ['monthly', 'yearly', null],
        default: null,
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'lapsed', null],
        default: null,
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      renewalDate: Date,
      cancelledAt: Date,
      amount: Number, // in pence/cents
    },
    // Charity selection
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      default: null,
    },
    charityPercent: {
      type: Number,
      min: [10, 'Charity contribution must be at least 10%'],
      max: [50, 'Charity contribution cannot exceed 50%'],
      default: 15,
    },
    // Profile
    avatar: String,
    phone: String,
    country: { type: String, default: 'GB' },
    // Account state
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLoginAt: Date,
    isActive: { type: Boolean, default: true },
    // Push / email notifications
    notifications: {
      drawResults: { type: Boolean, default: true },
      winnerAlerts: { type: Boolean, default: true },
      subscriptionReminders: { type: Boolean, default: true },
      charityUpdates: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtuals ──────────────────────────────────────────────────────────────────
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isSubscribed').get(function () {
  return this.subscription?.status === 'active';
});

// ── Pre-save: hash password ────────────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Instance method: compare password ─────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Index ─────────────────────────────────────────────────────────────────────
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ role: 1, 'subscription.status': 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;

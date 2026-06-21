const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');

const MONTHLY_PRICE = parseInt(process.env.MONTHLY_PRICE || '2500'); // £25.00 in pence
const YEARLY_PRICE = parseInt(process.env.YEARLY_PRICE || '25000');  // £250.00 in pence

// ── GET /api/subscriptions/plans ──────────────────────────────────────────────
exports.getPlans = async (req, res) => {
  res.json({
    success: true,
    data: {
      plans: [
        {
          id: 'monthly',
          name: 'Monthly',
          price: MONTHLY_PRICE,
          currency: 'gbp',
          interval: 'month',
          features: [
            'Enter every monthly draw',
            'Support your chosen charity',
            'Full score tracking',
            'Access to all platform features',
          ],
        },
        {
          id: 'yearly',
          name: 'Yearly',
          price: YEARLY_PRICE,
          currency: 'gbp',
          interval: 'year',
          savings: (MONTHLY_PRICE * 12) - YEARLY_PRICE,
          features: [
            'Everything in monthly',
            `Save £${((MONTHLY_PRICE * 12 - YEARLY_PRICE) / 100).toFixed(0)} per year`,
            'Priority support',
          ],
        },
      ],
    },
  });
};

// ── GET /api/subscriptions/my ─────────────────────────────────────────────────
exports.getMySubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: { subscription } });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/subscriptions/create ───────────────────────────────────────────
// Creates a subscription manually (for demo/non-Stripe flow)
exports.createSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan must be "monthly" or "yearly".' });
    }

    // Check if user already has active subscription
    const existing = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active subscription.',
      });
    }

    const amount = plan === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE;
    const renewalDate = new Date();
    if (plan === 'monthly') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    // Create subscription record
    const subscription = await Subscription.create({
      userId: req.user._id,
      plan,
      status: 'active',
      amount,
      startDate: new Date(),
      renewalDate,
      billingHistory: [
        {
          date: new Date(),
          amount,
          status: 'paid',
          description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} subscription`,
        },
      ],
    });

    // Update user's subscription info
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.amount': amount,
      'subscription.renewalDate': renewalDate,
    });

    res.status(201).json({
      success: true,
      message: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} subscription activated!`,
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/subscriptions/cancel ───────────────────────────────────────────
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'No active subscription found.' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    // Update user record
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.status': 'cancelled',
      'subscription.cancelledAt': new Date(),
    });

    res.json({
      success: true,
      message: 'Subscription cancelled. You will retain access until your renewal date.',
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/subscriptions/upgrade ──────────────────────────────────────────
exports.upgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan.' });
    }

    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'No active subscription to change.' });
    }

    if (subscription.plan === plan) {
      return res.status(400).json({ success: false, message: 'You are already on this plan.' });
    }

    const amount = plan === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE;
    
    // Update subscription
    subscription.plan = plan;
    subscription.amount = amount;
    
    subscription.billingHistory.push({
      date: new Date(),
      amount,
      status: 'paid',
      description: `Plan changed to ${plan === 'monthly' ? 'Monthly' : 'Yearly'}`,
    });
    
    await subscription.save();

    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': plan,
      'subscription.amount': amount,
    });

    res.json({
      success: true,
      message: `Subscription changed to ${plan} plan.`,
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/subscriptions/create-checkout ───────────────────────────────────
// Stripe Checkout Session creation
exports.createCheckoutSession = async (req, res, next) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return res.status(503).json({
        success: false,
        message: 'Stripe is not configured. Please set up your Stripe keys in the environment variables.',
      });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { plan } = req.body;

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan must be "monthly" or "yearly".' });
    }

    const priceId = plan === 'monthly'
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId: req.user._id.toString(), plan },
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscribe?cancelled=true`,
      customer_email: req.user.email,
    });

    res.json({ success: true, data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/subscriptions/billing ───────────────────────────────────────────
exports.getBillingHistory = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('billingHistory plan amount currency')
      .lean();

    res.json({
      success: true,
      data: { billingHistory: subscription?.billingHistory || [] },
    });
  } catch (error) {
    next(error);
  }
};

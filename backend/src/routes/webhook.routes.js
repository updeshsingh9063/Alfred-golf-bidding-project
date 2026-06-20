const express = require('express');
const router = express.Router();

/**
 * Stripe Webhook handler
 * IMPORTANT: This route must receive RAW body (not parsed JSON).
 * It is mounted BEFORE the express.json() middleware in app.js.
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return res.status(200).json({ received: true, note: 'Stripe not configured.' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const User = require('../models/User.model');
    const Subscription = require('../models/Subscription.model');

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;

          if (!userId || !plan) break;

          const renewalDate = new Date();
          if (plan === 'monthly') renewalDate.setMonth(renewalDate.getMonth() + 1);
          else renewalDate.setFullYear(renewalDate.getFullYear() + 1);

          const amount = plan === 'monthly'
            ? parseInt(process.env.MONTHLY_PRICE || '2500')
            : parseInt(process.env.YEARLY_PRICE || '25000');

          await Subscription.create({
            userId,
            plan,
            status: 'active',
            amount,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            startDate: new Date(),
            renewalDate,
            billingHistory: [{ date: new Date(), amount, status: 'paid', description: `${plan} subscription via Stripe` }],
          });

          await User.findByIdAndUpdate(userId, {
            'subscription.plan': plan,
            'subscription.status': 'active',
            'subscription.stripeCustomerId': session.customer,
            'subscription.stripeSubscriptionId': session.subscription,
            'subscription.amount': amount,
            'subscription.renewalDate': renewalDate,
          });

          console.log(`✅ Stripe checkout completed for user ${userId}`);
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object;
          const sub = await Subscription.findOne({
            stripeSubscriptionId: invoice.subscription,
          });

          if (sub) {
            sub.billingHistory.push({
              date: new Date(invoice.created * 1000),
              amount: invoice.amount_paid,
              status: 'paid',
              stripeInvoiceId: invoice.id,
              description: 'Subscription renewal',
            });
            sub.status = 'active';
            const renewalDate = new Date(invoice.period_end * 1000);
            sub.renewalDate = renewalDate;
            await sub.save();

            await User.findByIdAndUpdate(sub.userId, {
              'subscription.status': 'active',
              'subscription.renewalDate': renewalDate,
            });
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object;
          const sub = await Subscription.findOne({
            stripeSubscriptionId: invoice.subscription,
          });

          if (sub) {
            sub.status = 'past_due';
            await sub.save();
            await User.findByIdAndUpdate(sub.userId, { 'subscription.status': 'lapsed' });
            console.warn(`⚠️ Payment failed for subscription ${invoice.subscription}`);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          const sub = await Subscription.findOne({
            stripeSubscriptionId: subscription.id,
          });

          if (sub) {
            sub.status = 'cancelled';
            sub.cancelledAt = new Date();
            await sub.save();
            await User.findByIdAndUpdate(sub.userId, {
              'subscription.status': 'cancelled',
              'subscription.cancelledAt': new Date(),
            });
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

module.exports = router;

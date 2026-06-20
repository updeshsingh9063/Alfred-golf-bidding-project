const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth.middleware');

// Public: plan info
router.get('/plans', subscriptionController.getPlans);

// Protected routes
router.use(protect);

router.get('/my', subscriptionController.getMySubscription);
router.post('/create', subscriptionController.createSubscription);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/create-checkout', subscriptionController.createCheckoutSession);
router.get('/billing', subscriptionController.getBillingHistory);

module.exports = router;

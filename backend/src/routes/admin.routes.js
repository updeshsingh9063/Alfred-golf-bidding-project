const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── Analytics ─────────────────────────────────────────────────────────────────
router.get('/analytics', adminController.getAnalytics);

// ── User Management ───────────────────────────────────────────────────────────
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', adminController.updateUser);
router.patch('/users/:id/subscription', adminController.updateUserSubscription);
router.patch('/users/:id/scores/:scoreId', adminController.updateUserScore);

// ── Draw Management ───────────────────────────────────────────────────────────
router.get('/draws', adminController.getAllDraws);
router.get('/draws/participants', adminController.getDrawParticipants); // must be before /:id
router.post('/draws', adminController.createDraw);
router.patch('/draws/:id', adminController.updateDraw);
router.post('/draws/:id/simulate', adminController.simulateDraw);
router.post('/draws/:id/publish', adminController.publishDraw);

// ── Charity Management ────────────────────────────────────────────────────────
router.get('/charities', adminController.getAllCharities);
router.post('/charities', adminController.createCharity);
router.patch('/charities/:id', adminController.updateCharity);
router.delete('/charities/:id', adminController.deleteCharity);
router.patch('/charities/:id/feature', adminController.setFeaturedCharity);

// ── Winner Management ─────────────────────────────────────────────────────────
router.get('/winners', adminController.getAllWinners);
router.patch('/winners/:id/verify', adminController.verifyWinner);

module.exports = router;

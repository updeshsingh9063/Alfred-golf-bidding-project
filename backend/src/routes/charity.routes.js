const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charity.controller');

// Public routes (no auth needed)
router.get('/', charityController.getAllCharities);
router.get('/featured', charityController.getFeaturedCharity);
router.get('/categories', charityController.getCategories);
router.get('/id/:id', charityController.getCharityById);
router.get('/:slug', charityController.getCharityBySlug);

module.exports = router;

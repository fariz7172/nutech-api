const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const informationController = require('../controllers/informationController');

// @route   GET /banner
// @desc    Get all banners
// @access  Public
router.get('/banner', informationController.getBanners);

// @route   GET /services
// @desc    Get all services
// @access  Private
router.get('/services', authMiddleware, informationController.getServices);

module.exports = router;

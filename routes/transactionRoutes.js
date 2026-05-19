const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/transactionController');

const { check, validationResult } = require('express-validator');

// @route   GET /balance
// @desc    Get user balance
// @access  Private
router.get('/balance', authMiddleware, transactionController.getBalance);

// @route   POST /topup
// @desc    Top up user balance
// @access  Private
router.post(
  '/topup',
  authMiddleware,
  [
    check('top_up_amount')
      .isNumeric().withMessage('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0')
      .custom((value) => {
        if (value <= 0) {
          throw new Error('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
        }
        return true;
      })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  },
  transactionController.topup
);

// @route   POST /transaction
// @desc    Do a service transaction (Payment)
// @access  Private
router.post(
  '/transaction',
  authMiddleware,
  [
    check('service_code')
      .not().isEmpty().withMessage('Service ataus Layanan tidak ditemukan')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  },
  transactionController.transaction
);

// @route   GET /transaction/history
// @desc    Get user transaction history
// @access  Private
router.get('/transaction/history', authMiddleware, transactionController.history);

module.exports = router;

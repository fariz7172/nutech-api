const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// @route   POST /registration
// @desc    Register a user
// @access  Public
router.post(
  '/registration',
  [
    check('email', 'Paramter email tidak sesuai format').isEmail(),
    check('first_name', 'First name is required').not().isEmpty(),
    check('last_name', 'Last name is required').not().isEmpty(),
    check('password', 'Parameter password harus memiliki minimal 8 karakter').isLength({ min: 8 })
  ],
  authController.registration
);

// @route   POST /login
// @desc    Login a user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Paramter email tidak sesuai format').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

module.exports = router;

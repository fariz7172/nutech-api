const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Format Image tidak sesuai'), false);
    }
  }
});

// @route   GET /profile
// @desc    Get user profile
// @access  Private (Requires Token)
router.get('/profile', authMiddleware, profileController.getProfile);

// @route   PUT /profile/update
// @desc    Update user profile (first_name, last_name)
// @access  Private
router.put('/profile/update', authMiddleware, profileController.updateProfile);

// Middleware khusus untuk menangani error multer agar mengembalikan status 102
const handleMulterUpload = (req, res, next) => {
  const uploadSingle = upload.single('file'); // field name "file"
  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        status: 102,
        message: err.message === 'Format Image tidak sesuai' ? err.message : "Format Image tidak sesuai",
        data: null
      });
    }
    next();
  });
};

// @route   PUT /profile/image
// @desc    Update user profile image
// @access  Private
router.put('/profile/image', authMiddleware, handleMulterUpload, profileController.updateProfileImage);

module.exports = router;

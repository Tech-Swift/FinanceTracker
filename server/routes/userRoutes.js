const express = require('express');
const router = express.Router();
const { signup, login, getUserProfile, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Route for signing up a new user
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;

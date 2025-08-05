const express = require('express');
const router = express.Router();
const { signup, login, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Route for signing up a new user
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);


module.exports = router;

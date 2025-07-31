const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');

// Route for signing up a new user
router.post('/signup', signup);
router.post('/login', login);


module.exports = router;

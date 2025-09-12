const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { resetPassword } = require('../controllers/userController');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  phone: {
    type: String,
    trim: true,
    default: null,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  resetPasswordToken:{
    type: String,
    default: null,
  },
  resetPasswordExpires:{
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  targetAmount: {
    type: Number,
    required: true,
    min: [0, 'Target amount must be a positive number']
  },

  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be a positive number']
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', //link goals with spending categories
  },

  deadline: {
    type: Date
  },

  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);

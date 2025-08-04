const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },

  color: {
    type: String,
    default: '#000000'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);

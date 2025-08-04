const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive number']
  },

  description: {
    type: String,
    trim: true
  },

  date: {
    type: Date,
    default: Date.now
  }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transactions', transactionSchema);

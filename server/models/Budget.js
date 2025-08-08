const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0, 'Budget amount must be a positive number'],
    },

    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent must be a positive number'],
    },

    remaining: {
      type: Number,
      default: function () {
        return this.amount;
      },
    },

    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'monthly',
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 🔁 Automatically recalculate `remaining` before saving
budgetSchema.pre('save', function (next) {
  this.remaining = this.amount - this.spent;
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);

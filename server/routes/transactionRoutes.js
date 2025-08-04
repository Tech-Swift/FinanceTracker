const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

const { protect } = require('../middlewares/authMiddleware');

// Create & Read
router.route('/')
  .post(protect, createTransaction)
  .get(protect, getTransactions);

// Update & Delete
router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;

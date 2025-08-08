const express = require('express')
const router = express.Router();

const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getFullySpentBudgets
} = require('../controllers/budgetController');

const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createBudget)
  .get(protect, getBudgets);

router.route('/spent')
  .get(protect, getFullySpentBudgets);

router.route('/:id')
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router

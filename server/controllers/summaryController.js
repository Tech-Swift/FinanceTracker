const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Transactions
    const transactions = await Transaction.find({ userId }).populate('categoryId');
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    // ✅ Budgets - fetch from DB
    const budgets = await Budget.find({ userId });

    const budgetUsage = await Promise.all(
      budgets.map(async (budget) => {
        const spent = transactions
          .filter(tx => tx.categoryId?.toString() === budget.categoryId?.toString())
          .reduce((sum, tx) => sum + tx.amount, 0);

        return {
          category: budget.categoryId?.name || 'Unknown',
          limit: budget.amount,
          spent,
          remaining: budget.amount - spent,
          status: spent > budget.amount ? 'over budget' : 'on track'
        };
      })
    );

    // Goals
    const goals = await Goal.find({ userId });
    const goalsProgress = goals.map(goal => ({
      title: goal.title,
      target: goal.targetAmount,
      current: goal.currentAmount,
      remaining: goal.targetAmount - goal.currentAmount,
      deadline: goal.deadline
    }));

    // Final Response
    res.status(200).json({
      totalIncome,
      totalExpenses,
      netBalance,
      budgetUsage,
      goalsProgress
    });

  } catch (error) {
    console.error('Summary error:', error); // Add for debugging
    res.status(500).json({ message: 'Failed to get summary', error: error.message });
  }
};

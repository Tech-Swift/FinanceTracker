const Budget = require('../models/Budget');

//Create Budget

exports.createBudget = async (req, res) => {
  const { categoryId, amount, period, startDate, endDate } = req.body;

  if (!categoryId || amount === undefined || !period) {
    return res.status(400).json({ message: 'Category, amount and perios are required' });
  }

  try {
    const budget = new Budget({
      userId: req.user._id,
      categoryId,
      amount,
      period,
      startDate: startDate || Date.now(),
      endDate
    });

    const savedBudget = await budget.save();

    res.status(201).json({
      message: 'Budget created successfully',
      budget: savedBudget
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Budget', error: error.message });
  }
};

//READ : get all budget for a user

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).populate('categoryId');
    res.status(200).json({ budgets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budgets', error: error.message });
  }
};

// UPDATE a budget
exports.updateBudget = async (req, res) => {
  const budgetId = req.params.id;
  const { categoryId, amount, period, startDate, endDate } = req.body;

  try {
    const budget = await Budget.findOne({ _id: budgetId, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    if (categoryId) budget.categoryId = categoryId;
    if (amount !== undefined) budget.amount = amount;
    if (period) budget.period = period;
    if (startDate) budget.startDate = startDate;
    if (endDate) budget.endDate = endDate;

    const updatedBudget = await budget.save();

    res.status(200).json({
      message: 'Budget updated successfully',
      budget: updatedBudget
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update budget', error: error.message });
  }
};

// DELETE a budget
exports.deleteBudget = async (req, res) => {
  const budgetId = req.params.id;

  try {
    const deleted = await Budget.findOneAndDelete({ _id: budgetId, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget', error: error.message });
  }
};

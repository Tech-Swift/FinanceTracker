const Budget = require('../models/Budget');

// CREATE Budget
exports.createBudget = async (req, res) => {
  const { category, amount, startDate, endDate, period } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user context' });
    }

    if (!category || amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    // Log incoming data for debugging
    console.log("📥 Budget Payload:", req.body);

    const budget = new Budget({
      userId: req.user._id,
      categoryId: typeof category === 'object' ? category._id : category,
      amount,
      period: period || 'monthly',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
    });

    const savedBudget = await budget.save();

    res.status(201).json({
      message: '✅ Budget created successfully',
      budget: savedBudget,
    });
  } catch (error) {
    console.error('❌ Budget creation error:', error);
    res.status(500).json({
      message: '❌ Failed to create Budget',
      error: error.message,
    });
  }
};

// READ: Get all budgets for user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id })
      .populate({
        path: 'categoryId',
        select: 'name', // only get name
        model: 'Category',
      });

    // Optional: rename categoryId to category
    const transformedBudgets = budgets.map(budget => ({
      ...budget._doc,
      category: budget.categoryId,
    }));

    res.status(200).json({ budgets: transformedBudgets });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch budgets',
      error: error.message,
    });
  }
};

exports.getFullySpentBudgets = async (req, res) => {
  try {
    const spentBudgets = await Budget.find({
      userId: req.user._id,
      remaining: { $lte: 0 },
    }).populate('categoryId');

    res.status(200).json(spentBudgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching spent budgets' });
  }
};


// UPDATE Budget
exports.updateBudget = async (req, res) => {
  const budgetId = req.params.id;
  const {
    category,
    amount,
    period,
    spent, // ✅ include spent
    startDate,
    endDate,
  } = req.body;

  try {
    const budget = await Budget.findOne({
      _id: budgetId,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    // Update fields if present
    if (category) {
      budget.categoryId = typeof category === 'object' ? category._id : category;
    }

    if (amount !== undefined) budget.amount = amount;
    if (spent !== undefined) budget.spent = spent; // ✅ update spent
    if (period) budget.period = period;
    if (startDate) budget.startDate = new Date(startDate);
    if (endDate) budget.endDate = new Date(endDate);

    // ✅ Recalculate remaining before saving
    budget.remaining = budget.amount - budget.spent;

    const updatedBudget = await budget.save();

    // ✅ Populate category for UI
    await updatedBudget.populate('categoryId');

    res.status(200).json({
      message: '✅ Budget updated successfully',
      budget: {
        ...updatedBudget.toObject(),
        category: updatedBudget.categoryId, // alias for frontend
      },
    });
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).json({
      message: 'Failed to update budget',
      error: error.message,
    });
  }
};


// DELETE Budget
exports.deleteBudget = async (req, res) => {
  const budgetId = req.params.id;

  try {
    const deleted = await Budget.findOneAndDelete({ _id: budgetId, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }

    res.status(200).json({ message: '✅ Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete budget',
      error: error.message,
    });
  }
};

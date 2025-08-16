const Transaction = require('../models/Transaction');

// CREATE
exports.createTransaction = async (req, res) => {
  const { type, categoryId, amount, description, date } = req.body || {};

  if (!type || !categoryId || amount === undefined) {
    return res.status(400).json({ message: 'Type, category, and amount are required' });
  }

  try {
    const transaction = new Transaction({
      userId: req.user._id,
      type,
      categoryId,
      amount,
      description,
      date: date || Date.now(),
    });

    const savedTransaction = await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: savedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error: error.message });
  }
};

// READ
exports.getTransactions = async (req, res) => {
  try {
    const { from, to, type, search } = req.query;

    const query = { userId: req.user._id };

    // 1. Date filter
    if (from && to) {
      const startDate = new Date(from);
      const endDate = new Date(to);

      // Ensure we include the full day for 'to'
      endDate.setHours(23, 59, 59, 999);

      query.date = { $gte: startDate, $lte: endDate };
    }

    // 2. Type filter
    if (type && type !== "all") {
      query.type = type;
    }

    // 3. Get all transactions (will filter category after)
    let transactions = await Transaction.find(query).populate("categoryId");

    // 4. Text search: description + category name
    if (search) {
      const searchRegex = new RegExp(search, "i");

      transactions = transactions.filter(txn =>
        searchRegex.test(txn.description) ||
        searchRegex.test(txn.categoryId?.name || "")
      );
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};



// UPDATE
exports.updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { type, categoryId, amount, description, date } = req.body || {};

  try {
    const transaction = await Transaction.findOne({ _id: transactionId, userId: req.user._id });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    if (type) transaction.type = type;
    if (categoryId) transaction.categoryId = categoryId;
    if (amount !== undefined) transaction.amount = amount;
    if (description !== undefined) transaction.description = description;
    if (date) transaction.date = date;

    await transaction.save();

    // ✅ Populate categoryId before returning
    const updatedTransaction = await Transaction.findById(transactionId).populate('categoryId');

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update transaction', error: error.message });
  }
};


// DELETE
exports.deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
  }
};

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
    const transactions = await Transaction.find({ userId: req.user._id }).populate('categoryId');
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
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

    const updatedTransaction = await transaction.save();

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

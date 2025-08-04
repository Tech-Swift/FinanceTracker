const Goal = require('../models/Goal');

// CREATE a new goal
exports.createGoal = async (req, res) => {
  const { title, targetAmount, categoryId, deadline } = req.body;

  if (!title || targetAmount === undefined) {
    return res.status(400).json({ message: 'Title and target amount are required' });
  }

  try {
    const goal = new Goal({
      userId: req.user._id,
      title,
      targetAmount,
      categoryId,
      deadline
    });

    const savedGoal = await goal.save();

    res.status(201).json({ message: 'Goal created successfully', goal: savedGoal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal', error: error.message });
  }
};

// GET all goals for the current user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).populate('categoryId');
    res.status(200).json({ goals });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals', error: error.message });
  }
};

// UPDATE a goal by ID
exports.updateGoal = async (req, res) => {
  const goalId = req.params.id;
  const { title, targetAmount, currentAmount, categoryId, deadline, status } = req.body;

  try {
    const goal = await Goal.findOne({ _id: goalId, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }

    if (title) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (categoryId) goal.categoryId = categoryId;
    if (deadline) goal.deadline = deadline;
    if (status) goal.status = status;

    const updatedGoal = await goal.save();

    res.status(200).json({ message: 'Goal updated successfully', goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal', error: error.message });
  }
};

// DELETE a goal by ID
exports.deleteGoal = async (req, res) => {
  const goalId = req.params.id;

  try {
    const goal = await Goal.findOneAndDelete({ _id: goalId, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal', error: error.message });
  }
};

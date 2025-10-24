const mongoose = require('mongoose');
const Category = require('../models/Category');


// CREATE (Admin only)
exports.createCategory = async (req, res) => {
  const { name, type, color } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  try {
    const category = new Category({
      name,
      type,
      color,
    });

    const savedCategory = await category.save();
    res.status(201).json({ message: 'Category created', category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    console.log('📥 Fetching all categories...');

    // Debug: check which DB and collection we are connected to
    console.log('🗄️ DB Name:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🛠️ Collections:', Object.keys(mongoose.connection.collections));

    const categories = await Category.find({});

    console.log(`📦 Found categories: ${categories.length}`);
    res.status(200).json({ categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// UPDATE (Admin only)
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, type, color } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (type) category.type = type;
    if (color) category.color = color;

    const updatedCategory = await category.save();
    res.status(200).json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// DELETE (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

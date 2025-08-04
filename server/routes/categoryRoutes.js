const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createCategory)
  .get(protect, getCategories);

router.route('/:id')
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;

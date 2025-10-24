const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', getCategories); // all users can fetch

router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;

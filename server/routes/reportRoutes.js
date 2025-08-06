const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getReportInfo,
  getMonthlyReport,
  getWeeklyReport,
  getCustomRangeReport
} = require('../controllers/reportController');

router.get('/', getReportInfo);
router.get('/monthly', protect, getMonthlyReport);
router.get('/weekly', protect, getWeeklyReport);
router.get('/range', protect, getCustomRangeReport);

module.exports = router;

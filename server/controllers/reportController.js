const {
  generateMonthlyReport,
  generateWeeklyReport,
  generateCustomRangeReport
} = require('../services/reportService');

// Welcome info
const getReportInfo = (req, res) => {
  res.status(200).json({
    message:
      "Reports endpoints: /monthly?month=YYYY-MM, /weekly?weekStart=YYYY-MM-DD, /range?start=YYYY-MM-DD&end=YYYY-MM-DD"
  });
};

// Monthly report
const getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.query; // e.g., "2025-08"
    const report = await generateMonthlyReport(req.user._id, month);
    res.status(200).json(report);
  } catch (error) {
    console.error("Monthly Report Error:", error);
    res.status(500).json({
      message: "Failed to generate monthly report",
      summary: { totalIncome: 0, totalExpense: 0, remaining: 0 },
      transactions: [],
      categories: [],
      trends: []
    });
  }
};

// Weekly report
const getWeeklyReport = async (req, res) => {
  try {
    const { weekStart } = req.query; // e.g., "2025-08-12" for a specific week
    const report = await generateWeeklyReport(req.user._id, weekStart);
    res.status(200).json(report);
  } catch (error) {
    console.error("Weekly Report Error:", error);
    res.status(500).json({
      message: "Failed to generate weekly report",
      summary: { totalIncome: 0, totalExpense: 0, remaining: 0 },
      transactions: [],
      categories: [],
      trends: []
    });
  }
};

// Custom range report
const getCustomRangeReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({
        message: "Start and end dates are required",
        summary: { totalIncome: 0, totalExpense: 0, remaining: 0 },
        transactions: [],
        categories: [],
        trends: []
      });
    }

    const report = await generateCustomRangeReport(req.user._id, start, end);
    res.status(200).json(report);
  } catch (error) {
    console.error("Custom Range Report Error:", error);
    res.status(500).json({
      message: "Failed to generate report",
      summary: { totalIncome: 0, totalExpense: 0, remaining: 0 },
      transactions: [],
      categories: [],
      trends: []
    });
  }
};

module.exports = {
  getReportInfo,
  getMonthlyReport,
  getWeeklyReport,
  getCustomRangeReport
};

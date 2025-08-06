const {
  generateMonthlyReport,
  generateWeeklyReport,
  generateCustomRangeReport
} = require('../services/reportService');

// Welcome Message (optional root route)
const getReportInfo = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Reports . Available are: /monthly, /weekly, /range?start=YYYY-MM-DD&end=YYYY-MM-DD"
  });
};

const getMonthlyReport = async (req, res) => {
  try {
    const report = await generateMonthlyReport(req.user._id);
    res.json(report);
  } catch (error) {
    console.error("Monthly Report Error:", error);
    res.status(500).json({ message: "Failed to generate monthly report" });
  }
};

const getWeeklyReport = async (req, res) => {
  try {
    const report = await generateWeeklyReport(req.user._id);
    res.json(report);
  } catch (error) {
    console.error("Weekly Report Error:", error);
    res.status(500).json({ message: "Failed to generate weekly report" });
  }
};

const getCustomRangeReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const report = await generateCustomRangeReport(req.user._id, start, end);
    res.json(report);
  } catch (error) {
    console.error("Custom Range Report Error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

module.exports = {
  getReportInfo,
  getMonthlyReport,
  getWeeklyReport,
  getCustomRangeReport
};

const Transaction = require('../models/Transaction');
const moment = require('moment');

const generateMonthlyReport = async (userId) => {
  return await Transaction.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const generateWeeklyReport = async (userId) => {
  const sixWeeksAgo = moment().subtract(6, 'weeks').toDate();

  return await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: sixWeeksAgo } } },
    {
      $group: {
        _id: { $isoWeek: "$date" },
        year: { $first: { $year: "$date" } },
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
        }
      }
    },
    { $sort: { year: 1, _id: 1 } }
  ]);
};

const generateCustomRangeReport = async (userId, start, end) => {
  const report = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: new Date(start),
          $lte: new Date(end)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    }
  ]);

  return report[0] || { totalIncome: 0, totalExpense: 0 };
};

module.exports = {
  generateMonthlyReport,
  generateWeeklyReport,
  generateCustomRangeReport
};

const Transaction = require('../models/Transaction');
const {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  parseISO,
  subWeeks,
  format
} = require('date-fns');

// Format trend data
const formatTrendData = (transactions = [], granularity = 'monthly') => {
  const grouped = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const amount = Number(t.amount || 0);
    let key, label;

    if (granularity === 'weekly') {
      const weekNumber = Math.ceil(
        ((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24) + 1) / 7
      );
      key = `${date.getFullYear()}-W${weekNumber}`;
      label = `W${weekNumber} ${date.getFullYear()}`;
    } else {
      key = format(date, 'yyyy-MM');
      label = format(date, 'MMM yyyy');
    }

    if (!grouped[key]) grouped[key] = { key, label, income: 0, expenses: 0 };
    if (t.type === 'income') grouped[key].income += amount;
    else grouped[key].expenses += amount;
  });

  return Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));
};

// Format categories
const formatCategoryData = (transactions = []) => {
  const grouped = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    const category = t.categoryId?.name || 'Uncategorized';
    grouped[category] = (grouped[category] || 0) + Number(t.amount || 0);
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

// Core report generator
const generateReport = async (userId, { start, end, granularity = 'monthly' }) => {
  const match = { userId };
  if (start && end) match.date = { $gte: new Date(start), $lte: new Date(end) };

  const transactions = await Transaction.find(match)
    .populate('categoryId', 'name')
    .sort({ date: 1 })
    .lean();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return {
    summary: {
      totalIncome,
      totalExpense,
      remaining: totalIncome - totalExpense
    },
    transactions,
    categories: formatCategoryData(transactions),
    trends: formatTrendData(transactions, granularity)
  };
};

// Monthly report (accepts optional month param "YYYY-MM")
const generateMonthlyReport = async (userId, month) => {
  let start, end;
  if (month) {
    start = parseISO(`${month}-01`);
    end = endOfMonth(start);
  } else {
    start = startOfMonth(new Date());
    end = endOfMonth(new Date());
  }
  return generateReport(userId, { start, end, granularity: 'monthly' });
};

// Weekly report (accepts optional weekStart param "YYYY-MM-DD")
const generateWeeklyReport = async (userId, weekStart) => {
  let start, end;
  if (weekStart) {
    start = startOfWeek(parseISO(weekStart), { weekStartsOn: 1 });
    end = endOfWeek(parseISO(weekStart), { weekStartsOn: 1 });
  } else {
    start = subWeeks(new Date(), 6);
    end = new Date();
  }
  return generateReport(userId, { start, end, granularity: 'weekly' });
};

// Custom range
const generateCustomRangeReport = async (userId, start, end) => {
  return generateReport(userId, { start, end, granularity: 'monthly' });
};

module.exports = {
  generateMonthlyReport,
  generateWeeklyReport,
  generateCustomRangeReport
};

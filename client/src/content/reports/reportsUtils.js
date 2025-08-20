import axios from "../../lib/utils";
import { format, getISOWeek } from "date-fns";

// -----------------------------
// Fetch Report Data
// -----------------------------
/**
 * Fetches report data from backend depending on type
 * @param {"weekly"|"monthly"|"range"} type
 * @param {string} [start] - Required if type === "range"
 * @param {string} [end] - Required if type === "range"
 * @returns {Promise<Object>} Report data
 */
export const fetchReport = async (type, start, end) => {
  try {
    let url = `/reports/${type}`;

    if (type === "range") {
      if (!start || !end) throw new Error("Start and end dates are required for range reports");
      const startStr = start instanceof Date ? format(start, "yyyy-MM-dd") : start;
      const endStr = end instanceof Date ? format(end, "yyyy-MM-dd") : end;
      url += `?start=${startStr}&end=${endStr}`;
    } else if (type === "monthly") {
      const monthStr = start instanceof Date ? format(start, "yyyy-MM") : start;
      url += `?month=${monthStr}`;
    } else if (type === "weekly") {
      const weekStartStr = start instanceof Date ? format(start, "yyyy-MM-dd") : start;
      url += `?weekStart=${weekStartStr}`;
    }

    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (err) {
    console.error("❌ Error fetching report:", err);
    throw new Error("Unable to fetch report data. Please try again.");
  }
};

// -----------------------------
// Format Trend Data
// -----------------------------
/**
 * Formats transactions into trend data for charts
 * @param {Array} transactions
 * @param {"weekly"|"monthly"} granularity
 * @returns {Array} [{ key, label, income, expenses }]
 */
export const formatTrendData = (transactions = [], granularity = "monthly") => {
  const grouped = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const amount = Number(t.amount) || 0;

    let key, label;
    if (granularity === "weekly") {
      const week = getISOWeek(date);
      key = `${format(date, "yyyy")}-W${week}`;
      label = `W${week} ${format(date, "yyyy")}`;
    } else {
      key = format(date, "yyyy-MM");
      label = format(date, "MMM yyyy");
    }

    if (!grouped[key]) grouped[key] = { key, label, income: 0, expenses: 0 };

    if (t.type === "income") grouped[key].income += amount;
    else if (t.type === "expense") grouped[key].expenses += amount;
  });

  return Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));
};

// -----------------------------
// Format Category Data
// -----------------------------
/**
 * Converts expense transactions into category summary for donut charts
 * @param {Array} transactions
 * @returns {Array} [{ name, value }]
 */
export const formatCategoryData = (transactions = []) => {
  const grouped = {};

  transactions.forEach((t) => {
    if (t.type !== "expense") return;

    const category = t.categoryName || "Uncategorized";
    const amount = Number(t.amount) || 0;

    grouped[category] = (grouped[category] || 0) + amount;
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

// -----------------------------
// Format Currency Helper
// -----------------------------
/**
 * Safely formats numbers into localized currency
 * @param {number} amount
 * @param {string} currency - ISO code, e.g. "KES", "USD"
 * @param {string} locale - e.g. "en-KE"
 * @returns {string}
 */
export const formatCurrency = (amount, currency = "KES", locale = "en-KE") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

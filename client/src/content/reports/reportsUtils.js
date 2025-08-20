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
export const fetchReport = async (type, arg1, arg2) => {
  try {
    let url = "/reports";

    switch (type) {
      case "monthly":
        url += `/monthly?month=${arg1}`;
        console.log("Fetching monthly report with URL:", url);
        break;
      case "weekly":
        url += `/weekly?weekStart=${arg1}`;
        console.log("Fetching weekly report with URL:", url);
        break;
      case "range":
        url += `/range?start=${arg1}&end=${arg2}`;
        console.log("Fetching custom range report with URL:", url);
        break;
      default:
        throw new Error("Invalid report type");
    }

    const response = await axios.get(url);
    console.log("Report fetched successfully:", response.data);
    return response.data;
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

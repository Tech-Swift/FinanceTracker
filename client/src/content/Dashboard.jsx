import { useEffect, useState } from "react";
import axios from "../lib/utils";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Color palette for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Currency formatter
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get("/summary");
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center text-red-500">
        No summary data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting + subtitle */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {user?.name || "User"}!
        </h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
          Here is an overview of your finances
        </p>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          + Add Expense
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
          + Add Income
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={summary.totalIncome} />
        <StatCard title="Total Expenses" value={summary.totalExpenses} />
        <StatCard title="Balance" value={summary.balance} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Overview */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Spending Overview</h2>
            {summary.spendingByCategory?.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={summary.spendingByCategory}
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={100}
                    label
                  >
                    {summary.spendingByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No spending data.</p>
            )}
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Cash Flow</h2>
            {summary.cashFlow?.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={summary.cashFlow}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#10b981" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No cash flow data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {summary.recentTransactions?.length ? (
            <ul className="space-y-3">
              {summary.recentTransactions.map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center border-b pb-2 text-sm"
                >
                  <span>{tx.description}</span>
                  <span
                    className={
                      tx.type === "income" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {formatCurrency(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent transactions.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
          {title}
        </h3>
        <p className="text-xl font-semibold text-gray-800 dark:text-white mt-2">
          {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  );
}

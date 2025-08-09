import { useEffect, useState } from "react";
import axios from "../lib/utils";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";

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
    return <div className="text-center text-red-500">No summary data available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Greeting + subtitle */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {user?.name || "User"}!
        </h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
          Here is an Overview of your finances
        </p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={summary.totalIncome} />
        <StatCard title="Total Expenses" value={summary.totalExpenses} />
        <StatCard title="Balance" value={summary.balance} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        {summary.recentTransactions?.length ? (
          <ul className="space-y-3">
            {summary.recentTransactions.map((tx) => (
              <li
                key={tx._id}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <span>{tx.description}</span>
                <span className={tx.type === "income" ? "text-green-500" : "text-red-500"}>
                  {tx.amount}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent transactions.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</h3>
        <p className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

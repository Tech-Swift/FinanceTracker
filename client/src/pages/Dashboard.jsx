import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, transRes, budgetsRes, reportRes] = await Promise.all([
          axios.get("/api/summary"),
          axios.get("/api/transactions?limit=5"),
          axios.get("/api/budgets"),
          axios.get("/api/reports/monthly")
        ]);

        setSummary(summaryRes.data);
        setTransactions(transRes.data);
        setBudgets(budgetsRes.data);
        setReportData(reportRes.data);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent><p>Total Balance</p><h2 className="text-xl font-semibold">KES {summary?.balance}</h2></CardContent></Card>
        <Card><CardContent><p>Income</p><h2 className="text-xl font-semibold">KES {summary?.income}</h2></CardContent></Card>
        <Card><CardContent><p>Expenses</p><h2 className="text-xl font-semibold">KES {summary?.expenses}</h2></CardContent></Card>
        <Card><CardContent><p>Active Budgets</p><h2 className="text-xl font-semibold">{budgets?.length}</h2></CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-4">Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={reportData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={summary?.categories} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={60}>
                  {summary?.categories?.map((_, i) => (
                    <Cell key={i} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <Card key={tx._id} className="flex justify-between items-center p-4">
              <div>
                <p className="font-medium">{tx.name}</p>
                <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
              <div className={tx.type === 'income' ? "text-green-600" : "text-red-600"}>
                {tx.type === 'income' ? '+' : '-'}KES {tx.amount}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mt-6">
        <Button>Add Transaction</Button>
        <Button variant="outline">Add Budget</Button>
      </div>
    </section>
  );
}

// SummaryCards.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Receipt } from "lucide-react";
import { formatCurrency } from "./reportsUtils";

export default function SummaryCards({ summary, transactions = [] }) {
  if (!summary) return null;

  const { totalIncome = 0, totalExpense = 0 } = summary;
  const netSavings = totalIncome - totalExpense;
  const transactionsCount = transactions.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Income */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpCircle className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
        </CardContent>
      </Card>

      {/* Expenses */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownCircle className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
        </CardContent>
      </Card>

      {/* Net Savings */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <Wallet className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              netSavings >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(netSavings)}
          </p>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Receipt className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{transactionsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}

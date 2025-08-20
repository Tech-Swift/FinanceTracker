// CategoryDonutChart.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "./reportsUtils";

const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B", "#6366F1", "#EC4899"];

export default function CategoryDonutChart({ data }) {
  if (!data || data.length === 0) return null;

  // Ensure each data item has name & value
  const chartData = data.map((item) => ({
    category: item.name || "Uncategorized",
    amount: Number(item.value) || 0,
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                separator=": "
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { fetchReport } from "./reportsUtils";
import ReportsHeader from "./ReportsHeader";
import SummaryCards from "./SummaryCards";
import CategoryDonutChart from "./CategoryDonutChart";
import TrendCharts from "./TrendCharts";
import TransactionsTable from "../transactions/TransactionTable";
import ExportButtons from "./ExportButtons";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

export default function ReportsPage() {
  const [type, setType] = useState("monthly");
  const [month, setMonth] = useState(new Date());
  const [weekStart, setWeekStart] = useState(new Date());
  const [range, setRange] = useState({ start: null, end: null });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayLabel, setDisplayLabel] = useState("");

  // Update display label
  useEffect(() => {
    if (type === "monthly") {
      setDisplayLabel(`Month: ${format(month, "MMM yyyy")}`);
    } else if (type === "weekly") {
      setDisplayLabel(`Week: ${format(weekStart, "MMM dd")} - ${format(addDays(weekStart, 6), "MMM dd")}`);
    } else if (type === "range") {
      setDisplayLabel(
        range.start && range.end
          ? `Range: ${format(range.start, "MMM dd, yyyy")} - ${format(range.end, "MMM dd, yyyy")}`
          : "Custom Range: Not selected"
      );
    }
  }, [type, month, weekStart, range]);

  // Fetch data whenever filters change
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let result;

        if (type === "monthly") {
          result = await fetchReport("monthly", month);
        } else if (type === "weekly") {
          result = await fetchReport("weekly", weekStart);
        } else if (type === "range" && range.start && range.end) {
          result = await fetchReport("range", range.start, range.end);
        } else if (type === "range") {
          setData(null);
          setLoading(false);
          return;
        }

        setData(result);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, month, weekStart, range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Reports</h2>
      </div>

      <ReportsHeader
        type={type}
        onTypeChange={setType}
        month={month}
        onMonthChange={setMonth}
        weekStart={weekStart}
        onWeekStartChange={setWeekStart}
        range={range}
        onRangeChange={setRange}
      />

      {displayLabel && <p className="text-gray-600 text-sm font-medium">{displayLabel}</p>}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      ) : !data || (data.transactions && data.transactions.length === 0) ? (
        <Card className="p-6 text-center text-gray-500">
          No report data available for this selection.
        </Card>
      ) : (
        <>
          <SummaryCards summary={data.summary} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryDonutChart data={data.categories} />
            <TrendCharts data={data.trends} />
          </div>
          <TransactionsTable transactions={data.transactions} />
          <ExportButtons data={data} />
        </>
      )}
    </div>
  );
}

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
import { format } from "date-fns";

export default function ReportsPage() {
  const [type, setType] = useState("monthly");
  const [month, setMonth] = useState(null);
  const [weekStart, setWeekStart] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayLabel, setDisplayLabel] = useState("");

  // Update selected label
  const updateDisplayLabel = () => {
    if (type === "monthly") {
      const selected = month || new Date();
      setDisplayLabel(`Month: ${format(selected, "MMM yyyy")}`);
    } else if (type === "weekly") {
      const start = weekStart || new Date();
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setDisplayLabel(`Week: ${format(start, "MMM dd")} - ${format(end, "MMM dd")}`);
    } else if (type === "range") {
      if (!range.start || !range.end) {
        setDisplayLabel("Custom Range: Not selected");
      } else {
        setDisplayLabel(`Range: ${format(range.start, "MMM dd, yyyy")} - ${format(range.end, "MMM dd, yyyy")}`);
      }
    }
  };

  // Fetch report whenever filters change
  useEffect(() => {
    console.log("Triggering report fetch", { type, month, weekStart, range });

    const loadData = async () => {
      try {
        setLoading(true);
        let result;

        if (type === "monthly") {
          const selectedMonth = month || new Date();
          const monthStr = format(selectedMonth, "yyyy-MM");
          console.log("Fetching monthly report for:", monthStr);
          result = await fetchReport("monthly", monthStr);
          setDisplayLabel(`Month: ${format(selectedMonth, "MMM yyyy")}`);
        } else if (type === "weekly") {
          const selectedWeek = weekStart || new Date();
          const weekStartStr = format(selectedWeek, "yyyy-MM-dd");
          console.log("Fetching weekly report starting:", weekStartStr);
          result = await fetchReport("weekly", weekStartStr);
          const startOfWeekLabel = format(selectedWeek, "MMM dd");
          const endOfWeekLabel = format(new Date(selectedWeek.setDate(selectedWeek.getDate() + 6)), "MMM dd");
          setDisplayLabel(`Week: ${startOfWeekLabel} - ${endOfWeekLabel}`);
        } else if (type === "range") {
          if (!range.start || !range.end) {
            console.log("Range not selected yet");
            setDisplayLabel("Custom Range: Not selected");
            return;
          }
          const startStr = format(range.start, "yyyy-MM-dd");
          const endStr = format(range.end, "yyyy-MM-dd");
          console.log("Fetching range report:", { startStr, endStr });
          result = await fetchReport("range", startStr, endStr);
          setDisplayLabel(`Range: ${format(range.start, "MMM dd, yyyy")} - ${format(range.end, "MMM dd, yyyy")}`);
        }

        console.log("Report data received:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching report:", err);
        toast.error(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, month, weekStart, range]);

  // Also update display label whenever filters change
  useEffect(() => updateDisplayLabel(), [type, month, weekStart, range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Reports</h2>
      </div>

      {/* Header with filters */}
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

      {/* Display selected range/month/week */}
      {displayLabel && <p className="text-gray-600 text-sm font-medium">{displayLabel}</p>}

      {/* Loading / No data */}
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

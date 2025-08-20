// ExportButtons.jsx
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

/**
 * Trigger browser download
 */
const downloadFile = (filename, content, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convert data to CSV string
 */
const convertToCSV = (data) => {
  if (!data) return "";

  const csvRows = [];
  // Summary
  csvRows.push(["Summary"]);
  csvRows.push(["Metric", "Value"]);
  if (data.summary) {
    csvRows.push(["Total Income", data.summary.totalIncome || 0]);
    csvRows.push(["Total Expenses", data.summary.totalExpenses || 0]);
    csvRows.push([
      "Net Savings",
      (data.summary.totalIncome - data.summary.totalExpenses) || 0,
    ]);
    csvRows.push(["Transactions Count", data.summary.transactionsCount || 0]);
  }
  csvRows.push([]);

  // Categories
  csvRows.push(["Expenses by Category"]);
  csvRows.push(["Category", "Amount"]);
  (data.categories || []).forEach((cat) => {
    csvRows.push([cat.name, cat.value]);
  });
  csvRows.push([]);

  // Transactions
  csvRows.push(["Transactions"]);
  csvRows.push(["Category", "Type", "Description", "Date", "Amount"]);
  (data.transactions || []).forEach((tx) => {
    csvRows.push([
      tx.categoryId?.name || "N/A",
      tx.type,
      tx.description,
      new Date(tx.date).toLocaleDateString("en-CA"),
      tx.amount,
    ]);
  });
  csvRows.push([]);

  // Trends
  csvRows.push(["Income vs Expenses Over Time"]);
  csvRows.push(["Period", "Income", "Expenses"]);
  (data.trends || []).forEach((t) => {
    csvRows.push([t.label, t.income, t.expenses]);
  });

  return csvRows
    .map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
        )
        .join(",")
    )
    .join("\n");
};

/**
 * Export report as Excel (.xlsx) with formatting
 */
const exportToExcel = (data) => {
  if (!data) return;

  const wb = XLSX.utils.book_new();

  const headerStyle = { font: { bold: true } };

  // --- Summary sheet ---
  const summaryData = [
    { Metric: "Total Income", Value: data.summary?.totalIncome || 0 },
    { Metric: "Total Expenses", Value: data.summary?.totalExpenses || 0 },
    { Metric: "Net Savings", Value: (data.summary?.totalIncome - data.summary?.totalExpenses) || 0 },
    { Metric: "Transactions Count", Value: data.summary?.transactionsCount || 0 },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData, { origin: "A2" });

  // Apply header bold
  XLSX.utils.sheet_add_aoa(summarySheet, [["Metric", "Value"]], { origin: "A1" });
  Object.keys(summarySheet).forEach((key) => {
    if (key.startsWith("A1") || key.startsWith("B1")) {
      summarySheet[key].s = headerStyle;
    }
  });

  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // --- Categories sheet ---
  const categoriesData = (data.categories || []).map((cat) => ({
    Category: cat.name,
    Amount: cat.value,
  }));
  const categoriesSheet = XLSX.utils.json_to_sheet(categoriesData, { origin: "A2" });
  XLSX.utils.sheet_add_aoa(categoriesSheet, [["Category", "Amount"]], { origin: "A1" });
  Object.keys(categoriesSheet).forEach((key) => {
    if (key.startsWith("A1") || key.startsWith("B1")) categoriesSheet[key].s = headerStyle;
  });
  XLSX.utils.book_append_sheet(wb, categoriesSheet, "Categories");

  // --- Transactions sheet ---
  const transactionsData = (data.transactions || []).map((tx) => ({
    Category: tx.categoryId?.name || "N/A",
    Type: tx.type,
    Description: tx.description,
    Date: new Date(tx.date).toLocaleDateString("en-CA"),
    Amount: tx.amount,
  }));
  const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData, { origin: "A2" });
  XLSX.utils.sheet_add_aoa(transactionsSheet, [["Category", "Type", "Description", "Date", "Amount"]], { origin: "A1" });
  Object.keys(transactionsSheet).forEach((key) => {
    if (key.startsWith("A1") || key.startsWith("B1") || key.startsWith("C1") || key.startsWith("D1") || key.startsWith("E1")) {
      transactionsSheet[key].s = headerStyle;
    }
  });
  XLSX.utils.book_append_sheet(wb, transactionsSheet, "Transactions");

  // --- Trends sheet ---
  const trendsData = (data.trends || []).map((t) => ({
    Period: t.label,
    Income: t.income,
    Expenses: t.expenses,
  }));
  const trendsSheet = XLSX.utils.json_to_sheet(trendsData, { origin: "A2" });
  XLSX.utils.sheet_add_aoa(trendsSheet, [["Period", "Income", "Expenses"]], { origin: "A1" });
  Object.keys(trendsSheet).forEach((key) => {
    if (key.startsWith("A1") || key.startsWith("B1") || key.startsWith("C1")) trendsSheet[key].s = headerStyle;
  });
  XLSX.utils.book_append_sheet(wb, trendsSheet, "Trends");

  // Auto-width columns
  wb.SheetNames.forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, cell.v.toString().length + 2);
        }
      }
      ws["!cols"] = ws["!cols"] || [];
      ws["!cols"][C] = { wch: maxWidth };
    }
  });

  XLSX.writeFile(wb, "full_report.xlsx");
};

export default function ExportButtons({ data }) {
  if (!data) return null;

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      <Button
        onClick={() => downloadFile("full_report.csv", convertToCSV(data), "text/csv")}
        size="sm"
        variant="outline"
      >
        <Download className="mr-2 w-4 h-4" /> Export CSV
      </Button>
      <Button
        onClick={() => downloadFile("report.json", JSON.stringify(data, null, 2), "application/json")}
        size="sm"
        variant="outline"
      >
        <Download className="mr-2 w-4 h-4" /> Export JSON
      </Button>
      <Button onClick={() => exportToExcel(data)} size="sm" variant="outline">
        <Download className="mr-2 w-4 h-4" /> Export Excel
      </Button>
    </div>
  );
}

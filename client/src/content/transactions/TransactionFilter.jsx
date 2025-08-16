import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "../../lib/utils";

export default function TransactionFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    category: "",
    type: "",
  });

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories"); // adjust endpoint if needed
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const resetFilters = () => {
    setFilters({ from: "", to: "", category: "", type: "" });
    onFilter({});
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 mb-4">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Filter Transactions</h3>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 space-y-4 sm:space-y-0">
        {/* From Date */}
        <div className="flex flex-col w-full sm:w-48">
          <Label htmlFor="from" className="text-gray-700 dark:text-gray-300">From</Label>
          <Input
            type="date"
            id="from"
            value={filters.from}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            onChange={(e) => handleChange("from", e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col w-full sm:w-48">
          <Label htmlFor="to" className="text-gray-700 dark:text-gray-300">To</Label>
          <Input
            type="date"
            id="to"
            value={filters.to}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            onChange={(e) => handleChange("to", e.target.value)}
          />
        </div>

        {/* Category Select */}
        <div className="flex flex-col w-full sm:w-48">
          <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => handleChange("category", value === "all" ? "" : value)}
          >
            <SelectTrigger id="category" className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color || "#ccc" }}
                    />
                    {cat.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="flex flex-col w-full sm:w-48">
          <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">Type</Label>
          <select
            id="type"
            className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button onClick={applyFilters} className="w-full sm:w-auto">
          Apply
        </Button>
        <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
          Reset
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function BudgetFilter({ filter, setFilter, categories = [] }) {
  const [localCategory, setLocalCategory] = useState(filter.category || "");
  const [localStartDate, setLocalStartDate] = useState(filter.dateRange?.start || "");
  const [localEndDate, setLocalEndDate] = useState(filter.dateRange?.end || "");

  useEffect(() => {
    setLocalCategory(filter.category || "");
    setLocalStartDate(filter.dateRange?.start || "");
    setLocalEndDate(filter.dateRange?.end || "");
  }, [filter]);

    const applyFilter = (newCategory, newStart, newEnd) => {
      setFilter({
        category: newCategory === "all" ? "" : newCategory,
        dateRange: {
          start: newStart,
          end: newEnd,
        },
      });
    };


  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-4 md:space-y-0">
      {/* Category Select */}
      <div className="flex flex-col w-full md:w-auto">
        <Label htmlFor="category">Category</Label>
          <Select
              value={localCategory === "" ? "all" : localCategory}
              onValueChange={(value) => {
                setLocalCategory(value);
                applyFilter(value, localStartDate, localEndDate);
              }}
            >
              <SelectTrigger id="category" className="w-full md:w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

      </div>

      {/* Date Range Inputs */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <div className="flex flex-col">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            type="date"
            id="startDate"
            value={localStartDate}
            onChange={(e) => {
              const newStart = e.target.value;
              setLocalStartDate(newStart);
              applyFilter(localCategory, newStart, localEndDate);
            }}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            type="date"
            id="endDate"
            value={localEndDate}
            min={localStartDate}
            onChange={(e) => {
              const newEnd = e.target.value;
              setLocalEndDate(newEnd);
              applyFilter(localCategory, localStartDate, newEnd);
            }}
          />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TransactionFilter({ onFilterChange }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const filters = {
      search: search.trim().toLowerCase(),
      type,
      from: dateFrom,
      to: dateTo,
    };
    onFilterChange(filters);
  }, [search, type, dateFrom, dateTo]);

  const handleClear = () => {
    setSearch("");
    setType("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 w-full">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search category or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="from">From</Label>
        <Input
          id="from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="to">To</Label>
        <div className="flex gap-2">
          <Input
            id="to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  format
} from "date-fns";

export default function ReportsHeader({
  type,
  onTypeChange,
  month,
  onMonthChange,
  weekStart,
  onWeekStartChange,
  range,
  onRangeChange
}) {
  const [open, setOpen] = useState(false);
  const [tempRange, setTempRange] = useState(
    range.start && range.end ? { from: range.start, to: range.end } : { from: null, to: null }
  );

  // Keep tempRange in sync with props
  useEffect(() => {
    if (range.start && range.end) {
      setTempRange({ from: range.start, to: range.end });
    } else {
      setTempRange({ from: null, to: null });
    }
  }, [range]);

  const formattedRange =
    range.start && range.end
      ? `${format(range.start, "MMM dd, yyyy")} - ${format(range.end, "MMM dd, yyyy")}`
      : "Select date range";

  const resetRange = () => {
    console.log("Resetting range");
    setTempRange({ from: null, to: null });
    onRangeChange({ start: null, end: null });
  };

  const handleQuickPreset = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case "thisWeek":
        start = startOfWeek(today, { weekStartsOn: 1 });
        end = endOfWeek(today, { weekStartsOn: 1 });
        onWeekStartChange(start);
        break;
      case "lastWeek":
        start = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        end = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        onWeekStartChange(start);
        break;
      case "thisMonth":
        start = startOfMonth(today);
        end = endOfMonth(today);
        onMonthChange(today);
        break;
      case "lastMonth":
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        onMonthChange(subMonths(today, 1));
        break;
      default:
        return;
    }

    console.log(`Quick preset selected: ${preset}`, { start, end });
    onRangeChange({ start, end });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Tabs */}
      <Tabs
        value={type}
        onValueChange={(newType) => {
          console.log("Report type changed:", newType);
          onTypeChange(newType);
          if (newType !== "range") setTempRange({ from: null, to: null });
        }}
        className="flex-1"
      >
        <TabsList className="grid grid-cols-3 flex-1">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="range">Custom Range</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quick presets */}
      {(type === "weekly" || type === "monthly") && (
        <div className="flex gap-2 flex-wrap mt-2 lg:mt-0">
          {type === "weekly" && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleQuickPreset("thisWeek")}>
                This Week
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickPreset("lastWeek")}>
                Last Week
              </Button>
            </>
          )}
          {type === "monthly" && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleQuickPreset("thisMonth")}>
                This Month
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickPreset("lastMonth")}>
                Last Month
              </Button>
            </>
          )}
        </div>
      )}

      {/* Custom Range Picker */}
      {type === "range" && (
        <div className="flex items-center gap-2 flex-wrap mt-2 lg:mt-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedRange}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-4 flex flex-col gap-2">
              <CalendarComponent
                mode="range"
                selected={tempRange} // Pass object directly, supports partial selection
                onSelect={(selected) => {
                  console.log("Calendar selection changed:", selected);
                  setTempRange({ from: selected.from || null, to: selected.to || null });
                }}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={resetRange}>
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (tempRange.from && tempRange.to) {
                      console.log("Confirm clicked with range:", tempRange);
                      onRangeChange({ start: tempRange.from, end: tempRange.to });
                      setOpen(false);
                    } else {
                      console.log("Confirm clicked but range not fully selected:", tempRange);
                      setOpen(false);
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

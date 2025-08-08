import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useState } from "react";

export default function BudgetTable({ budgets = [], onEditSave, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [tempBudget, setTempBudget] = useState({});

  const startEdit = (budget) => {
    setEditingId(budget._id);
    setTempBudget({
      ...budget,
      category: budget.category?._id || "",
      spent: budget.spent || 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempBudget({});
  };

  const saveEdit = () => {
    onEditSave(editingId, tempBudget);
    setEditingId(null);
    setTempBudget({});
  };

  const handleChange = (field, value) => {
    setTempBudget((prev) => ({
      ...prev,
      [field]: field === "amount" || field === "spent" ? parseFloat(value) : value,
    }));
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-CA");

  const activeBudgets = budgets.filter((b) => b.amount !== b.spent);
  const spentBudgets = budgets.filter((b) => b.amount === b.spent);

  const renderTable = (budgetsToRender, isSpent = false) => (
    <div className="overflow-x-auto mt-6">
      <Table>
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="min-w-[100px]">Amount</TableHead>
            <TableHead className="min-w-[180px]">Period</TableHead>
            <TableHead className="min-w-[100px]">Spent</TableHead>
            <TableHead className="min-w-[100px]">Remaining</TableHead>
            <TableHead className="min-w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetsToRender.length ? (
            budgetsToRender.map((budget) => {
              const isEditing = editingId === budget._id;
              const display = isEditing ? tempBudget : budget;
              const remaining = (display.amount || 0) - (display.spent || 0);

              return (
                <TableRow key={budget._id} className="text-sm">
                  {/* Category */}
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: budget.category?.color || "#ccc",
                        }}
                      />
                      <span>{budget.category?.name || "N/A"}</span>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={display.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        className="w-full max-w-[100px]"
                      />
                    ) : (
                      `Kes ${budget.amount}`
                    )}
                  </TableCell>

                  {/* Period */}
                  <TableCell>
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="date"
                          value={formatDate(display.startDate)}
                          onChange={(e) => handleChange("startDate", e.target.value)}
                          className="w-full"
                        />
                        <Input
                          type="date"
                          value={formatDate(display.endDate)}
                          onChange={(e) => handleChange("endDate", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      `${formatDate(budget.startDate)} - ${formatDate(budget.endDate)}`
                    )}
                  </TableCell>

                  {/* Spent */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={display.spent}
                        onChange={(e) => handleChange("spent", e.target.value)}
                        className="w-full max-w-[100px]"
                      />
                    ) : (
                      `Kes ${budget.spent || 0}`
                    )}
                  </TableCell>

                  {/* Remaining */}
                  <TableCell>Kes {remaining}</TableCell>

                  {/* Actions */}
                  <TableCell className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={saveEdit}>
                          <Save size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEdit}>
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(budget)}>
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(budget._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No {isSpent ? "fully spent" : "active"} budgets.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-10 px-2 md:px-4">
      {/* Active Budgets */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Active Budgets</h2>
        {renderTable(activeBudgets)}
      </div>

      {/* Fully Spent Budgets */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Fully Spent Budgets</h2>
        {renderTable(spentBudgets, true)}
      </div>
    </div>
  );
}

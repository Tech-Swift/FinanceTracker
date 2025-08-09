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
import { toast } from "sonner";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useState } from "react";

export default function BudgetTable({ budgets = [], onEdit, onEditSave, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [tempBudget, setTempBudget] = useState({});

  const safeBudgets = Array.isArray(budgets) ? budgets : [];

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

  const saveEdit = async () => {
  try {
    // Prepare the update payload without changing category
    const { amount, spent, startDate, endDate } = tempBudget;

    // Assuming onEditSave returns a promise (make it async)
    await onEditSave(editingId, {
      amount,
      spent,
      startDate,
      endDate,
    });

    toast.success("Budget updated successfully!");
    setEditingId(null);
    setTempBudget({});
  } catch (error) {
    toast.error("Failed to update budget.");
    console.error(error);
  }
};
  const handleChange = (field, value) => {
    setTempBudget((prev) => ({
      ...prev,
      [field]: field === "amount" || field === "spent" ? parseFloat(value) : value,
    }));
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-CA");

  const formatInputDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

  const activeBudgets = safeBudgets.filter((b) => b.amount !== b.spent);
  const spentBudgets = safeBudgets.filter((b) => b.amount === b.spent);

  /** ----- Desktop Table Renderer ----- **/
  const renderTable = (budgetsToRender, isSpent = false) => (
    <div className="overflow-x-auto mt-6 hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Actions</TableHead>
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
                      {/* Category (read-only) */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: budget.category?.color || "#ccc" }}
                          />
                          <span>{budget.category?.name || "N/A"}</span>
                        </div>
                      </TableCell>

                      {/* Amount (editable) */}
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={display.amount}
                            onChange={(e) => handleChange("amount", e.target.value)}
                          />
                        ) : (
                          `Kes ${budget.amount}`
                        )}
                      </TableCell>

                      {/* Period (editable) */}
                      <TableCell>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Input
                              type="date"
                              value={formatInputDate(display.startDate)}
                              onChange={(e) => handleChange("startDate", e.target.value)}
                            />
                            <Input
                              type="date"
                              value={formatInputDate(display.endDate)}
                              onChange={(e) => handleChange("endDate", e.target.value)}
                            />
                          </div>
                        ) : (
                          `${formatDate(budget.startDate)} - ${formatDate(budget.endDate)}`
                        )}
                      </TableCell>

                      {/* Spent (editable) */}
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={display.spent}
                            onChange={(e) => handleChange("spent", e.target.value)}
                          />
                        ) : (
                          `Kes ${budget.spent || 0}`
                        )}
                      </TableCell>

                      {/* Remaining (calculated) */}
                      <TableCell>Kes {(display.amount || 0) - (display.spent || 0)}</TableCell>

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
                            <Button variant="ghost" size="icon" onClick={() => onDelete(budget._id)}>
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

  /** ----- Mobile Card Renderer ----- **/
  const MobileCards = ({ budgetsToRender, isSpent = false }) => (
    <div className="sm:hidden space-y-4 mt-2">
      {budgetsToRender.length ? (
        budgetsToRender.map((budget) => {
          const isEditing = editingId === budget._id;
          const display = isEditing ? tempBudget : budget;
          const remaining = (display.amount || 0) - (display.spent || 0);

          return (
            <div
              key={budget._id}
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md
                         dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: budget.category?.color || "#ccc" }}
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {budget.category?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(budget.startDate)} — {formatDate(budget.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={saveEdit} className="text-gray-600 dark:text-gray-200">
                        <Save size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={cancelEdit} className="text-gray-600 dark:text-gray-200">
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => (onEdit ? onEdit(budget) : startEdit(budget))} className="text-gray-600 dark:text-gray-200">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(budget._id)} className="text-gray-600 dark:text-gray-200">
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Amount / Spent / Remaining */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={display.amount ?? ""}
                      onChange={(e) => handleChange("amount", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 dark:text-gray-100">Kes {budget.amount ?? 0}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Spent</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={display.spent ?? ""}
                      onChange={(e) => handleChange("spent", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 dark:text-gray-100">Kes {budget.spent ?? 0}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Remaining</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Kes {remaining}</div>
                </div>
              </div>

              {/* If editing, show date inputs */}
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={formatInputDate(display.startDate)}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full bg-transparent"
                  />
                  <Input
                    type="date"
                    value={formatInputDate(display.endDate)}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className="w-full bg-transparent"
                  />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No {isSpent ? "fully spent" : "active"} budgets.
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 px-2 md:px-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Active Budgets</h2>
        {renderTable(activeBudgets)}
        <MobileCards budgetsToRender={activeBudgets} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Fully Spent Budgets</h2>
        {renderTable(spentBudgets, true)}
        <MobileCards budgetsToRender={spentBudgets} isSpent />
      </div>
    </div>
  );
}

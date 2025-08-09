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

  // Safety: ensure budgets is always an array
  const safeBudgets = Array.isArray(budgets) ? budgets : [];

  const startEdit = (budget) => {
    setEditingId(budget._id);
    setTempBudget({
      ...budget,
      // normalize category if you want to edit it later
      category: budget.category?._id || budget.category || "",
      // ensure numeric fields are numbers
      amount: budget.amount ?? 0,
      spent: budget.spent ?? 0,
      startDate: budget.startDate || "",
      endDate: budget.endDate || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempBudget({});
  };

  const saveEdit = () => {
    // Convert numeric fields if they came as strings
    const payload = {
      ...tempBudget,
      amount: typeof tempBudget.amount === "string" ? parseFloat(tempBudget.amount) || 0 : tempBudget.amount,
      spent: typeof tempBudget.spent === "string" ? parseFloat(tempBudget.spent) || 0 : tempBudget.spent,
    };

    onEditSave(editingId, payload);
    setEditingId(null);
    setTempBudget({});
  };

  const handleChange = (field, value) => {
    setTempBudget((prev) => ({
      ...prev,
      [field]:
        field === "amount" || field === "spent"
          ? // allow empty -> empty string so inputs don't complain
            value === "" ? "" : parseFloat(value)
          : value,
    }));
  };

  // helper: format date for <input type="date"> and for display
  const formatInputDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      // toLocaleDateString('en-CA') -> YYYY-MM-DD which works for date inputs
      return new Date(dateStr).toLocaleDateString("en-CA");
    } catch {
      return dateStr;
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString(); // user-friendly
    } catch {
      return dateStr;
    }
  };

  // split active vs fully spent
  const activeBudgets = safeBudgets.filter((b) => (b.amount ?? 0) !== (b.spent ?? 0));
  const spentBudgets = safeBudgets.filter((b) => (b.amount ?? 0) === (b.spent ?? 0));

  /* ---------- Desktop table renderer (sm and up) ---------- */
  const DesktopTable = ({ budgetsToRender }) => (
    <div className="hidden sm:block overflow-x-auto mt-4">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead className="min-w-[140px]">Category</TableHead>
            <TableHead className="min-w-[120px]">Amount</TableHead>
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
                        style={{ backgroundColor: budget.category?.color || "#ccc" }}
                      />
                      <span>{budget.category?.name || budget.category || "N/A"}</span>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={display.amount ?? ""}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        className="w-full max-w-[120px]"
                      />
                    ) : (
                      `Kes ${budget.amount ?? 0}`
                    )}
                  </TableCell>

                  {/* Period */}
                  <TableCell>
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="date"
                          value={formatInputDate(display.startDate)}
                          onChange={(e) => handleChange("startDate", e.target.value)}
                          className="w-full"
                        />
                        <Input
                          type="date"
                          value={formatInputDate(display.endDate)}
                          onChange={(e) => handleChange("endDate", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      `${formatDisplayDate(budget.startDate)} — ${formatDisplayDate(budget.endDate)}`
                    )}
                  </TableCell>

                  {/* Spent */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={display.spent ?? ""}
                        onChange={(e) => handleChange("spent", e.target.value)}
                        className="w-full max-w-[120px]"
                      />
                    ) : (
                      `Kes ${budget.spent ?? 0}`
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
                No entries.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  /* ---------- Mobile card renderer (below sm) ---------- */
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
                    {formatDisplayDate(budget.startDate)} — {formatDisplayDate(budget.endDate)}
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
                    <Button variant="ghost" size="icon" onClick={() => startEdit(budget)} className="text-gray-600 dark:text-gray-200">
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
      {/* Active Budgets */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Active Budgets</h2>

        {/* Mobile cards */}
        <MobileCards budgetsToRender={activeBudgets} />

        {/* Desktop table */}
        <DesktopTable budgetsToRender={activeBudgets} />
      </div>

      {/* Fully Spent Budgets */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Fully Spent Budgets</h2>

        {/* Mobile cards */}
        <MobileCards budgetsToRender={spentBudgets} isSpent />

        {/* Desktop table */}
        <DesktopTable budgetsToRender={spentBudgets} />
      </div>
    </div>
  );
}

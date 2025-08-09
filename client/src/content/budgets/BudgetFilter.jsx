import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export default function BudgetTable({ budgets = [], onEdit, onDelete }) {
  // Ensure budgets is always an array
  const safeBudgets = Array.isArray(budgets) ? budgets : [];

  if (safeBudgets.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No budgets found. Add one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeBudgets.map((budget) => (
            <TableRow key={budget._id}>
              <TableCell>{budget.category}</TableCell>
              <TableCell>${budget.amount}</TableCell>
              <TableCell>${budget.spent}</TableCell>
              <TableCell>${budget.amount - budget.spent}</TableCell>
              <TableCell className="flex gap-2">
                <button onClick={() => onEdit(budget)} className="text-blue-500 hover:text-blue-700">
                  <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(budget._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

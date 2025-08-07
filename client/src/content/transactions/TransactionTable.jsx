import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

export default function TransactionTable({ transactions = [], onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full border text-sm">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              <TableHead className="p-3 text-left">Date</TableHead>
              <TableHead className="p-3 text-left">Type</TableHead>
              <TableHead className="p-3 text-left">Category</TableHead>
              <TableHead className="p-3 text-left">Description</TableHead>
              <TableHead className="p-3 text-center">Amount</TableHead>
              <TableHead className="p-3 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn._id} className="border-t">
                <TableCell className="p-3 whitespace-nowrap">
                  {new Date(txn.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="p-3 capitalize">{txn.type}</TableCell>
                <TableCell className="p-3">{txn.categoryId?.name || "-"}</TableCell>
                <TableCell className="p-3">{txn.description}</TableCell>
                <TableCell className="p-3 text-left font-medium">
                  {txn.amount.toLocaleString()}
                </TableCell>
                <TableCell className="p-3 text-left space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(txn)}>
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(txn._id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {transactions.map((txn) => (
          <Card key={txn._id} className="p-4 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{txn.type.toUpperCase()}</p>
                <p className="text-gray-600 text-xs">
                  {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right font-medium">
                {txn.amount.toLocaleString()}
              </div>
            </div>

            {expandedId === txn._id && (
              <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <span className="font-medium">Category:</span> {txn.categoryId?.name || "-"}
                </p>
                <p>
                  <span className="font-medium">Description:</span> {txn.description}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                className="text-sm p-0 h-auto"
                onClick={() => toggleExpand(txn._id)}
              >
                {expandedId === txn._id ? "Hide Details" : "View Details"}
              </Button>
              <div className="space-x-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(txn)}>
                  <Pencil className="w-4 h-4 text-blue-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(txn._id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

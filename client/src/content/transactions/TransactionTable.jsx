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

export default function TransactionTable({ transactions = [], onEditSave, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [tempTransaction, setTempTransaction] = useState({});

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const startEdit = (tx) => {
    setEditingId(tx._id);
    setTempTransaction({
      ...tx,
      categoryId: tx.categoryId?._id || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempTransaction({});
  };

  const saveEdit = async () => {
    try {
      const { type, description, date, amount } = tempTransaction;

      await onEditSave(editingId, {
        type,
        description,
        date,
        amount,
      });

      toast.success("Transaction updated successfully!");
      setEditingId(null);
      setTempTransaction({});
    } catch (error) {
      toast.error("Failed to update transaction.");
      console.error(error);
    }
  };

  const handleChange = (field, value) => {
    setTempTransaction((prev) => ({
      ...prev,
      [field]: field === "amount" ? parseFloat(value) : value,
    }));
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-CA");
  const formatInputDate = (dateStr) => (dateStr ? new Date(dateStr).toISOString().split("T")[0] : "");

  /** ----- Desktop Table Renderer ----- **/
  const renderTable = () => (
    <div className="overflow-x-auto mt-6 hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeTransactions.length ? (
            safeTransactions.map((tx) => {
              const isEditing = editingId === tx._id;
              const display = isEditing ? tempTransaction : tx;

              return (
                <TableRow key={tx._id} className="text-sm">
                  {/* Category (read-only) */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tx.categoryId?.color || "#ccc" }}
                      />
                      <span>{tx.categoryId?.name || "N/A"}</span>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={display.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                      />
                    ) : (
                      display.type
                    )}
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={display.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                      />
                    ) : (
                      display.description
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={formatInputDate(display.date)}
                        onChange={(e) => handleChange("date", e.target.value)}
                      />
                    ) : (
                      formatDate(tx.date)
                    )}
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={display.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                      />
                    ) : (
                      `Kes ${tx.amount}`
                    )}
                  </TableCell>

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
                        <Button variant="ghost" size="icon" onClick={() => startEdit(tx)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(tx._id)}>
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
                No transactions available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  /** ----- Mobile Cards ----- **/
  const MobileCards = () => (
    <div className="sm:hidden space-y-4 mt-2">
      {safeTransactions.length ? (
        safeTransactions.map((tx) => {
          const isEditing = editingId === tx._id;
          const display = isEditing ? tempTransaction : tx;

          return (
            <div
              key={tx._id}
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md
                         dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: tx.categoryId?.color || "#ccc" }}
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {tx.categoryId?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(tx.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                      <Button variant="ghost" size="icon" onClick={() => startEdit(tx)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(tx._id)}>
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Type / Description / Amount */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Type</div>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={display.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 dark:text-gray-100">{display.type}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Description</div>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={display.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 dark:text-gray-100">{display.description}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={display.amount}
                      onChange={(e) => handleChange("amount", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 dark:text-gray-100">Kes {display.amount}</div>
                  )}
                </div>
              </div>

              {/* Date input if editing */}
              {isEditing && (
                <div className="mt-2">
                  <Input
                    type="date"
                    value={formatInputDate(display.date)}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full bg-transparent"
                  />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">No transactions available.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 px-2 md:px-4">
      {renderTable()}
      <MobileCards />
    </div>
  );
}

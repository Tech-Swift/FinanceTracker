import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function TransactionForm({ transaction, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: "",
    categoryId: "",
    amount: "",
    description: "",
    date: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = !!transaction;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (isEditing && transaction) {
      setFormData({
        type: transaction.type || "",
        categoryId: transaction.categoryId || "",
        amount: transaction.amount || "",
        description: transaction.description || "",
        date: transaction.date ? transaction.date.split("T")[0] : "",
      });
    }
  }, [transaction, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, categoryId, amount, description, date } = formData;

    // Required fields check
    if (!type || !categoryId || !amount) {
      console.error("Type, category, and amount are required.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      type,
      categoryId,
      amount: Number(amount),
      description: description || "",
      date: date || undefined,
    };

    try {
      setLoading(true);

      if (isEditing) {
        await axios.put(`/transactions/${transaction._id}`, payload);
        toast.success("Transaction updated successfully!");
      } else {
        await axios.post("/transactions", payload);
        toast.success("Transaction created successfully!");

        // Reset form after creation
        setFormData({
          type: "",
          categoryId: "",
          amount: "",
          description: "",
          date: "",
        });
      }

      if (typeof onSuccess === "function") onSuccess();
      if (typeof onClose === "function") onClose();
    } catch (error) {
      console.error("Failed to submit transaction", error);
      toast.error("Something went wrong while saving the transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Transaction" : "New Transaction"}</DialogTitle>

        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Select */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          {/* Description (optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

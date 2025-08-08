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

export default function BudgetForm({ budget, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    startDate: "",
    endDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = !!budget;

  const [remaining, setRemaining] = useState(null);

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

  // Fill form data on edit
  useEffect(() => {
    if (isEditing && budget.categoryId) {
      setFormData({
        categoryId: budget.categoryId,
        amount: budget.amount,
        startDate: budget.startDate?.slice(0, 10),
        endDate: budget.endDate?.slice(0, 10),
      });

      const calcRemaining =
        typeof budget.amount === "number" && typeof budget.spent === "number"
          ? budget.amount - budget.spent
          : null;

      setRemaining(calcRemaining);
    }
  }, [budget, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { categoryId, amount, startDate, endDate } = formData;

    if (!categoryId || !amount || !startDate || !endDate) {
      console.error("Please fill in all fields.");
      return;
    }

    const payload = {
      category: categoryId,
      amount: Number(amount),
      startDate,
      endDate,
    };

    try {
      setLoading(true);

      if (isEditing) {
        await axios.put(`/budgets/${budget._id}`, payload);
        toast.success("Budget updated successfully!");
      } else {
        await axios.post("/budgets", payload);
        toast.success("Budget created successfully!");
      }

      onSuccess(); // refetch or close modal
    } catch (error) {
      console.error("Failed to submit budget", error);
      toast.error("Something went wrong while saving the budget.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Budget" : "New Budget"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Remaining (only in edit mode) */}
          {isEditing && remaining !== null && (
            <div className="space-y-2">
              <Label htmlFor="remaining">Remaining</Label>
              <Input
                type="number"
                id="remaining"
                name="remaining"
                value={remaining}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate}
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

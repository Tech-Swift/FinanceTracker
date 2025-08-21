// GoalForm.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Validation schema
const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  targetAmount: z.number({ invalid_type_error: "Target amount must be a number" }).positive("Must be positive"),
  categoryId: z.string().optional(),
  deadline: z.string().nonempty("Deadline is required"),
});

export default function GoalForm({ open, setOpen, goal, categories = [], onSave }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAmount: 0,
      categoryId: "",
      deadline: "",
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (goal) {
      setValue("title", goal.title || "");
      setValue("description", goal.description || "");
      setValue("targetAmount", goal.targetAmount || 0);
      setValue("categoryId", goal.categoryId?._id || "");
      setValue("deadline", goal.deadline ? goal.deadline.split("T")[0] : "");
    } else {
      reset();
    }
  }, [goal, setValue, reset]);

  const submitHandler = async (data) => {
    try {
      const payload = { ...data, targetAmount: Number(data.targetAmount) };
      await onSave(payload, goal?._id);
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save goal:", error);
      toast.error("Failed to save goal. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Target Amount */}
          <div>
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input id="targetAmount" type="number" step="0.01" {...register("targetAmount", { valueAsNumber: true })} />
            {errors.targetAmount && <p className="text-sm text-red-500">{errors.targetAmount.message}</p>}
          </div>

          {/* Category */}
          <div>
            <Label>Category (Optional)</Label>
            <Select onValueChange={(val) => setValue("categoryId", val)} defaultValue={goal?.categoryId?._id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0
                  ? categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)
                  : <SelectItem value="">No categories</SelectItem>
                }
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" {...register("deadline")} />
            {errors.deadline && <p className="text-sm text-red-500">{errors.deadline.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{goal ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

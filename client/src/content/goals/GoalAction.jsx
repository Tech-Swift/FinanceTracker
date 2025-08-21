// GoalAction.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GoalForm from "./GoalForm";
import axios from "../../lib/utils";

export default function GoalAction({ categories = [], onGoalChange }) {
  const [open, setOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleCreate = () => {
    setEditingGoal(null);
    setOpen(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setOpen(true);
  };

  const handleDelete = async (goalId) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      await axios.delete(`/goals/${goalId}`);
      toast.success("Goal deleted successfully");
      onGoalChange(); // refetch goals
    } catch (error) {
      console.error("Failed to delete goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const handleSubmitGoal = async (data, goalId = null) => {
    try {
      if (goalId) {
        await axios.put(`/goals/${goalId}`, data);
        toast.success("Goal updated successfully");
      } else {
        await axios.post("/goals", data);
        toast.success("Goal created successfully");
      }
      onGoalChange(); // refetch goals
    } catch (error) {
      console.error("Error saving goal:", error);
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Button onClick={handleCreate}>New Goal</Button>

      {open && (
        <GoalForm
          open={open}
          setOpen={setOpen}
          onSubmitGoal={handleSubmitGoal}
          initialData={editingGoal}
          categories={categories}
        />
      )}

      {/* Optional: you can pass handleEdit and handleDelete to GoalList */}
      {/* For example, GoalList can call handleEdit(goal) when user clicks edit */}
      {/* And call handleDelete(goal._id) when user clicks delete */}
    </div>
  );
}

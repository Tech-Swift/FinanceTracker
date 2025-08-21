import { useEffect, useState } from "react";
import { toast } from "sonner";
import GoalForm from "./GoalForm";
import { fetchGoals, createGoal, updateGoal, deleteGoal } from "./goalUtils";
import axios from "../../lib/utils";

export default function GoalPage() {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Load goals
  const loadGoals = async () => {
    setLoading(true);
    const data = await fetchGoals();
    setGoals(data);
    setLoading(false);
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadGoals();
    loadCategories();
  }, []);

  // Save goal (create or update)
  const handleSaveGoal = async (goalData, goalId) => {
    try {
      let toastMessage = "";
      if (goalId) {
        const originalGoal = goals.find((g) => g._id === goalId);
        const addedAmount = goalData.currentAmount - (originalGoal?.currentAmount || 0);

        await updateGoal(goalId, goalData);

        toastMessage = addedAmount > 0
          ? `Added KES ${addedAmount} to "${goalData.title}"`
          : `Goal "${goalData.title}" updated`;
      } else {
        await createGoal(goalData);
        toastMessage = `Goal "${goalData.title}" created`;
      }

      toast.success(toastMessage);
      loadGoals();
      setModalOpen(false);
      setEditingGoal(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save goal");
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    const success = await deleteGoal(goalId);
    if (success) loadGoals();
  };

  return (
    <div className="p-4">
      {/* Header with button on opposite side */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Goals</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setEditingGoal(null);
            setModalOpen(true);
          }}
        >
          + New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading goals...</p>
        ) : goals.length > 0 ? (
          goals.map((goal) => {
            const progress = Math.min(
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
              100
            );
            return (
              <div
                key={goal._id}
                className="border p-4 rounded shadow flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-semibold text-lg">{goal.title}</h2>
                  {goal.description && <p className="text-sm">{goal.description}</p>}
                  <p className="text-sm mt-1">
                    <span className="font-medium">Target:</span> KES {goal.targetAmount}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Current:</span> KES {goal.currentAmount}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Deadline:</span>{" "}
                    {new Date(goal.deadline).toLocaleDateString()}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded h-3">
                      <div
                        className="h-3 rounded bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-right mt-1">{progress}% completed</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={() => {
                      setEditingGoal(goal);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteGoal(goal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No goals yet</p>
        )}
      </div>

      {modalOpen && (
        <GoalForm
          open={modalOpen}
          setOpen={setModalOpen}
          goal={editingGoal}
          categories={categories}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  );
}

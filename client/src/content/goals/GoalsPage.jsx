import { useEffect, useState } from "react";
import { toast } from "sonner";
import GoalForm from "./GoalForm";
import { fetchGoals, createGoal, updateGoal, deleteGoal } from "./goalUtils";

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
      const res = await import("../../lib/utils").then((mod) => mod.default.get("/categories"));
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
      if (goalId) {
        await updateGoal(goalId, goalData);
      } else {
        await createGoal(goalData);
      }
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
      <h1 className="text-2xl font-bold mb-4">My Goals</h1>

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          setEditingGoal(null);
          setModalOpen(true);
        }}
      >
        + New Goal
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading goals...</p>
        ) : goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal._id} className="border p-4 rounded shadow flex flex-col justify-between">
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
          ))
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

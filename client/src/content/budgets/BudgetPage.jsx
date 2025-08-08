import { useEffect, useState } from "react";
import axios from "../../lib/utils";
import { Button } from "@/components/ui/button";
import BudgetForm from "./BudgetForm";
import BudgetSummary from "./BudgetSummary";
import BudgetTable from "./BudgetTable";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [fullySpentBudgets, setFullySpentBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchFullySpentBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("/budgets");
      setBudgets(Array.isArray(response.data.budgets) ? response.data.budgets : []);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
      setBudgets([]);
    }
  };

  const fetchFullySpentBudgets = async () => {
    try {
      const response = await axios.get("/budgets/fully-spent");
      setFullySpentBudgets(Array.isArray(response.data.budgets) ? response.data.budgets : []);
    } catch (err) {
      console.error("Failed to fetch fully spent budgets:", err);
      setFullySpentBudgets([]);
    }
  };

  const handleEdit = (budget) => {
    setEditBudget(budget);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/budgets/${id}`);
      fetchBudgets();
      fetchFullySpentBudgets();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleInlineEditSave = async (id, updatedData) => {
    try {
      const response = await axios.put(`/budgets/${id}`, updatedData);
      const updatedBudget = response.data.budget;

      setBudgets((prev) => prev.map((b) => (b._id === id ? updatedBudget : b)));
      setFullySpentBudgets((prev) => prev.map((b) => (b._id === id ? updatedBudget : b)));

      // Refetch if remaining might have changed
      fetchBudgets();
      fetchFullySpentBudgets();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleFormClose = () => {
    setEditBudget(null);
    setShowForm(false);
    fetchBudgets();
    fetchFullySpentBudgets();
  };

  // Summary Calculations (only active budgets)
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Your Budgets</h1>
        <Button onClick={() => setShowForm(true)}>+ Add Budget</Button>
      </div>

      {/* Summary */}
      <BudgetSummary
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        totalRemaining={totalRemaining}
      />

      {/* Active Budgets */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Active Budgets</h2>
        <BudgetTable
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEditSave={handleInlineEditSave}
        />
      </div>

      {/* Fully Spent Budgets */}
      {fullySpentBudgets.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-600">Fully Spent Budgets</h2>
          <BudgetTable
            budgets={fullySpentBudgets}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEditSave={handleInlineEditSave}
          />
        </div>
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          open={showForm}
          onClose={handleFormClose}
          budget={editBudget}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "../../lib/utils";
import { Button } from "@/components/ui/button";

import BudgetForm from "./BudgetForm";
import BudgetTable from "./BudgetTable";
import BudgetSummary from "./BudgetSummary";
import BudgetFilter from "./BudgetFilter";
import BudgetActions from "./BudgetActions";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]); // for filter select
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null); // For modal editing
  const [filter, setFilter] = useState({ category: "", dateRange: { start: "", end: "" } });


  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/budgets");
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  // Filter budgets based on selected category and date range
  const filteredBudgets = budgets.filter((b) => {
    const categoryMatch = !filter.category || b.categoryId?._id === filter.category;

    const budgetDate = new Date(b.startDate || b.date);
    const startDate = filter.dateRange.start ? new Date(filter.dateRange.start) : null;
    const endDate = filter.dateRange.end ? new Date(filter.dateRange.end) : null;

    const dateMatch =
      (!startDate || budgetDate >= startDate) &&
      (!endDate || budgetDate <= endDate);

    return categoryMatch && dateMatch;
  });

  // Calculate totals for summary cards
  const totalBudgeted = filteredBudgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;

  // Open modal for adding new budget
  const openAddForm = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  // Open modal for editing existing budget
  const openEditForm = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  // Close modal form
  const closeForm = () => {
    setEditingBudget(null);
    setShowForm(false);
  };

  // Handle adding new budget (from form submit)
  const handleAddBudget = async (budget) => {
    try {
      await axios.post("/budgets", budget);
      fetchBudgets();
      closeForm();
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  // Handle updating budget from inline edit or modal form
  const handleUpdateBudget = async (id, updatedData) => {
    try {
      await axios.put(`/budgets/${id}`, updatedData);
      fetchBudgets();
      closeForm();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // Handle deleting budget
  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budgets</h2>
        </div>
      {/* Summary Cards */}
      <BudgetSummary
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        totalRemaining={totalRemaining}
      />

      {/* Actions + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <BudgetActions onAdd={openAddForm} />
        <BudgetFilter filter={filter} setFilter={setFilter} categories={categories} />
      </div>

      {/* Budget Table */}
      {loading ? (
        <p>Loading budgets...</p>
      ) : (
        <BudgetTable
          budgets={filteredBudgets}
          onEdit={openEditForm}        // Opens modal editing
          onEditSave={handleUpdateBudget} // For inline editing fallback
          onDelete={handleDeleteBudget}
        />
      )}

      {/* Budget Form Modal for Add or Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <BudgetForm
              budget={editingBudget}
              onClose={closeForm}
              onSuccess={() => {
                fetchBudgets();
                closeForm();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

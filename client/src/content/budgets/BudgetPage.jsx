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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ category: "", dateRange: "" });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/budgets");
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAddBudget = async (budget) => {
    try {
      await axios.post("/budgets", budget);
      fetchBudgets();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleUpdateBudget = async (id, updatedData) => {
    try {
      await axios.put(`/budgets/${id}`, updatedData);
      fetchBudgets();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const filteredBudgets = budgets.filter((b) => {
    return (
      (!filter.category || b.category === filter.category) &&
      (!filter.dateRange || new Date(b.date) >= new Date(filter.dateRange.start) &&
        new Date(b.date) <= new Date(filter.dateRange.end))
    );
  });

  return (
    <div className="p-4 space-y-6">
      {/* Summary Cards */}
      <BudgetSummary budgets={filteredBudgets} />

      {/* Actions + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <BudgetActions onNewBudget={() => setShowForm(true)} />
        <BudgetFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* Budget Table */}
      {loading ? (
        <p>Loading budgets...</p>
      ) : (
        <BudgetTable
          budgets={filteredBudgets}
          onUpdate={handleUpdateBudget}
          onDelete={handleDeleteBudget}
        />
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <BudgetForm
              onSubmit={handleAddBudget}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "../../lib/utils";
import TransactionActions from "./TransactionActions";
import TransactionFilter from "./TransactionFilter";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/transactions");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.transactions || [];
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch categories for displaying category names
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  // Create new transaction
  const handleCreateTransaction = async (newTx) => {
    try {
      const res = await axios.post("/transactions", newTx);
      setTransactions((prev) => [res.data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  // Update transaction (for inline editing)
    const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const res = await axios.put(`/transactions/${id}`, updatedData);
      const updatedTx = res.data.transaction;

      // Ensure date is a proper ISO string for Inputs
      if (updatedTx.date) {
        updatedTx.date = new Date(updatedTx.date).toISOString();
      }

      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updatedTx : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };



  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Apply filters
  const getFilteredTransactions = () => {
    if (!Array.isArray(transactions)) return [];

    return transactions.filter((t) => {
      const matchesFrom = filters.from
        ? new Date(t.date) >= new Date(filters.from)
        : true;
      const matchesTo = filters.to
        ? new Date(t.date) <= new Date(filters.to)
        : true;
      const matchesCategory = filters.category
        ? t.categoryId?._id === filters.category
        : true;
      const matchesType = filters.type ? t.type === filters.type : true;
      return matchesFrom && matchesTo && matchesCategory && matchesType;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Actions Toolbar */}
      <TransactionActions onNew={() => setShowForm(true)} />

      {/* New Transaction Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onClose={() => setShowForm(false)}
            onSuccess={async () => {
              await fetchTransactions();
              setShowForm(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <TransactionFilter onFilter={setFilters} />

      {/* Transactions Table */}
      <TransactionTable
        transactions={getFilteredTransactions()}
        onEditSave={handleUpdateTransaction} // ✅ matches TransactionTable prop
        onDelete={handleDeleteTransaction}
        categories={categories} // ✅ pass categories for display
      />
    </div>
  );
}

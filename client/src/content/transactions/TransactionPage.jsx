import { useEffect, useState } from "react";
import axios from "../../lib/utils";
import { toast } from "sonner";

import TransactionActions from "./TransactionActions";
import TransactionFilter from "./TransactionFilter";
import TransactionTable from "./TransactionTable";
import TransactionForm from "./TransactionForm";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ from: "", to: "", search: "", type: "" });

  const [showForm, setShowForm] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null); // null for create, txn object for edit

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let url = "/transactions";
      const params = new URLSearchParams();

      if (filter.from && filter.to) {
        params.append("from", filter.from);
        params.append("to", filter.to);
      }
      if (filter.search) {
        params.append("search", filter.search);
      }
      if (filter.type && filter.type !== "all") {
        params.append("type", filter.type);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);
      const data = res.data;
      const txns = Array.isArray(data?.transactions) ? data.transactions : [];

      setTransactions(txns);
      setError("");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleFilterChange = (newFilters) => {
    setFilter((prev) => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (txn) => {
    setEditingTxn(txn);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete transaction", err);
      toast.error("Failed to delete transaction");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTxn(null);
    fetchTransactions();
    toast.success("Transaction saved");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Transactions</h2>
        <TransactionActions onActionComplete={() => {
          setEditingTxn(null);
          setShowForm(true);
        }} />
      </div>

      <TransactionFilter filter={filter} onFilterChange={handleFilterChange} />

      {showForm && (
        <TransactionForm
          mode={editingTxn ? "edit" : "create"}
          initialData={editingTxn || {}}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingTxn(null);
          }}
        />
      )}

      {loading && <p className="text-center">Loading transactions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && transactions.length === 0 && (
        <p className="text-center text-gray-500">
          {filter.from && filter.to
            ? "No transactions on the selected date range."
            : "No transactions available."}
        </p>
      )}

      {!loading && transactions.length > 0 && (
        <div className="overflow-x-auto w-full">
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

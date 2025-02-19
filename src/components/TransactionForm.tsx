import { useState, useEffect } from "react";
import { Transaction } from "@/types";

interface TransactionFormProps {
  onTransactionSaved: () => void;
  editTransaction: Transaction | null;
}

export default function TransactionForm({
  onTransactionSaved,
  editTransaction,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<Omit<Transaction, "_id">>({
    title: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense", // Default type
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        title: editTransaction.title,
        amount: editTransaction.amount,
        category: editTransaction.category,
        date: editTransaction.date,
        type: editTransaction.type, // Ensure type is updated
      });
    }
  }, [editTransaction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editTransaction ? "PUT" : "POST";
    const url = editTransaction
      ? `/api/transactions/${editTransaction._id}`
      : "/api/transactions";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to save transaction:", data);
        return;
      }

      setFormData({
        title: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });

      onTransactionSaved();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Transaction Title"
        className="w-full p-2 border rounded text-black"
        required
      />
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="w-full p-2 border rounded text-black"
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full p-2 border rounded text-black"
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 border rounded text-black"
        required
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full p-2 border rounded text-black"
        required
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {editTransaction ? "Update" : "Add"} Transaction
      </button>
    </form>
  );
}

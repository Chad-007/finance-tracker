"use client";
import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransactionFormProps {
  onTransactionSaved: (transaction: Transaction) => void;
  editTransaction?: Transaction | null;
}

export default function TransactionForm({
  onTransactionSaved,
  editTransaction,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  useEffect(() => {
    if (editTransaction) {
      setTitle(editTransaction.title);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(new Date(editTransaction.date).toISOString().split("T")[0]);
      setType(editTransaction.type as "income" | "expense");
    } else {
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setType("expense");
    }
  }, [editTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      id: editTransaction?._id,
      title,
      amount: parseFloat(amount),
      category,
      date,
      type,
    };

    try {
      const method = editTransaction ? "PUT" : "POST";
      const url = "/api/transactions";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save transaction");
      }

      const savedTransaction: Transaction = await response.json();
      onTransactionSaved(savedTransaction);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Type</Label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="w-full p-2 border rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <Button type="submit">
        {editTransaction ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
}

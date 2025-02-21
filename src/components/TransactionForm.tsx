"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface TransactionFormProps {
  onTransactionSaved?: (transaction: Transaction) => void; // Optional for standalone use
}

export default function TransactionForm({
  onTransactionSaved,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<
    | "Food"
    | "Transportation"
    | "Entertainment"
    | "Bills"
    | "Shopping"
    | "Others"
  >("Food");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");

  useEffect(() => {
    if (transactionId) {
      const fetchTransaction = async () => {
        try {
          const response = await fetch(`/api/transactions/${transactionId}`);
          if (!response.ok) throw new Error("Failed to fetch transaction");
          const transaction: Transaction = await response.json();
          setTitle(transaction.title);
          setAmount(transaction.amount.toString());
          setCategory(
            transaction.category as
              | "Food"
              | "Transportation"
              | "Entertainment"
              | "Bills"
              | "Shopping"
              | "Others"
          );
          setDate(new Date(transaction.date).toISOString().split("T")[0]);
          setType(transaction.type as "income" | "expense");
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      };
      fetchTransaction();
    }
  }, [transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      id: transactionId,
      title,
      amount: parseFloat(amount),
      category,
      date,
      type,
    };

    try {
      const method = transactionId ? "PUT" : "POST";
      const url = transactionId
        ? `/api/transactions/${transactionId}`
        : "/api/transactions";

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
      if (onTransactionSaved) {
        onTransactionSaved(savedTransaction);
      }
      router.push("/"); // Navigate back to dashboard after saving
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
        <Select
          value={category}
          onValueChange={(
            value:
              | "Food"
              | "Transportation"
              | "Entertainment"
              | "Bills"
              | "Shopping"
              | "Others"
          ) => setCategory(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Bills">Bills</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
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
        <Select
          value={type}
          onValueChange={(value: "income" | "expense") => setType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">
        {transactionId ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
}

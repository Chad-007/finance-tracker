"use client";

import { useState, useEffect } from "react";
import { Transaction, TransactionFormProps } from "@/types";
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

export default function TransactionForm({
  onTransactionSaved,
  editTransaction,
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
    if (editTransaction) {
      setTitle(editTransaction.title);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(new Date(editTransaction.date).toISOString().split("T")[0]);
      setType(editTransaction.type);
    } else if (transactionId) {
      const fetchTransaction = async () => {
        try {
          const response = await fetch(`/api/transactions?id=${transactionId}`);
          if (!response.ok) throw new Error("Failed to fetch transaction");
          const transaction: Transaction = await response.json();
          setTitle(transaction.title);
          setAmount(transaction.amount.toString());
          setCategory(transaction.category);
          setDate(new Date(transaction.date).toISOString().split("T")[0]);
          setType(transaction.type);
        } catch (error) {
          console.error("Error fetching transaction:", error);
        }
      };
      fetchTransaction();
    }
  }, [editTransaction, transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let transactionData: Transaction;
    const method = transactionId || editTransaction ? "PUT" : "POST";
    const url =
      transactionId || editTransaction
        ? `/api/transactions?id=${transactionId || editTransaction?._id}`
        : "/api/transactions";

    if (method === "PUT") {
      transactionData = {
        _id: transactionId || (editTransaction?._id as string),
        title,
        amount: parseFloat(amount),
        category,
        date,
        type,
      };
    } else {
      transactionData = {
        _id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
        category,
        date,
        type,
      };
    }

    try {
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
      router.push("/");
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-3 sm:p-4 md:p-6 bg-gray-800/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-700/50"
    >
      <div>
        <Label
          htmlFor="title"
          className="text-white font-poppins text-sm sm:text-base md:text-lg"
        >
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-gray-700 text-white border-gray-600 focus:border-emerald-400 font-poppins text-sm sm:text-base md:text-lg placeholder-gray-400 mt-1"
        />
      </div>
      <div>
        <Label
          htmlFor="amount"
          className="text-white font-poppins text-sm sm:text-base md:text-lg"
        >
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="bg-gray-700 text-white border-gray-600 focus:border-emerald-400 font-poppins text-sm sm:text-base md:text-lg placeholder-gray-400 mt-1"
        />
      </div>
      <div>
        <Label
          htmlFor="category"
          className="text-white font-poppins text-sm sm:text-base md:text-lg"
        >
          Category
        </Label>
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
          <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600 focus:border-emerald-400 font-poppins text-sm sm:text-base md:text-lg mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600 font-poppins">
            <SelectItem
              value="Food"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Food
            </SelectItem>
            <SelectItem
              value="Transportation"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Transportation
            </SelectItem>
            <SelectItem
              value="Entertainment"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Entertainment
            </SelectItem>
            <SelectItem
              value="Bills"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Bills
            </SelectItem>
            <SelectItem
              value="Shopping"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Shopping
            </SelectItem>
            <SelectItem
              value="Others"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Others
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label
          htmlFor="date"
          className="text-white font-poppins text-sm sm:text-base md:text-lg"
        >
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="bg-gray-700 text-white border-gray-600 focus:border-emerald-400 font-poppins text-sm sm:text-base md:text-lg mt-1"
        />
      </div>
      <div>
        <Label className="text-white font-poppins text-sm sm:text-base md:text-lg">
          Type
        </Label>
        <Select
          value={type}
          onValueChange={(value: "income" | "expense") => setType(value)}
        >
          <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600 focus:border-emerald-400 font-poppins text-sm sm:text-base md:text-lg mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600 font-poppins">
            <SelectItem
              value="income"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Income
            </SelectItem>
            <SelectItem
              value="expense"
              className="font-poppins text-white hover:bg-gray-600 text-sm sm:text-base md:text-lg"
            >
              Expense
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-poppins text-sm sm:text-base md:text-lg py-2 px-4 rounded-lg"
      >
        {transactionId || editTransaction ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
}

"use client";
import { useState } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import { Transaction } from "@/types";

export default function Home() {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );

  const refreshTransactions = () => {
    setEditTransaction(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        💰 Personal Finance Tracker
      </h1>

      <TransactionForm
        onTransactionSaved={refreshTransactions}
        editTransaction={editTransaction}
      />
      <TransactionList
        onEdit={(transaction: Transaction | null) =>
          setEditTransaction(transaction)
        }
      />

      {/* Add the Monthly Expense Chart here */}
      <MonthlyExpenseChart />
    </div>
  );
}

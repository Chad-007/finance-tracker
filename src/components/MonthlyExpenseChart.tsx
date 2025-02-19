"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyExpenseChart() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    { month: string; total: number }[]
  >([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions"); // Adjust API endpoint
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const transactions: Transaction[] = await response.json();

        // Process transactions into monthly totals
        const expenseMap: { [key: string]: number } = {};

        transactions.forEach(({ date, amount, type }) => {
          if (type !== "expense") return; // Only count expenses

          const month = new Date(date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          expenseMap[month] = (expenseMap[month] || 0) + amount;
        });

        // Convert object to array and sort by date
        const sortedData = Object.entries(expenseMap)
          .map(([month, total]) => ({ month, total }))
          .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
          );

        setMonthlyExpenses(sortedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyExpenses}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

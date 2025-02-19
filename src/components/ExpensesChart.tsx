"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  date: string;
}

export default function ExpensesChart() {
  const [data, setData] = useState<{ month: string; total: number }[]>([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((transactions: Transaction[]) => {
        const monthlyExpenses: Record<string, number> = {};

        transactions.forEach(({ amount, type, date }) => {
          if (type === "expense") {
            const month = new Date(date).toLocaleString("default", {
              month: "short",
            });
            monthlyExpenses[month] = (monthlyExpenses[month] || 0) + amount;
          }
        });

        setData(
          Object.entries(monthlyExpenses).map(([month, total]) => ({
            month,
            total,
          }))
        );
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

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
  Legend,
  TooltipProps,
} from "recharts";
import { motion } from "framer-motion";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">
          Total Expenses: ${(payload[0].value as number).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

interface MonthlyExpenseChartProps {
  transactions: Transaction[];
}

export default function MonthlyExpenseChart({
  transactions,
}: MonthlyExpenseChartProps) {
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    { month: string; total: number }[]
  >([]);

  useEffect(() => {
    const expenseMap: { [key: string]: number } = {};

    transactions.forEach(({ date, amount, type }) => {
      if (type !== "expense") return;

      const month = new Date(date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      expenseMap[month] = (expenseMap[month] || 0) + amount;
    });

    const sortedData = Object.entries(expenseMap)
      .map(([month, total]) => ({ month, total }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );

    setMonthlyExpenses(sortedData);
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-rose-500">📊</span> Monthly Expenses
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={monthlyExpenses}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#be123c" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            opacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: 10,
              fontSize: 12,
              color: "#6b7280",
            }}
          />
          <Bar
            dataKey="total"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            barSize={40}
            animationDuration={1000}
            activeBar={{ stroke: "#be123c", strokeWidth: 2 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

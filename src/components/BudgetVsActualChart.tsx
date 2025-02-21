"use client";

import { useMemo } from "react";
import { Transaction, Budget } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
          {payload[0].name}: ${(payload[0].value as number).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export default function BudgetVsActualChart({
  transactions,
  budgets,
}: BudgetVsActualChartProps) {
  const chartData = useMemo(() => {
    if (!transactions.length && !budgets.length) {
      console.log(
        "No data for chart - Transactions:",
        transactions,
        "Budgets:",
        budgets
      );
      return [];
    }

    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear();

    // Define all possible categories
    const allCategories = [
      "Food",
      "Transportation",
      "Entertainment",
      "Bills",
      "Shopping",
      "Others",
    ] as const;

    // Calculate actual expenses for the current month
    const actuals: { [key: string]: number } = {};
    transactions.forEach(({ amount, category, type, date }) => {
      if (type !== "expense") return;
      const transactionDate = new Date(date);
      if (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === year
      ) {
        actuals[category] = (actuals[category] || 0) + amount;
      }
    });

    // Map budgets for the current month, ensuring all categories are included
    return allCategories.map((category) => {
      const budget = budgets.find(
        (b) => b.category === category && b.month === month && b.year === year
      );
      return {
        category,
        budget: budget ? budget.amount : 0, // Default to 0 if no budget exists
        actual: actuals[category] || 0, // Default to 0 if no actual expense exists
      };
    });
  }, [transactions, budgets]);

  if (!chartData.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 text-center"
      >
        <p className="text-gray-500 dark:text-gray-400">
          No budget or expense data for the current month.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-blue-500">📈</span> Budget vs Actual
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <XAxis
            dataKey="category"
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
          <Legend />
          <Bar
            dataKey="budget"
            fill="#3b82f6"
            name="Budget"
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="actual"
            fill="#ef4444"
            name="Actual"
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

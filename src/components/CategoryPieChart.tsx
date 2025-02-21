"use client";

import { useMemo } from "react";
import { Transaction } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
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

const COLORS = [
  "#f43f5e",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
];

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
          Total: ${(payload[0].value as number).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export default function CategoryPieChart({
  transactions,
}: CategoryPieChartProps) {
  const categoryData = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};

    transactions.forEach(({ amount, category, type }) => {
      if (type !== "expense") return;
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    return Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    }));
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-rose-500">🧩</span> Category Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(1)}%`
            }
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

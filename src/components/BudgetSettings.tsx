"use client";

import { useState, useEffect } from "react";
import { Budget } from "@/types";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface BudgetSettingsProps {
  initialBudgets?: Budget[];
}

export default function BudgetSettings({
  initialBudgets,
}: BudgetSettingsProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets || []);
  const [category, setCategory] = useState<
    | "Food"
    | "Transportation"
    | "Entertainment"
    | "Bills"
    | "Shopping"
    | "Others"
  >("Food");
  const [amount, setAmount] = useState<number | "">("");
  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Bills",
    "Shopping",
    "Others",
  ] as const;
  const router = useRouter();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("/api/budgets");
        if (!response.ok) {
          console.error(
            "Fetch error for /api/budgets:",
            response.status,
            response.statusText
          );
          throw new Error("Failed to fetch budgets");
        }
        const data: Budget[] = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };
    fetchBudgets();
  }, []);

  const handleSetBudget = async () => {
    if (!category || amount === "") return;

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount: Number(amount) }),
      });

      if (!response.ok) {
        console.error(
          "Fetch error for /api/budgets POST:",
          response.status,
          response.statusText
        );
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to set budget");
      }

      const updatedBudget: Budget = await response.json();
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === updatedBudget.category ? updatedBudget : b
        )
      );
      setAmount("");
      router.push("/"); // Navigate back to dashboard after saving
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-emerald-500">💰</span> Budget Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="budgetAmount">Budget Amount ($)</Label>
            <Input
              id="budgetAmount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || "")}
              placeholder="Enter budget amount"
            />
          </div>
          <Button onClick={handleSetBudget} disabled={!amount}>
            Set Budget
          </Button>
          {budgets.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                Current Budgets:
              </h4>
              <ul className="mt-2 space-y-2">
                {budgets.map((budget) => (
                  <li
                    key={budget._id}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {budget.category}: ${budget.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

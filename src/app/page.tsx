"use client";
import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import BudgetSettings from "@/components/BudgetSettings";
import { Transaction, Budget } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  DollarSign,
  List,
  ChevronDown,
  ChevronUp,
  PieChart,
} from "lucide-react";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsResponse = await fetch("/api/transactions");
        if (!transactionsResponse.ok)
          throw new Error("Failed to fetch transactions");
        const transactionsData: Transaction[] =
          await transactionsResponse.json();
        setTransactions(transactionsData);

        // Fetch budgets
        const budgetsResponse = await fetch("/api/budgets");
        if (!budgetsResponse.ok) throw new Error("Failed to fetch budgets");
        const budgetsData: Budget[] = await budgetsResponse.json();
        setBudgets(budgetsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const refreshTransactions = () => {
    setEditTransaction(null);
    setIsFormOpen(false);
  };

  const handleEdit = (transaction: Transaction) => {
    console.log("Editing transaction:", transaction);
    setEditTransaction(transaction);
    setIsFormOpen(true);
    setIsListOpen(false);
  };

  const handleTransactionSaved = (savedTransaction: Transaction) => {
    if (editTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t._id === savedTransaction._id ? savedTransaction : t))
      );
    } else {
      setTransactions((prev) => [savedTransaction, ...prev]);
    }
    refreshTransactions();
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) setIsListOpen(false);
  };

  const toggleList = () => {
    setIsListOpen(!isListOpen);
    if (!isListOpen) setIsFormOpen(false);
  };

  const handleBudgetUpdated = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
  };

  // Calculate summary data
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const now = new Date();
  const currentMonthExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      new Date(t.date).getMonth() === now.getMonth() &&
      new Date(t.date).getFullYear() === now.getFullYear()
  );
  const averageDailySpending = currentMonthExpenses.length
    ? currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0) /
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    : 0;
  const highestExpenseCategory = currentMonthExpenses.reduce(
    (max, t) => (t.amount > max.amount ? t : max),
    currentMonthExpenses[0] || {
      _id: "",
      title: "",
      amount: 0,
      category: "None",
      date: new Date(),
      type: "expense",
    }
  ).category;
  const recentTransactions = transactions.slice(0, 5); // Top 5 most recent

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950 p-6 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.2)_0%,_transparent_70%)] animate-pulse-slow" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-4 drop-shadow-lg">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <DollarSign className="w-12 h-12 text-emerald-400" />
            </motion.span>
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-medium tracking-wide">
            Manage Your Finances with Elegance
          </p>
        </motion.header>

        {/* Budget Settings */}
        <BudgetSettings onBudgetUpdated={handleBudgetUpdated} />

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total Expenses
                </h3>
                <p className="text-2xl font-bold text-rose-500">
                  ${totalExpenses.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Average Daily Spending
                </h3>
                <p className="text-xl font-medium text-indigo-500">
                  ${averageDailySpending.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Highest Expense Category
                </h3>
                <p className="text-xl font-medium text-rose-500">
                  {highestExpenseCategory}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Transaction Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 cursor-pointer flex justify-between items-center"
                onClick={toggleForm}
              >
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <List className="w-6 h-6 text-blue-400" />
                  {editTransaction ? "Edit Transaction" : "Add Transaction"}
                </CardTitle>
                {isFormOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </CardHeader>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isFormOpen ? "auto" : 0,
                  opacity: isFormOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <CardContent className="p-6">
                  <TransactionForm
                    onTransactionSaved={handleTransactionSaved}
                    editTransaction={editTransaction}
                  />
                </CardContent>
              </motion.div>
            </Card>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 cursor-pointer flex justify-between items-center"
                onClick={toggleList}
              >
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <List className="w-6 h-6 text-purple-400" />
                  Recent Transactions
                </CardTitle>
                {isListOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </CardHeader>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isListOpen ? "auto" : 0,
                  opacity: isListOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <CardContent className="p-6">
                  <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                  />
                </CardContent>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 to-rose-500/10 p-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-orange-400" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <MonthlyExpenseChart transactions={transactions} />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-500/10 to-indigo-500/10 p-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-rose-500" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <CategoryPieChart transactions={transactions} />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-green-500/10 p-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-blue-500" />
                  Budget vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BudgetVsActualChart
                  transactions={transactions}
                  budgets={budgets}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Separator className="my-12 bg-gray-300/50 dark:bg-gray-600/50 max-w-2xl mx-auto" />
        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium py-4">
          © {new Date().getFullYear()} Finance Tracker • Crafted with Passion
        </footer>
      </div>
    </div>
  );
}

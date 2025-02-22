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
import { motion, AnimatePresence } from "framer-motion";
import { FaDollarSign, FaList, FaChartPie } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await fetch("/api/transactions");
        if (!transactionsResponse.ok)
          throw new Error("Failed to fetch transactions");
        const transactionsData: Transaction[] =
          await transactionsResponse.json();
        setTransactions(transactionsData);

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
    setIsFormOpen((prev) => !prev);
    if (!isFormOpen) setIsListOpen(false);
  };

  const toggleList = () => {
    setIsListOpen((prev) => !prev);
    if (!isListOpen) setIsFormOpen(false);
  };

  const toggleBudget = () => {
    setIsBudgetOpen((prev) => !prev);
  };

  const handleBudgetUpdated = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
  };

  // Summary Calculations
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

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-2 sm:p-4 md:p-6 overflow-x-hidden relative">
      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4 sm:mb-6 md:mb-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center gap-2 sm:gap-3 drop-shadow-lg">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaDollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </motion.span>
            Finance Tracker
          </h1>
          <p className="text-gray-300 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg font-medium tracking-wide">
            Budget Smart, Live Free
          </p>
        </motion.header>

        {/* Budget Settings (Touch/Tap Expandable) */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6"
        >
          <Card
            className="bg-gray-800/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-700/50 overflow-hidden cursor-pointer"
            onClick={toggleBudget}
          >
            <CardHeader className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 p-3 sm:p-4 md:p-5 flex justify-between items-center">
              <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                <span className="text-emerald-400">💰</span> Budget Settings
              </CardTitle>
              <motion.div
                animate={{ rotate: isBudgetOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isBudgetOpen ? (
                  <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                ) : (
                  <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                )}
              </motion.div>
            </CardHeader>
            <AnimatePresence>
              {isBudgetOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <BudgetSettings onBudgetUpdated={handleBudgetUpdated} />
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8"
        >
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-xl border border-gray-700/50">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Total Expenses
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-rose-400">
                  ${totalExpenses.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-xl border border-gray-700/50">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Daily Spending
                </h3>
                <p className="text-base sm:text-lg md:text-xl font-medium text-indigo-400">
                  ${averageDailySpending.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-xl border border-gray-700/50">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">
                  Top Category
                </h3>
                <p className="text-base sm:text-lg md:text-xl font-medium text-rose-400">
                  {highestExpenseCategory}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Transaction Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8"
        >
          {/* Transaction Form */}
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-700/50 overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-3 sm:p-4 md:p-5 cursor-pointer flex justify-between items-center"
                onClick={toggleForm}
              >
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                  <FaList className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  {editTransaction ? "Edit Transaction" : "Add Transaction"}
                </CardTitle>
                <motion.div
                  animate={{ rotate: isFormOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isFormOpen ? (
                    <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  )}
                </motion.div>
              </CardHeader>
              <AnimatePresence>
                {isFormOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-3 sm:p-4 md:p-5">
                      <TransactionForm
                        onTransactionSaved={handleTransactionSaved}
                        editTransaction={editTransaction}
                      />
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Transaction List */}
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-700/50 overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-3 sm:p-4 md:p-5 cursor-pointer flex justify-between items-center"
                onClick={toggleList}
              >
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                  <FaList className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  Recent Transactions
                </CardTitle>
                <motion.div
                  animate={{ rotate: isListOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isListOpen ? (
                    <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  )}
                </motion.div>
              </CardHeader>
              <AnimatePresence>
                {isListOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-3 sm:p-4 md:p-5">
                      <TransactionList
                        transactions={transactions.slice(0, 5)} // Limit to 5 for mobile
                        onEdit={handleEdit}
                      />
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-2 sm:gap-4"
        >
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-700/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-900/20 to-rose-900/20 p-3 sm:p-4 md:p-5">
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                  <FaChartPie className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-5">
                <MonthlyExpenseChart transactions={transactions} />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-700/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-900/20 to-indigo-900/20 p-3 sm:p-4 md:p-5">
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                  <FaChartPie className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-5">
                <CategoryPieChart transactions={transactions} />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-700/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-green-900/20 p-3 sm:p-4 md:p-5">
                <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                  <FaChartPie className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Budget vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-5">
                <BudgetVsActualChart
                  transactions={transactions}
                  budgets={budgets}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <Separator className="my-4 sm:my-6 md:my-8 bg-gray-700/50 dark:bg-gray-600/50 max-w-xl mx-auto" />
        <footer className="text-center text-gray-400 dark:text-gray-500 text-xs sm:text-sm md:text-base font-medium py-2 sm:py-3 md:py-4"></footer>
      </div>
    </div>
  );
}

import { Transaction } from "@/types";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
}: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No transactions yet.
        </p>
      ) : (
        transactions.map((transaction) => (
          <motion.div
            key={transaction._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl shadow-md flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-l-4 ${
              transaction.type === "income"
                ? "border-green-400"
                : "border-red-400"
            }`}
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {transaction.title}
              </p>
              <p
                className={`text-lg font-bold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"} $
                {transaction.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {transaction.category}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 border-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </motion.div>
          </motion.div>
        ))
      )}
    </div>
  );
}

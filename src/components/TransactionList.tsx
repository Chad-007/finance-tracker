import { useState, useEffect } from "react";
import { Transaction } from "@/types";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ onEdit }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch transactions: ${response.statusText}`
          );
        }

        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className={`p-4 border rounded shadow flex justify-between items-center ${
              transaction.type === "income"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div>
              <p className="font-bold">{transaction.title}</p>
              <p
                className={`text-lg font-semibold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"} $
                {transaction.amount}
              </p>
              <p className="text-sm text-gray-500">{transaction.category}</p>
              <p className="text-xs text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onEdit(transaction)}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
}

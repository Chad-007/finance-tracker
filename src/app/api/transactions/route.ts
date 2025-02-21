import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";

// ✅ GET: Fetch all transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new transaction
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, amount, category, date, type } = await req.json();

    if (!title || !amount || !category || !date || !type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const transaction = new Transaction({
      title,
      amount,
      category,
      date,
      type,
    });
    await transaction.save();

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update an existing transaction
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, title, amount, category, date, type } = await req.json();

    if (!id || !title || !amount || !category || !date || !type) {
      return NextResponse.json(
        { error: "All fields are required, including id" },
        { status: 400 }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { title, amount, category, date, type },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Transaction update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ GET: Fetch budgets for the current month
export async function GETBudgets() {
  try {
    await connectDB();
    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear();
    const budgets = await Budget.find({ month, year });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create or update a budget
export async function POSTBudget(req: Request) {
  try {
    await connectDB();
    const { category, amount } = await req.json();

    if (!category || !amount) {
      return NextResponse.json(
        { error: "Category and amount are required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear();

    // Check if budget exists for this category, month, and year
    let budget = await Budget.findOne({ category, month, year });
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = new Budget({ category, amount, month, year });
      await budget.save();
    }

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Budget creation/update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

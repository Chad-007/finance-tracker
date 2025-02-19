import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

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

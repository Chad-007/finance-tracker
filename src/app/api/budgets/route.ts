import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Budget from "@/models/Budget";

// ✅ GET: Fetch budgets for the current month
export async function GET() {
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
export async function POST(req: Request) {
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

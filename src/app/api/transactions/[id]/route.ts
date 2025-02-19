import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

// ✅ GET: Fetch single transaction
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const transaction = await Transaction.findById(params.id);
  return NextResponse.json(transaction);
}

// ✅ PUT: Update a transaction
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await req.json();
  const transaction = await Transaction.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(transaction);
}

// ✅ DELETE: Remove a transaction
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Transaction.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Transaction deleted" });
}

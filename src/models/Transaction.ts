import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDocument extends Document {
  title: string;
  amount: number;
  category:
    | "Food"
    | "Transportation"
    | "Entertainment"
    | "Bills"
    | "Shopping"
    | "Others";
  date: Date;
  type: "income" | "expense";
}
export interface Budget {
  _id: string;
  category:
    | "Food"
    | "Transportation"
    | "Entertainment"
    | "Bills"
    | "Shopping"
    | "Others";
  amount: number;
  month: string; // e.g., "Jan 2025"
  year: number;
}

const TransactionSchema: Schema<TransactionDocument> = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transportation",
        "Entertainment",
        "Bills",
        "Shopping",
        "Others",
      ],
    },
    date: { type: Date, required: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model<TransactionDocument>("Transaction", TransactionSchema);

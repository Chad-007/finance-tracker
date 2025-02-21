import mongoose, { Schema, Document } from "mongoose";

export interface BudgetDocument extends Document {
  category:
    | "Food"
    | "Transportation"
    | "Entertainment"
    | "Bills"
    | "Shopping"
    | "Others";
  amount: number;
  month: string;
  year: number;
}

const BudgetSchema: Schema<BudgetDocument> = new Schema(
  {
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
    amount: { type: Number, required: true, min: 0 },
    month: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Budget ||
  mongoose.model<BudgetDocument>("Budget", BudgetSchema);

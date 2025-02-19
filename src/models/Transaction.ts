import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["income", "expense"], required: true }, // ✅ Ensure 'type' is required
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

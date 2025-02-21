export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category:
    | "Food"
    | "Transportation"
    | "Entertainment"
    | "Bills"
    | "Shopping"
    | "Others";
  date: string | Date;
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

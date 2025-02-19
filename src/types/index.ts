export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: string; // Ensure "type" exists!
}

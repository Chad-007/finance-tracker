import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://alan:alan@forbus.m6jf1oz.mongodb.net/?retryWrites=true&w=majority&appName=forbus";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: "finance-tracker",
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

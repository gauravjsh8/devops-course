import mongoose from "mongoose";

export async function connectDatabase(uri: string): Promise<void> {
  if (!uri.trim()) {
    throw new Error("MongoDB connection URI is required");
  }

  await mongoose.connect(uri);

  console.log("Connected to the database successfully");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

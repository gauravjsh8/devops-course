import mongoose from "mongoose";

export async function connectToDb(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the .env file");
  }

  await mongoose.connect(mongoUri);

  console.log("Connected to the database successfully");
}

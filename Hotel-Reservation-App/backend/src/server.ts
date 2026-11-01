import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { validateAuthConfiguration } from "./services/authService.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

async function startServer(): Promise<void> {
  validateAuthConfiguration();
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the .env file");
  }

  await connectDatabase(mongoUri);
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start the server: ", error);
  process.exit(1);
});

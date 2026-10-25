import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectToDb } from "./config/db.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await connectToDb();
}

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
startServer().catch((error: unknown) => {
  console.error("Failed to start the server: ", error);
  process.exit(1);
});

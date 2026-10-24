import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

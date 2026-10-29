import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);

  app.get("/", (_req, res) => {
    res.send("Welcome to the Hotel Reservation API");
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" }); //to check app is running
  });

  app.get("/api/hotel", (_req, res) => {
    res.json({
      status: "OK",
      message: "Hotel Reservation API is running",
    });
  });

  return app;
}

import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import adminRoomRoutes from "./routes/adminRoomRoutes";
import adminStatisticsRoutes from "./routes/adminStatisticsRoutes";
import uploadRoutes, { uploadFolder } from "./routes/uploadRoutes";
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/admin/rooms", adminRoomRoutes);
  app.use("/api/admin/statistics", adminStatisticsRoutes);
  app.use("/api/reservations", reservationRoutes);
  app.use("/uploads", express.static(uploadFolder)); // show saved photos
  app.use("/api/uploads", uploadRoutes); // upload new photos

  app.get("/", (_req, res) => {
    res.send("Welcome to the Hotel Reservation API");
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/api/hotel", (_req, res) => {
    res.json({
      status: "OK",
      message: "Hotel Reservation API is running",
    });
  });

  return app;
}

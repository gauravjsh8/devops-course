import type { Request, Response } from "express";
import { getHotelStatistics } from "../services/statisticsService";

export async function getStatistics(_req: Request, res: Response) {
  try {
    const statistics = await getHotelStatistics();
    res.json({ statistics });
  } catch (error) {
    console.error("Statistics retrieval error:", error);
    res.status(500).json({ message: "Unable to retrieve hotel statistics" });
  }
}

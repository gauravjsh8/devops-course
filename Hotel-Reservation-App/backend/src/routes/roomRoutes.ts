import { Router } from "express";
import {
  createRoom,
  deactivateRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../controllers/roomController";
import { requireAuth, requireRole } from "../services/authService";
import { searchAvailableRooms } from "../controllers/reservationController";

const router = Router();

router.post("/", requireAuth, requireRole("administrator"), createRoom);
router.get("/", getAllRooms);
router.get("/available", searchAvailableRooms);
router.get("/:id", getRoomById);
router.put("/:id", requireAuth, requireRole("administrator"), updateRoom);
router.delete(
  "/:id",
  requireAuth,
  requireRole("administrator"),
  deactivateRoom,
);

export default router;

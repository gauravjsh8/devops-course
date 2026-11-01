import { Router } from "express";
import {
  createRoom,
  deactivateRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../controllers/roomController";
import { requireAuth, requireRole } from "../services/authService";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("receptionist", "administrator"),
  createRoom,
);
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.put(
  "/:id",
  requireAuth,
  requireRole("receptionist", "administrator"),
  updateRoom,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("receptionist", "administrator"),
  deactivateRoom,
);

export default router;

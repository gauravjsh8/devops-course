import { Router } from "express";
import {
  createRoom,
  deactivateRoom,
  setRoomUnavailable,
  updateRoom,
  updateRoomPrice,
} from "../controllers/roomController";
import { requireAuth, requireRole } from "../services/authService";

const router = Router();

router.use(requireAuth, requireRole("administrator"));
router.post("/", createRoom);
router.patch("/:id", updateRoom);
router.post("/:id/deactivate", deactivateRoom);
router.patch("/:id/price", updateRoomPrice);
router.patch("/:id/availability", setRoomUnavailable);

export default router;

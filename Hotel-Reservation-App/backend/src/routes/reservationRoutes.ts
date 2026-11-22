import { Router } from "express";
import {
  cancelReservation,
  createReservation,
  getMyReservations,
  getReservationById,
  getReservations,
  updateReservation,
} from "../controllers/reservationController";
import { optionalAuth, requireAuth, requireRole } from "../services/authService";

const router = Router();

router.post("/", optionalAuth, createReservation);
router.get("/my", requireAuth, requireRole("customer"), getMyReservations);
router.get(
  "/",
  requireAuth,
  requireRole("customer", "receptionist", "administrator"),
  getReservations,
);
router.get("/:id", requireAuth, getReservationById);
router.patch("/:id", requireAuth, updateReservation);
router.post("/:id/cancel", requireAuth, cancelReservation);
router.put("/:id", requireAuth, updateReservation);
router.patch("/:id/cancel", requireAuth, cancelReservation);

export default router;

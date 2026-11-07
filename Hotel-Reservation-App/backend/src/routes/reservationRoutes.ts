import { Router } from "express";
import {
  cancelReservation,
  createReservation,
  getAllReservations,
  getMyReservations,
  getReservationById,
  updateReservation,
} from "../controllers/reservationController";
import { requireAuth, requireRole } from "../services/authService";

const router = Router();

router.use(requireAuth); // must be logged in for everything below

router.post("/", requireRole("customer"), createReservation);
router.get("/my", requireRole("customer"), getMyReservations);
router.get(
  "/",
  requireRole("receptionist", "administrator"),
  getAllReservations,
);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.patch("/:id/cancel", cancelReservation);

export default router;

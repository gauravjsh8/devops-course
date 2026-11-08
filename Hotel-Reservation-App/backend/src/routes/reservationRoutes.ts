import { Router } from "express";
import {
  cancelReservation,
  createReservation,
  getMyReservations,
  getReservationById,
  getReservations,
  updateReservation,
} from "../controllers/reservationController";
import { requireAuth, requireRole } from "../services/authService";

const router = Router();

router.use(requireAuth); // must be logged in for everything below

router.post("/", requireRole("customer", "receptionist"), createReservation);
router.get("/my", requireRole("customer"), getMyReservations);
router.get(
  "/",
  requireRole("customer", "receptionist", "administrator"),
  getReservations,
);
router.get("/:id", getReservationById);
router.patch("/:id", updateReservation);
router.post("/:id/cancel", cancelReservation);
router.put("/:id", updateReservation);
router.patch("/:id/cancel", cancelReservation);

export default router;

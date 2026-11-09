import { Router } from "express";
import { getStatistics } from "../controllers/statisticsController";
import { requireAuth, requireRole } from "../services/authService";

const router = Router();

router.use(requireAuth, requireRole("administrator"));
router.get("/", getStatistics);

export default router;

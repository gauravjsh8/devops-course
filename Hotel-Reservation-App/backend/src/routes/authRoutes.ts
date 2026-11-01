import { Router } from "express";
import { login, logout, register } from "../controllers/authController";
import { requireAuth } from "../services/authService";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

export default router;

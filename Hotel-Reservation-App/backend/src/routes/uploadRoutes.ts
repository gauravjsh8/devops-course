import { randomUUID } from "node:crypto";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../services/authService";

export const uploadFolder = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    callback(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

router.post("/", requireAuth, requireRole("administrator"), (req, res) => {
  upload.single("photo")(req, res, (error) => {
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (!req.file) {
      res
        .status(400)
        .json({ message: "Please choose a JPG, PNG or WEBP image (max 2 MB)" });
      return;
    }

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  });
});

export default router;

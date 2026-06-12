import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), uploadImageController);

export default router;

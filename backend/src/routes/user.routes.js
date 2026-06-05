import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../schemas/user.schema.js";
import {
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();

// PUT /api/users/me — debe ir ANTES de /:id para que "me" no sea capturado como id
router.put("/me", authMiddleware, validateBody(updateProfileSchema), updateProfile);

// GET /api/users/:id — perfil público, sin auth
router.get("/:id", getPublicProfile);

export default router;
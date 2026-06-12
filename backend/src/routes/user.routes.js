import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../schemas/user.schema.js";
import {
  getPublicProfile,
  getPublicProfilePosts,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();

// Rutas con segmentos fijos primero para evitar conflictos con /:id
router.put("/me", authMiddleware, validateBody(updateProfileSchema), updateProfile);

// GET /api/users/:id/posts — posts públicos del usuario, sin auth
router.get("/:id/posts", getPublicProfilePosts);

// GET /api/users/:id — perfil público, sin auth
router.get("/:id", getPublicProfile);

export default router;

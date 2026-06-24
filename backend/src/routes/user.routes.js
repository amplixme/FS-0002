import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../schemas/user.schema.js";
import {
  getPublicProfile,
  getPublicProfilePosts,
  updateProfile,
  getMyDrafts,
} from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuarios
 */

/**
 * PUT /api/users/me — actualizar perfil propio
 * IMPORTANTE: debe ir antes de /:id para que "me" no se interprete como un ID.
 */
router.put("/me", authMiddleware, validateBody(updateProfileSchema), updateProfile);

/**
 * GET /api/users/me/drafts — borradores propios (autenticado)
 * IMPORTANTE: debe ir antes de /:id/posts por la misma razón.
 *
 * @swagger
 * /api/users/me/drafts:
 *   get:
 *     summary: Borradores del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de borradores propios
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 5
 *                   title: "Mi borrador"
 *                   published: false
 *                   categories: []
 *       401:
 *         description: No autenticado
 */
router.get("/me/drafts", authMiddleware, getMyDrafts);

/**
 * @swagger
 * /api/users/{id}/posts:
 *   get:
 *     summary: Posts publicados de un usuario
 *     tags: [Users]
 */
router.get("/:id/posts", getPublicProfilePosts);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Perfil público de un usuario
 *     tags: [Users]
 */
router.get("/:id", getPublicProfile);

export default router;


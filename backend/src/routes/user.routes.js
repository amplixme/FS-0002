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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuarios
 */

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Actualizar perfil propio (autenticado)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *           example:
 *             name: "Thomas Bretschneider"
 *             bio: "Desarrollador Full Stack"
 *             avatarUrl: "https://res.cloudinary.com/dafcbbhf9/image/upload/v1/avatar.jpg"
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: 9
 *                 name: "Thomas Bretschneider"
 *                 bio: "Desarrollador Full Stack"
 *                 avatarUrl: "https://res.cloudinary.com/dafcbbhf9/image/upload/v1/avatar.jpg"
 *                 email: "thomas@gmail.com"
 *                 role: "USER"
 *       401:
 *         description: No autenticado
 *       400:
 *         description: Datos inválidos
 */
router.put("/me", authMiddleware, validateBody(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /api/users/{id}/posts:
 *   get:
 *     summary: Posts publicados de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Lista de posts del usuario
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 17
 *                   title: "Edit Post 3"
 *                   published: true
 *                   author:
 *                     name: "Thomas Brets"
 *                   categories: []
 */
router.get("/:id/posts", getPublicProfilePosts);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Perfil público de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Perfil público del usuario
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: 9
 *                 name: "Thomas Brets"
 *                 bio: "Desarrollador Full Stack"
 *                 avatarUrl: null
 *                 createdAt: "2026-06-01T00:00:00.000Z"
 *                 postCount: 3
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", getPublicProfile);

export default router;

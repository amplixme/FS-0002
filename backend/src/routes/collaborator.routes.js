import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import * as collaboratorController from "../controllers/collaborator.controller.js";

const router = Router();

/**
 * Todos los endpoints de este router requieren autenticación
 * y rol ADMIN o COLLABORATOR.
 */
router.use(authMiddleware, requireRole("ADMIN", "COLLABORATOR"));

/**
 * @swagger
 * tags:
 *   name: Collaborator
 *   description: Panel de colaboración — revisión y moderación de borradores de USER
 */

/**
 * @swagger
 * /api/collaborator/pending:
 *   get:
 *     summary: Listar borradores pendientes de usuarios USER
 *     tags: [Collaborator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de borradores pendientes
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 5
 *                   title: "Mi primer artículo"
 *                   published: false
 *                   author:
 *                     id: 3
 *                     name: "Angel Berretta"
 *                     role: "USER"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso (se requiere ADMIN o COLLABORATOR)
 */
router.get("/pending", collaboratorController.getPendingPosts);

/**
 * @swagger
 * /api/collaborator/posts/{id}/publish:
 *   patch:
 *     summary: Publicar un borrador de usuario USER
 *     tags: [Collaborator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Post publicado correctamente
 *       400:
 *         description: El post ya está publicado
 *       403:
 *         description: No es un borrador de USER
 *       404:
 *         description: Post no encontrado
 */
router.patch("/posts/:id/publish", collaboratorController.publishPost);

/**
 * @swagger
 * /api/collaborator/posts/{id}:
 *   delete:
 *     summary: Rechazar (eliminar) un borrador de usuario USER
 *     tags: [Collaborator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Borrador rechazado y eliminado
 *       400:
 *         description: No podés rechazar un post ya publicado
 *       403:
 *         description: No es un borrador de USER
 *       404:
 *         description: Post no encontrado
 */
router.delete("/posts/:id", collaboratorController.rejectPost);

export default router;

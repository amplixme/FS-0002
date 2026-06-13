import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  updateCommentController,
  deleteCommentController,
} from "../controllers/comment.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints de comentarios
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Actualizar un comentario propio
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario (UUID)
 *         example: "e44f36e6-409f-4be9-b1fd-7aa4d751cd0d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "Comentario actualizado"
 *     responses:
 *       200:
 *         description: Comentario actualizado
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: "e44f36e6-409f-4be9-b1fd-7aa4d751cd0d"
 *                 content: "Comentario actualizado"
 *                 author:
 *                   name: "Thomas Brets"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado — no es el autor del comentario
 *       404:
 *         description: Comentario no encontrado
 */
router.put("/:id", authMiddleware, updateCommentController);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario propio o cualquiera si es ADMIN
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "e44f36e6-409f-4be9-b1fd-7aa4d751cd0d"
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 message: "Comentario eliminado correctamente"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Comentario no encontrado
 */
router.delete("/:id", authMiddleware, deleteCommentController);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getCategories, create, update, remove } from "../controllers/category.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints de categorías
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "e4b4c479-56ad-455d-b33d-e75b90b0789f"
 *                   name: "Tecnología"
 *                   slug: "tecnologia"
 *                   _count:
 *                     posts: 3
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una categoría (solo ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *           example:
 *             name: "Programación"
 *             slug: "programacion"
 *     responses:
 *       201:
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: "abc123"
 *                 name: "Programación"
 *                 slug: "programacion"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 */
router.post("/", authMiddleware, requireRole("ADMIN"), create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría (solo ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría (UUID)
 *         example: "e4b4c479-56ad-455d-b33d-e75b90b0789f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Tecnología"
 *             slug: "tecnologia"
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/:id", authMiddleware, requireRole("ADMIN"), update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría (solo ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "e4b4c479-56ad-455d-b33d-e75b90b0789f"
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 message: "Categoría eliminada correctamente"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: No se puede eliminar una categoría con posts asociados
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), remove);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// Todos los endpoints requieren auth + rol ADMIN
router.use(authMiddleware, requireRole("ADMIN"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints del panel de administración (requieren rol ADMIN)
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Estadísticas generales
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 totalUsers: 5
 *                 totalPosts: 10
 *                 totalComments: 30
 *                 weekPosts: 3
 *                 postsByCategory:
 *                   - name: "Tecnología"
 *                     slug: "tecnologia"
 *                     count: 4
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 */
router.get("/stats", adminController.getStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 9
 *                   name: "Thomas Brets"
 *                   email: "thomas@gmail.com"
 *                   role: "USER"
 *                   postCount: 3
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 */
router.get("/users", adminController.getUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Crear un usuario desde el panel admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Nuevo Usuario"
 *             email: "nuevo@gmail.com"
 *             password: "123456"
 *             role: "USER"
 *     responses:
 *       201:
 *         description: Usuario creado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 *       409:
 *         description: El email ya está registrado
 */
router.post("/users", adminController.createUser);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Cambiar rol de un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             role: "ADMIN"
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       403:
 *         description: No podés cambiar tu propio rol
 *       404:
 *         description: Usuario no encontrado
 */
router.patch("/users/:id/role", adminController.changeRole);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Actualizar datos de un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Nombre actualizado"
 *             email: "nuevo@gmail.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       403:
 *         description: No podés cambiar tu propio rol
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El email ya está en uso
 */
router.patch("/users/:id", adminController.updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 message: "Usuario eliminado correctamente"
 *       403:
 *         description: No podés eliminarte a vos mismo
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/users/:id", adminController.deleteUser);

/**
 * @swagger
 * /api/admin/posts:
 *   get:
 *     summary: Listar posts recientes (últimos 10)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts recientes
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 */
router.get("/posts", adminController.getRecentPosts);

/**
 * @swagger
 * /api/admin/posts/{id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 17
 *     responses:
 *       200:
 *         description: Post eliminado
 *       404:
 *         description: Post no encontrado
 */
router.delete("/posts/:id", adminController.deletePost);

/**
 * @swagger
 * /api/admin/comments:
 *   get:
 *     summary: Listar comentarios recientes (últimos 10)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios recientes
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es ADMIN
 */
router.get("/comments", adminController.getRecentComments);

/**
 * @swagger
 * /api/admin/comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Admin]
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
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       404:
 *         description: Comentario no encontrado
 */
router.delete("/comments/:id", adminController.deleteComment);

export default router;

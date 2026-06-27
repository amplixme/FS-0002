import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  create,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost,
} from "../controllers/post.controller.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import {
  createCommentController,
  getCommentsController,
} from "../controllers/comment.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints de posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Listar posts publicados
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Slug de la categoría para filtrar
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, comments]
 *           default: newest
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda en título y contenido
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 data:
 *                   - id: 17
 *                     title: "Edit Post 3"
 *                     content: "Probando editPost 3"
 *                     published: true
 *                     authorId: 9
 *                     coverImage: "https://i.ibb.co/ZRR72wbf/IMG-6148.jpg"
 *                     commentCount: 2
 *                     author:
 *                       name: "Thomas Brets"
 *                     categories: []
 *                 total: 5
 *                 totalPages: 1
 *                 currentPage: 1
 */
router.get("/", getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obtener post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 17
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 id: 17
 *                 title: "Edit Post 3"
 *                 content: "Probando editPost 3"
 *                 published: true
 *                 authorId: 9
 *                 coverImage: "https://i.ibb.co/ZRR72wbf/IMG-6148.jpg"
 *                 author:
 *                   name: "Thomas Brets"
 *                 categories: []
 *       404:
 *         description: Post no encontrado
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crear un nuevo post (autenticado)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post creado
 *       401:
 *         description: No autenticado
 */
router.post("/", authMiddleware, upload.single("image"), validateBody(createPostSchema), create);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Actualizar un post (solo autor o ADMIN)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 17
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post actualizado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */
router.put("/:id", authMiddleware, upload.single("image"), updatePost);

/**
 * @swagger
 * /api/posts/{id}/publish:
 *   patch:
 *     summary: Publicar un borrador (ADMIN o COLLABORATOR)
 *     tags: [Posts]
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
 *         description: Post publicado correctamente
 *       400:
 *         description: El post ya está publicado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */
router.patch("/:id/publish", authMiddleware, publishPost);


/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Eliminar un post (solo autor o ADMIN)
 *     tags: [Posts]
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
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 message: "Post eliminado correctamente"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Post no encontrado
 */
router.delete("/:id", authMiddleware, deletePost);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Listar comentarios de un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 17
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "e44f36e6-409f-4be9-b1fd-7aa4d751cd0d"
 *                   content: "Aguante Messi"
 *                   postId: 17
 *                   authorId: 9
 *                   author:
 *                     name: "Thomas Brets"
 */
router.get("/:postId/comments", getCommentsController);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Crear un comentario en un post (autenticado)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 17
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "Muy buen artículo!"
 *     responses:
 *       201:
 *         description: Comentario creado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Post no encontrado
 */
router.post("/:postId/comments", authMiddleware, validateBody(createCommentSchema), createCommentController);

export default router;

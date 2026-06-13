import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoints de subida de imágenes
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir una imagen a Cloudinary (autenticado)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (JPG, PNG, WEBP — máx. 5MB)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 url: "https://res.cloudinary.com/dafcbbhf9/image/upload/v1780691405/posts/abc123.jpg"
 *       400:
 *         description: No se envió ninguna imagen
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 message: "No se envió ninguna imagen"
 *       401:
 *         description: No autenticado
 */
router.post("/", authMiddleware, upload.single("image"), uploadImageController);

export default router;
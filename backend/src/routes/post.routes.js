import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { create, getPost, getPostById } from "../controllers/post.controller.js";

const router = Router();

router.post("/", authMiddleware, validateBody(createPostSchema), create);

router.get("/", getPost)
router.get("/:id", getPostById)

export default router;
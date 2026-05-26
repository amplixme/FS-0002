import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { create, getPosts, getPostById } from "../controllers/post.controller.js";

const router = Router();

router.post("/", authMiddleware, validateBody(createPostSchema), create);

router.get("/", getPosts)
router.get("/:id", getPostById)

export default router;
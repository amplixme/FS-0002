import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { create } from "../controllers/post.controller.js";

const router = Router();

router.post("/", authMiddleware, validateBody(createPostSchema), create);

export default router;
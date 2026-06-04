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
} from "../controllers/post.controller.js";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), validateBody(createPostSchema), create);
router.put("/:id", authMiddleware, upload.single("image"), updatePost);
router.delete("/:id", authMiddleware, deletePost);

router.get("/", getPosts);
router.get("/:id", getPostById);

export default router;

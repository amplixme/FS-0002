import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { updateCommentController, deleteCommentController } from "../controllers/comment.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router()

router.put("/:id", authMiddleware, updateCommentController)
router.delete("/:id", authMiddleware, deleteCommentController)

export default router
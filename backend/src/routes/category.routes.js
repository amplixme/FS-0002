import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getCategories, create, update, remove } from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategories);

router.post("/", authMiddleware, requireRole("ADMIN"), create);

router.put("/:id", authMiddleware, requireRole("ADMIN"), update);

router.delete("/:id", authMiddleware, requireRole("ADMIN"), remove);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// Todos los endpoints requieren auth + rol ADMIN
router.use(authMiddleware, requireRole("ADMIN"));

// Stats
router.get("/stats", adminController.getStats);

// Users
router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser);
router.patch("/users/:id/role", adminController.changeRole);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Posts (admin panel)
router.get("/posts", adminController.getRecentPosts);
router.delete("/posts/:id", adminController.deletePost);

// Comments (admin panel)
router.get("/comments", adminController.getRecentComments);
router.delete("/comments/:id", adminController.deleteComment);

export default router;

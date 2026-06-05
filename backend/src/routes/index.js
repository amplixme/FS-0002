import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import categoryRoutes from "./category.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);

export default router;
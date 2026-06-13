import { Router } from "express";
import { getStats } from "../controllers/dashboard-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = Router();
router.use(authMiddleware);
router.get("/stats", getStats);

export default router;

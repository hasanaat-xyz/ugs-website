import { Router } from "express";
import { listUsers, updateUserRole } from "../controllers/user-controller.js";
import { authMiddleware, requireRoles } from "../middleware/auth-middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", requireRoles("owner", "manager"), listUsers);
router.put("/:id/role", requireRoles("owner", "manager"), updateUserRole);

export default router;

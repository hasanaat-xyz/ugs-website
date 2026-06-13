import { Router } from "express";
import {
  listBoats,
  getBoat,
  createBoat,
  updateBoat,
  deleteBoat,
} from "../controllers/boat-controller.js";
import { authMiddleware, requireRoles } from "../middleware/auth-middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", listBoats);
router.get("/:id", getBoat);
router.post("/", requireRoles("owner", "manager"), createBoat);
router.put("/:id", requireRoles("owner", "manager"), updateBoat);
router.delete("/:id", requireRoles("owner", "manager"), deleteBoat);

export default router;

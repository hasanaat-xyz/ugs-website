import { Router } from "express";
import {
  listAvailability,
  createAvailability,
  deleteAvailability,
  checkAvailableDates,
  calendarEvents,
} from "../controllers/availability-controller.js";
import { authMiddleware, requireRoles } from "../middleware/auth-middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/calendar/events", calendarEvents);
router.get("/boats/:boatId/availability", listAvailability);
router.post("/boats/:boatId/availability", requireRoles("owner", "manager"), createAvailability);
router.delete("/boats/:boatId/availability/:blockId", requireRoles("owner", "manager"), deleteAvailability);
router.get("/boats/:boatId/available-dates", checkAvailableDates);

export default router;

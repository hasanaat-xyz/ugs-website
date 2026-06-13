import { Router } from "express";
import {
  listReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
} from "../controllers/reservation-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", listReservations);
router.get("/:id", getReservation);
router.post("/", createReservation);
router.put("/:id", updateReservation);
router.delete("/:id", cancelReservation);

export default router;

import { Router } from "express";
import {
  listMarinas,
  listMarinaBoats,
  getPublicBoat,
  checkPublicAvailability,
  createPublicReservation,
  getPublicReservation,
} from "../controllers/public-controller.js";

const router = Router();

router.get("/marinas", listMarinas);
router.get("/marinas/:slug/boats", listMarinaBoats);
router.get("/boats/:id", getPublicBoat);
router.get("/boats/:id/check-availability", checkPublicAvailability);
router.post("/reservations", createPublicReservation);
router.get("/reservations/:id", getPublicReservation);

export default router;

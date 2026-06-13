import { Router } from "express";
import {
  listPayments,
  createDeposit,
  createFullPayment,
  createDamageFee,
  stripeOnboard,
  stripeWebhook,
} from "../controllers/payment-controller.js";
import { authMiddleware, requireRoles } from "../middleware/auth-middleware.js";

const router = Router();

router.post("/webhooks/stripe", stripeWebhook);

router.use(authMiddleware);
router.get("/", requireRoles("owner", "manager"), listPayments);
router.post("/deposit", createDeposit);
router.post("/full", createFullPayment);
router.post("/damage", requireRoles("owner", "manager"), createDamageFee);
router.get("/stripe/onboard", requireRoles("owner"), stripeOnboard);

export default router;

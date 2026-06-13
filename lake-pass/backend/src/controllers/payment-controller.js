import Payment from "../models/payment-model.js";
import Reservation from "../models/reservation-model.js";
import Marina from "../models/marina-model.js";
import {
  createPaymentIntent,
  createOnboardingLink,
  handleStripeWebhook,
} from "../services/stripe-service.js";

export const listPayments = async (req, res) => {
  const reservations = await Reservation.find({ marinaId: req.marinaId }).select("_id");
  const ids = reservations.map((r) => r._id);
  const payments = await Payment.find({ reservationId: { $in: ids } }).sort({ createdAt: -1 });
  res.json(payments);
};

export const createDeposit = async (req, res) => {
  const reservation = await Reservation.findOne({
    _id: req.body.reservationId,
    marinaId: req.marinaId,
  });
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });

  const marina = await Marina.findById(req.marinaId);
  const pct = marina?.settings?.depositPercent ?? 20;
  const depositAmount = Math.round(reservation.totalAmount * pct / 100 * 100) / 100;

  const { payment, clientSecret } = await createPaymentIntent(
    reservation,
    depositAmount,
    "deposit",
    marina
  );
  res.json({ clientSecret, paymentId: payment._id });
};

export const createFullPayment = async (req, res) => {
  const reservation = await Reservation.findOne({
    _id: req.body.reservationId,
    marinaId: req.marinaId,
  });
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });

  const marina = await Marina.findById(req.marinaId);
  const { payment, clientSecret } = await createPaymentIntent(
    reservation,
    reservation.totalAmount,
    "full",
    marina
  );
  res.json({ clientSecret, paymentId: payment._id });
};

export const createDamageFee = async (req, res) => {
  const { reservationId, amount } = req.body;
  const reservation = await Reservation.findOne({
    _id: reservationId,
    marinaId: req.marinaId,
  });
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });

  const marina = await Marina.findById(req.marinaId);
  const { payment, clientSecret } = await createPaymentIntent(
    reservation,
    amount,
    "damage",
    marina
  );
  res.json({ clientSecret, paymentId: payment._id });
};

export const stripeOnboard = async (req, res) => {
  const marina = await Marina.findById(req.marinaId);
  const url = await createOnboardingLink(marina);
  res.json({ url });
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const result = await handleStripeWebhook(req.body, sig);
  res.json(result);
};

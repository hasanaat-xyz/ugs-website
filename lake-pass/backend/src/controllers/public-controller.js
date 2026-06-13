import Boat from "../models/boat-model.js";
import Customer from "../models/customer-model.js";
import Marina from "../models/marina-model.js";
import Reservation from "../models/reservation-model.js";
import Payment from "../models/payment-model.js";
import { checkAvailability, calculateTotal } from "../services/availability-service.js";
import { createPaymentIntent, sendConfirmationEmail } from "../services/stripe-service.js";

export const listMarinas = async (_req, res) => {
  const marinas = await Marina.find().select("name slug settings");
  res.json(marinas);
};

export const listMarinaBoats = async (req, res) => {
  const marina = await Marina.findOne({ slug: req.params.slug });
  if (!marina) return res.status(404).json({ message: "Marina not found" });

  const { boatType, startDate, endDate } = req.query;
  let boats = await Boat.find({ marinaId: marina._id });
  if (boatType) {
    boats = boats.filter((b) => b.type.toLowerCase().includes(boatType.toLowerCase()));
  }
  if (startDate && endDate) {
    const available = [];
    for (const boat of boats) {
      const result = await checkAvailability(boat, startDate, endDate);
      if (result.available) available.push(boat);
    }
    boats = available;
  }
  res.json(boats);
};

export const getPublicBoat = async (req, res) => {
  const boat = await Boat.findById(req.params.id).populate("marinaId", "name slug");
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  res.json({
    ...boat.toObject(),
    marina: boat.marinaId,
  });
};

export const checkPublicAvailability = async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  const { startDate, endDate } = req.query;
  const result = await checkAvailability(boat, startDate, endDate);
  const totalAmount = result.available
    ? calculateTotal(boat, startDate, endDate)
    : null;
  res.json({ ...result, totalAmount });
};

export const createPublicReservation = async (req, res) => {
  const { boatId, startDate, endDate, customerName, customerEmail, customerPhone } = req.body;

  const boat = await Boat.findById(boatId).populate("marinaId");
  if (!boat) return res.status(404).json({ message: "Boat not found" });

  const avail = await checkAvailability(boat, startDate, endDate);
  if (!avail.available) {
    return res.status(400).json({ message: "Not available", conflicts: avail.conflicts });
  }

  let customer = await Customer.findOne({
    email: customerEmail,
    marinaId: boat.marinaId._id,
  });
  if (!customer) {
    customer = await Customer.create({
      marinaId: boat.marinaId._id,
      name: customerName,
      email: customerEmail,
      phone: customerPhone || "",
    });
  }

  const totalAmount = calculateTotal(boat, startDate, endDate);
  const reservation = await Reservation.create({
    marinaId: boat.marinaId._id,
    boatId: boat._id,
    customerId: customer._id,
    startDate,
    endDate,
    status: "pending",
    totalAmount,
  });

  const marina = boat.marinaId;
  const pct = marina.settings?.depositPercent ?? 20;
  const depositAmount = Math.round(totalAmount * pct / 100 * 100) / 100;

  const { clientSecret } = await createPaymentIntent(
    reservation,
    depositAmount,
    "deposit",
    marina
  );

  sendConfirmationEmail(reservation);

  res.status(201).json({
    ...reservation.toObject(),
    paymentClientSecret: clientSecret,
  });
};

export const getPublicReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate("boatId")
    .populate("customerId");
  if (!reservation) return res.status(404).json({ message: "Not found" });
  res.json(reservation);
};

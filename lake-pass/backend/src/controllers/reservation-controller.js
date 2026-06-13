import Boat from "../models/boat-model.js";
import Customer from "../models/customer-model.js";
import Reservation from "../models/reservation-model.js";
import { checkAvailability, calculateTotal } from "../services/availability-service.js";
import { sendConfirmationEmail } from "../services/stripe-service.js";

export const listReservations = async (req, res) => {
  const { search, status } = req.query;
  const filter = { marinaId: req.marinaId };
  if (status) filter.status = status;

  let query = Reservation.find(filter)
    .populate("boatId")
    .populate("customerId")
    .sort({ startDate: -1 });

  if (search) {
    const customers = await Customer.find({
      marinaId: req.marinaId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    filter.customerId = { $in: customers.map((c) => c._id) };
    query = Reservation.find(filter)
      .populate("boatId")
      .populate("customerId")
      .sort({ startDate: -1 });
  }

  res.json(await query);
};

export const getReservation = async (req, res) => {
  const reservation = await Reservation.findOne({
    _id: req.params.id,
    marinaId: req.marinaId,
  })
    .populate("boatId")
    .populate("customerId");
  if (!reservation) return res.status(404).json({ message: "Not found" });
  res.json(reservation);
};

export const createReservation = async (req, res) => {
  const { boatId, customerId, startDate, endDate, customerName, customerEmail, customerPhone } = req.body;

  const boat = await Boat.findOne({ _id: boatId, marinaId: req.marinaId });
  if (!boat) return res.status(404).json({ message: "Boat not found" });

  const avail = await checkAvailability(boat, startDate, endDate);
  if (!avail.available) {
    return res.status(400).json({ message: "Not available", conflicts: avail.conflicts });
  }

  let customer;
  if (customerId) {
    customer = await Customer.findOne({ _id: customerId, marinaId: req.marinaId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
  } else {
    customer = await Customer.findOne({ email: customerEmail, marinaId: req.marinaId });
    if (!customer) {
      customer = await Customer.create({
        marinaId: req.marinaId,
        name: customerName || "Guest",
        email: customerEmail,
        phone: customerPhone || "",
      });
    }
  }

  const totalAmount = calculateTotal(boat, startDate, endDate);
  const reservation = await Reservation.create({
    marinaId: req.marinaId,
    boatId,
    customerId: customer._id,
    startDate,
    endDate,
    status: "confirmed",
    totalAmount,
  });

  sendConfirmationEmail(reservation);
  res.status(201).json(await reservation.populate(["boatId", "customerId"]));
};

export const updateReservation = async (req, res) => {
  const reservation = await Reservation.findOne({
    _id: req.params.id,
    marinaId: req.marinaId,
  });
  if (!reservation) return res.status(404).json({ message: "Not found" });

  const { startDate, endDate, status } = req.body;
  if (startDate || endDate) {
    const boat = await Boat.findById(reservation.boatId);
    const start = startDate || reservation.startDate;
    const end = endDate || reservation.endDate;
    const avail = await checkAvailability(boat, start, end, reservation._id);
    if (!avail.available) {
      return res.status(400).json({ message: "Not available", conflicts: avail.conflicts });
    }
    reservation.startDate = start;
    reservation.endDate = end;
    reservation.totalAmount = calculateTotal(boat, start, end);
  }
  if (status) reservation.status = status;
  await reservation.save();
  res.json(await reservation.populate(["boatId", "customerId"]));
};

export const cancelReservation = async (req, res) => {
  const reservation = await Reservation.findOneAndUpdate(
    { _id: req.params.id, marinaId: req.marinaId },
    { status: "cancelled" },
    { new: true }
  ).populate(["boatId", "customerId"]);
  if (!reservation) return res.status(404).json({ message: "Not found" });
  res.json(reservation);
};

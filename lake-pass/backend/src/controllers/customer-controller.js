import Customer from "../models/customer-model.js";
import Reservation from "../models/reservation-model.js";

export const listCustomers = async (req, res) => {
  const { search } = req.query;
  const filter = { marinaId: req.marinaId };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const customers = await Customer.find(filter).sort({ name: 1 });
  res.json(customers);
};

export const getCustomer = async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    marinaId: req.marinaId,
  });
  if (!customer) return res.status(404).json({ message: "Not found" });

  const reservations = await Reservation.find({
    customerId: customer._id,
    marinaId: req.marinaId,
  })
    .populate("boatId")
    .sort({ startDate: -1 });

  res.json({ ...customer.toObject(), reservations });
};

export const createCustomer = async (req, res) => {
  const customer = await Customer.create({ ...req.body, marinaId: req.marinaId });
  res.status(201).json(customer);
};

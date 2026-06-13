import AvailabilityBlock from "../models/availability-model.js";
import Boat from "../models/boat-model.js";
import { checkAvailability, calculateTotal, getCalendarEvents } from "../services/availability-service.js";

const getBoatForMarina = async (boatId, marinaId) => {
  const boat = await Boat.findOne({ _id: boatId, marinaId });
  return boat;
};

export const listAvailability = async (req, res) => {
  const boat = await getBoatForMarina(req.params.boatId, req.marinaId);
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  const blocks = await AvailabilityBlock.find({ boatId: boat._id });
  res.json(blocks);
};

export const createAvailability = async (req, res) => {
  const boat = await getBoatForMarina(req.params.boatId, req.marinaId);
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  const block = await AvailabilityBlock.create({ ...req.body, boatId: boat._id });
  res.status(201).json(block);
};

export const deleteAvailability = async (req, res) => {
  const boat = await getBoatForMarina(req.params.boatId, req.marinaId);
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  await AvailabilityBlock.findOneAndDelete({
    _id: req.params.blockId,
    boatId: boat._id,
  });
  res.status(204).send();
};

export const checkAvailableDates = async (req, res) => {
  const boat = await getBoatForMarina(req.params.boatId, req.marinaId);
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  const { startDate, endDate } = req.query;
  const result = await checkAvailability(boat, startDate, endDate);
  const totalAmount = result.available
    ? calculateTotal(boat, startDate, endDate)
    : null;
  res.json({ ...result, totalAmount });
};

export const calendarEvents = async (req, res) => {
  const events = await getCalendarEvents(req.marinaId);
  res.json(events);
};

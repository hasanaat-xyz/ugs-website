import Boat from "../models/boat-model.js";

export const listBoats = async (req, res) => {
  const boats = await Boat.find({ marinaId: req.marinaId });
  res.json(boats);
};

export const getBoat = async (req, res) => {
  const boat = await Boat.findOne({ _id: req.params.id, marinaId: req.marinaId });
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  res.json(boat);
};

export const createBoat = async (req, res) => {
  const boat = await Boat.create({ ...req.body, marinaId: req.marinaId });
  res.status(201).json(boat);
};

export const updateBoat = async (req, res) => {
  const boat = await Boat.findOneAndUpdate(
    { _id: req.params.id, marinaId: req.marinaId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  res.json(boat);
};

export const deleteBoat = async (req, res) => {
  const boat = await Boat.findOneAndDelete({ _id: req.params.id, marinaId: req.marinaId });
  if (!boat) return res.status(404).json({ message: "Boat not found" });
  res.status(204).send();
};

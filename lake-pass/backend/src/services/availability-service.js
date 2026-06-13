import AvailabilityBlock from "../models/availability-model.js";
import Reservation from "../models/reservation-model.js";
import Marina from "../models/marina-model.js";
import { datesOverlap, daysBetween, addDays, toDateOnly } from "./date-utils.js";

export async function getBufferDays(marinaId) {
  const marina = await Marina.findById(marinaId);
  return marina?.settings?.turnaroundBufferDays ?? 1;
}

export async function checkAvailability(boat, startDate, endDate, excludeReservationId = null) {
  const conflicts = [];
  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  if (end < start) {
    return { available: false, conflicts: ["End date must be on or after start date"] };
  }

  const blocks = await AvailabilityBlock.find({
    boatId: boat._id,
    type: { $in: ["blocked", "maintenance"] },
  });

  for (const block of blocks) {
    if (datesOverlap(start, end, block.startDate, block.endDate)) {
      conflicts.push(`${block.type} period ${block.startDate.toISOString().slice(0, 10)} to ${block.endDate.toISOString().slice(0, 10)}`);
    }
  }

  const reservations = await Reservation.find({
    boatId: boat._id,
    status: { $in: ["confirmed", "pending"] },
  });

  const bufferDays = await getBufferDays(boat.marinaId);
  for (const res of reservations) {
    if (excludeReservationId && res._id.toString() === excludeReservationId.toString()) continue;
    const bufferedEnd = addDays(res.endDate, bufferDays);
    if (datesOverlap(start, end, res.startDate, bufferedEnd)) {
      conflicts.push(`Reservation ${res.startDate.toISOString().slice(0, 10)} to ${res.endDate.toISOString().slice(0, 10)} (incl. ${bufferDays}d buffer)`);
    }
  }

  return { available: conflicts.length === 0, conflicts };
}

export function calculateTotal(boat, startDate, endDate) {
  const days = daysBetween(startDate, endDate);
  return Math.round(boat.pricePerDay * days * 100) / 100;
}

export async function getCalendarEvents(marinaId) {
  const Boat = (await import("../models/boat-model.js")).default;
  const boats = await Boat.find({ marinaId });
  const boatMap = Object.fromEntries(boats.map((b) => [b._id.toString(), b]));
  const boatIds = boats.map((b) => b._id);
  const events = [];

  const colorMap = {
    available: "#22c55e",
    blocked: "#ef4444",
    maintenance: "#f59e0b",
    buffer: "#94a3b8",
  };

  const blocks = await AvailabilityBlock.find({ boatId: { $in: boatIds } });
  for (const block of blocks) {
    const boat = boatMap[block.boatId.toString()];
    events.push({
      id: block._id,
      title: `${boat?.name || "Boat"} - ${block.type}`,
      start: block.startDate,
      end: addDays(block.endDate, 1),
      backgroundColor: colorMap[block.type] || "#3b82f6",
      extendedProps: { type: "availability", boatId: block.boatId },
    });
  }

  const reservations = await Reservation.find({
    marinaId,
    status: { $ne: "cancelled" },
  }).populate("boatId");

  for (const res of reservations) {
    events.push({
      id: res._id,
      title: `${res.boatId?.name || "Boat"} - ${res.status}`,
      start: res.startDate,
      end: addDays(res.endDate, 1),
      backgroundColor: "#3b82f6",
      extendedProps: { type: "reservation", status: res.status },
    });
  }

  return events;
}

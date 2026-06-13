import mongoose from "mongoose";
import Boat from "../models/boat-model.js";
import Customer from "../models/customer-model.js";
import Reservation from "../models/reservation-model.js";
import Payment from "../models/payment-model.js";

export const getStats = async (req, res) => {
  const marinaId = new mongoose.Types.ObjectId(req.marinaId);

  const [totalBoats, activeReservations, totalCustomers, payments] = await Promise.all([
    Boat.countDocuments({ marinaId }),
    Reservation.countDocuments({
      marinaId,
      status: { $in: ["confirmed", "pending"] },
    }),
    Customer.countDocuments({ marinaId }),
    Payment.aggregate([
      {
        $lookup: {
          from: "reservations",
          localField: "reservationId",
          foreignField: "_id",
          as: "reservation",
        },
      },
      { $unwind: "$reservation" },
      { $match: { "reservation.marinaId": marinaId, status: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  res.json({
    totalBoats,
    activeReservations,
    totalCustomers,
    revenue: payments[0]?.total || 0,
  });
};

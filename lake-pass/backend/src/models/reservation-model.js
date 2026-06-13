import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    marinaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marina",
      required: true,
      index: true,
    },
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);

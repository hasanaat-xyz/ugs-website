import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ["available", "blocked", "maintenance", "buffer"],
      required: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

availabilitySchema.index({ boatId: 1, startDate: 1, endDate: 1 });

export default mongoose.model("AvailabilityBlock", availabilitySchema);

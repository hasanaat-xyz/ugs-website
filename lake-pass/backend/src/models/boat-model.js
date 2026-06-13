import mongoose from "mongoose";

const boatSchema = new mongoose.Schema(
  {
    marinaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marina",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    pricePerDay: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Boat", boatSchema);

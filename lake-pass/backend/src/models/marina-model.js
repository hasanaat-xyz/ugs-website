import mongoose from "mongoose";

const marinaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    stripeAccountId: { type: String, default: null },
    settings: {
      turnaroundBufferDays: { type: Number, default: 1 },
      depositPercent: { type: Number, default: 20 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Marina", marinaSchema);

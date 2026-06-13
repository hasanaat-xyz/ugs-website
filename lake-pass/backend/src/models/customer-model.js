import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    marinaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marina",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    insuranceInfo: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

customerSchema.index({ marinaId: 1, email: 1 });

export default mongoose.model("Customer", customerSchema);

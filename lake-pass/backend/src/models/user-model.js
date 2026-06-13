import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "manager", "staff"],
      default: "staff",
    },
    marinaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marina",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

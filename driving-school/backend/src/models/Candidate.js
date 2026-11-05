const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    candidateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: { type: String, trim: true },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },
    llrNumber: { type: String, trim: true, uppercase: true },
    fdlNumber: { type: String, trim: true, uppercase: true },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Keep `phone` for compatibility with records and forms created before
    // the two-number fields were introduced. New search requests check all three.
    mobileNumber1: { type: String, trim: true },
    mobileNumber2: { type: String, trim: true },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    licenseNumber: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
    },

    licenseCategory: {
      type: String,
      enum: ["LMV", "HMV", "MCWG", "MCWOG", "OTHER"],
      default: "LMV",
    },

    admissionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    trainingStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    totalFees: {
      type: Number,
      default: 0,
      min: 0,
    },

    paidFees: {
      type: Number,
      default: 0,
      min: 0,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

candidateSchema.index({ mobileNumber1: 1 });
candidateSchema.index({ mobileNumber2: 1 });
candidateSchema.index({ phone: 1 });

module.exports = mongoose.model("Candidate", candidateSchema);

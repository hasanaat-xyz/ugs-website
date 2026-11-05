
const express = require("express");
const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

const categories = ["LMV", "HMV", "MCWG", "MCWOG", "OTHER"];
const statuses = ["Not Started", "In Progress", "Completed"];

// Normalize phone numbers for comparison.
function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");

  // Handle Indian country code and leading zero.
  if (digits.startsWith("0091") && digits.length === 14) {
    digits = digits.slice(4);
  } else if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  return digits;
}

function validate(data, isPublic = false) {
  if (!data.fullName?.trim()) {
    return "Full name is required.";
  }

  if (!data.phone?.trim()) {
    return "Phone number is required.";
  }

  if (!isPublic && !data.candidateId?.trim()) {
    return "Candidate ID is required.";
  }

  if (
    data.licenseCategory &&
    !categories.includes(data.licenseCategory)
  ) {
    return "Invalid license category.";
  }

  if (
    data.trainingStatus &&
    !statuses.includes(data.trainingStatus)
  ) {
    return "Invalid training status.";
  }

  if (!isPublic) {
    const total = Number(data.totalFees ?? 0);
    const paid = Number(data.paidFees ?? 0);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(paid) ||
      total < 0 ||
      paid < 0 ||
      paid > total
    ) {
      return "Check the fee amounts. Paid fees cannot exceed total fees.";
    }
  }

  return null;
}

// PUBLIC: Student submits admission application without logging in.
router.post("/admission", async (req, res) => {
  try {
    const error = validate(req.body, true);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const candidate = await Candidate.create({
      candidateId: `ADM-${new mongoose.Types.ObjectId().toString()}`,
      fullName: req.body.fullName.trim(),
      phone: req.body.phone.trim(),
      email: req.body.email?.trim() || undefined,
      licenseNumber: req.body.licenseNumber?.trim() || undefined,
      licenseCategory: categories.includes(req.body.licenseCategory)
        ? req.body.licenseCategory
        : "LMV",
      admissionDate: new Date(),
      trainingStatus: "Not Started",
      totalFees: 0,
      paidFees: 0,
      remarks: "Public admission application — awaiting admin review.",
    });

    res.status(201).json({
      message: "Admission application submitted successfully!",
      applicationId: candidate.candidateId,
    });
  } catch (error) {
    console.error("Admission submission error:", error.message);

    res.status(500).json({
      message: "Could not submit application. Please try again.",
    });
  }
});

// All remaining routes require admin/staff login.
router.use(protect);
router.use(authorize("admin", "staff"));

// Register a new candidate (admin/staff).
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Support both mobileNumber1 and the older phone field.
    const phone = String(
      data.mobileNumber1 || data.phone || ""
    ).trim();

    const mobileNumber1 = phone;

    const payload = {
      ...data,
      candidateId:
        String(data.candidateId || "").trim() ||
        `DMDS-${new mongoose.Types.ObjectId().toString()}`,
      fullName: String(data.fullName || "").trim(),
      phone,
      mobileNumber1,
      mobileNumber2: String(data.mobileNumber2 || "").trim(),
      fatherName: String(data.fatherName || "").trim(),
      address: String(data.address || "").trim(),
      email: String(data.email || "").trim() || undefined,
      licenseNumber: String(data.licenseNumber || "").trim(),
      llrNumber: String(data.llrNumber || "").trim(),
      fdlNumber: String(data.fdlNumber || "").trim(),
      licenseCategory: data.licenseCategory || "LMV",
      trainingStatus: data.trainingStatus || "Not Started",
      totalFees: Number(data.totalFees || 0),
      paidFees: Number(data.paidFees || 0),
      remarks: String(data.remarks || "").trim(),
    };

    const error = validate(payload);

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (
      payload.admissionDate &&
      isNaN(Date.parse(payload.admissionDate))
    ) {
      return res.status(400).json({
        message: "Invalid admission date.",
      });
    }

    if (payload.paidFees > payload.totalFees) {
      return res.status(400).json({
        message: "Paid fees cannot exceed total fees.",
      });
    }

    const candidate = await Candidate.create(payload);

    return res.status(201).json({
      message: "Candidate registered successfully!",
      candidate,
    });
  } catch (error) {
    console.error("Candidate registration error:", error);

    return res.status(error.code === 11000 ? 409 : 500).json({
      message:
        error.code === 11000
          ? "Candidate ID already exists."
          : error.name === "ValidationError"
            ? error.message
            : "Could not register candidate.",
    });
  }
});

// Search candidate by contact number only.
router.get("/search", authorize("admin"), async (req, res) => {
  try {
    const rawPhone =
      typeof req.query.phone === "string" ? req.query.phone : "";

    const normalizedPhone = normalizePhone(rawPhone);

    if (
      normalizedPhone.length < 7 ||
      normalizedPhone.length > 15
    ) {
      return res.status(400).json({
        message: "Enter a valid contact number.",
      });
    }

    // Fetch phone fields and compare normalized values in Node.js.
    // This avoids unsupported MongoDB aggregation operators.
    const candidates = await Candidate.find(
      {},
      {
        fullName: 1,
        fatherName: 1,
        phone: 1,
        mobileNumber1: 1,
        mobileNumber2: 1,
        email: 1,
        address: 1,
        admissionDate: 1,
        trainingTimeFrom: 1,
        trainingTimeTo: 1,
        candidateId: 1,
        licenseNumber: 1,
        licenseCategory: 1,
        totalFees: 1,
        paidFees: 1,
        trainingStatus: 1,
        remarks: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    const matchedCandidates = candidates.filter((candidate) => {
      const phoneFields = [
        candidate.phone,
        candidate.mobileNumber1,
        candidate.mobileNumber2,
      ];

      return phoneFields.some(
        (value) =>
          value && normalizePhone(value) === normalizedPhone
      );
    });

    if (!matchedCandidates.length) {
      return res.status(404).json({
        message: "No candidate found with this contact number.",
      });
    }

    return res.json({
      candidates: matchedCandidates,
    });
  } catch (error) {
    console.error("Candidate phone search error:", error);

    return res.status(500).json({
      message: "Search failed.",
    });
  }
});

// List candidates.
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });

    res.json(candidates);
  } catch (error) {
    console.error("Load candidates error:", error.message);

    res.status(500).json({
      message: "Could not load candidates.",
    });
  }
});

// Get one candidate.
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid candidate ID.",
      });
    }

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    res.json({ candidate });
  } catch (error) {
    console.error("Load candidate error:", error.message);

    res.status(500).json({
      message: "Could not load candidate.",
    });
  }
});

// Admin edits candidate fields.
router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid candidate ID.",
      });
    }

    const error = validate(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (
      req.body.admissionDate &&
      isNaN(Date.parse(req.body.admissionDate))
    ) {
      return res.status(400).json({
        message: "Invalid admission date.",
      });
    }

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found.",
      });
    }

    const fields = [
      "candidateId",
      "fullName",
      "fatherName",
      "phone",
      "mobileNumber1",
      "mobileNumber2",
      "email",
      "address",
      "dateOfBirth",
      "licenseNumber",
      "licenseCategory",
      "admissionDate",
      "trainingTimeFrom",
      "trainingTimeTo",
      "llrNumber",
      "fdlNumber",
      "trainingStatus",
      "totalFees",
      "paidFees",
      "remarks",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        candidate[field] = req.body[field];
      }
    }

    await candidate.save();

    res.json({
      message: "Candidate updated.",
      candidate,
    });
  } catch (error) {
    console.error("Update candidate error:", error);

    res.status(error.code === 11000 ? 409 : 500).json({
      message:
        error.code === 11000
          ? "Candidate ID already exists."
          : "Could not update candidate.",
    });
  }
});

module.exports = router;
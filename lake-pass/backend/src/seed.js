import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Marina from "./models/marina-model.js";
import User from "./models/user-model.js";
import Boat from "./models/boat-model.js";
import AvailabilityBlock from "./models/availability-model.js";
import Customer from "./models/customer-model.js";
import Reservation from "./models/reservation-model.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lakepass";

const MARINAS = [
  { name: "Marina A", slug: "marina-a" },
  { name: "Marina B", slug: "marina-b" },
  { name: "Marina C", slug: "marina-c" },
  { name: "Marina D", slug: "marina-d" },
];

const BOAT_TEMPLATES = [
  { name: "Sea Breeze", type: "Pontoon", capacity: 8, pricePerDay: 299 },
  { name: "Wave Runner", type: "Speedboat", capacity: 4, pricePerDay: 449 },
  { name: "Lake Explorer", type: "Sailboat", capacity: 6, pricePerDay: 349 },
];

const DEV_USERS = [
  { name: "Owner A", email: "owner@marina-a.com", password: "password123", slug: "marina-a", role: "owner" },
  { name: "Manager A", email: "manager@marina-a.com", password: "password123", slug: "marina-a", role: "manager" },
  { name: "Staff A", email: "staff@marina-a.com", password: "password123", slug: "marina-a", role: "staff" },
  { name: "Owner B", email: "owner@marina-b.com", password: "password123", slug: "marina-b", role: "owner" },
];

async function seed() {
  await mongoose.connect(MONGO_URI);

  const existing = await Marina.countDocuments();
  if (existing > 0) {
    console.log("Already seeded, skipping.");
    await mongoose.disconnect();
    return;
  }

  const marinaMap = {};
  for (const m of MARINAS) {
    const marina = await Marina.create({
      name: m.name,
      slug: m.slug,
      settings: { turnaroundBufferDays: 1, depositPercent: 20 },
    });
    marinaMap[m.slug] = marina;

    for (let i = 0; i < BOAT_TEMPLATES.length; i++) {
      const tmpl = BOAT_TEMPLATES[i];
      const boat = await Boat.create({
        marinaId: marina._id,
        name: `${tmpl.name} (${m.name.slice(-1)})`,
        type: tmpl.type,
        capacity: tmpl.capacity,
        pricePerDay: tmpl.pricePerDay,
        images: [`https://picsum.photos/seed/${m.slug}${i}/800/600`],
        description: `A beautiful ${tmpl.type.toLowerCase()} available at ${m.name}.`,
      });

      if (i === 0) {
        const maintStart = new Date();
        maintStart.setDate(maintStart.getDate() + 30);
        const maintEnd = new Date(maintStart);
        maintEnd.setDate(maintEnd.getDate() + 2);
        await AvailabilityBlock.create({
          boatId: boat._id,
          startDate: maintStart,
          endDate: maintEnd,
          type: "maintenance",
          notes: "Annual service",
        });
      }
    }
  }

  for (const u of DEV_USERS) {
    const marina = marinaMap[u.slug];
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({
      name: u.name,
      email: u.email,
      password: hashed,
      role: u.role,
      marinaId: marina._id,
    });
  }

  const marinaA = marinaMap["marina-a"];
  const boatA = await Boat.findOne({ marinaId: marinaA._id });
  const customer = await Customer.create({
    marinaId: marinaA._id,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-0100",
    insuranceInfo: { provider: "BoatSafe", policy: "BS-12345" },
  });

  const resStart = new Date();
  resStart.setDate(resStart.getDate() + 7);
  const resEnd = new Date(resStart);
  resEnd.setDate(resEnd.getDate() + 2);

  await Reservation.create({
    marinaId: marinaA._id,
    boatId: boatA._id,
    customerId: customer._id,
    startDate: resStart,
    endDate: resEnd,
    status: "confirmed",
    totalAmount: 897,
  });

  console.log("Seeded 4 marinas, boats, users, and sample reservation.");
  console.log("Login: owner@marina-a.com / password123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err.message || err);
  if (err.name === "MongooseServerSelectionError") {
    console.error("\nMongoDB is not running. Start it with:");
    console.error("  sudo systemctl start mongod        # Linux");
    console.error("  brew services start mongodb-community   # macOS");
  }
  process.exit(1);
});

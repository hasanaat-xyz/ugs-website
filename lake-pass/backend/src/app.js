import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth-routes.js";
import boatRoutes from "./routes/boat-routes.js";
import availabilityRoutes from "./routes/availability-routes.js";
import reservationRoutes from "./routes/reservation-routes.js";
import customerRoutes from "./routes/customer-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import userRoutes from "./routes/user-routes.js";
import publicRoutes from "./routes/public-routes.js";
import dashboardRoutes from "./routes/dashboard-routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const origins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  process.env.CONSUMER_URL || "http://localhost:5174",
  process.env.WIDGET_URL || "http://localhost:5175",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(cors({ origin: origins, credentials: true }));
app.use(cookieParser());
app.use("/api/v1/payments/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const API = "/api/v1";
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/boats`, boatRoutes);
app.use(`${API}`, availabilityRoutes);
app.use(`${API}/reservations`, reservationRoutes);
app.use(`${API}/customers`, customerRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/public`, publicRoutes);
app.use(`${API}/dashboard`, dashboardRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "lake-pass-api" }));

export default app;

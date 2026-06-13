import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();

import mongoose from "mongoose";
import app from "./src/app.js";

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lakepass";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Lake Pass API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "Make sure MongoDB is installed and running locally, then check MONGO_URI in .env"
    );
    console.error("Default: mongodb://localhost:27017/lakepass");
    process.exit(1);
  });

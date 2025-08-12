require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const scratchCardRoutes = require("./api/scratchCards");

const app = express();

// ----------------------
// CORS SETTINGS
// ----------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://anvaya-dm8j.onrender.com", // Frontend origin
  optionsSuccessStatus: 200
}));

// ----------------------
// PARSE JSON REQUESTS
// ----------------------
app.use(express.json());

// ----------------------
// SERVE UPLOADED FILES
// ----------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------
// CHECK REQUIRED ENV VARS
// ----------------------
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
console.log("✅ Mongo URI found");

// ----------------------
// CONNECT TO MONGODB
// ----------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("⚡ MongoDB connected successfully"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// ----------------------
// HEALTHCHECK ENDPOINT
// ----------------------
app.get("/", (req, res) => {
  res.send("✅ Backend server is running");
});

// ----------------------
// API ROUTES
// ----------------------
app.use("/api/scratchCards", scratchCardRoutes);

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

module.exports = app;

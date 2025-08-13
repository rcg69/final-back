require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Middleware for authentication (protects POST & DELETE internally in scratchCards.js)
const scratchCardRoutes = require("./api/scratchCards");

const app = express();

// ----------------------
// Log running directory (debugging for ENOENT issues)
// ----------------------
console.log("📍 Backend running from:", __dirname);

// ----------------------
// Ensure uploads dir exists
// ----------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created uploads directory at", uploadDir);
} else {
  console.log("📂 Uploads directory exists:", uploadDir);
}

// ----------------------
// Enable CORS
// ----------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://anvaya-dm8j.onrender.com",
    optionsSuccessStatus: 200,
  })
);

// ----------------------
// Middleware to parse JSON (for application/json payloads)
// ----------------------
app.use(express.json());

// ----------------------
// Serve uploaded files statically
// ----------------------
app.use("/uploads", express.static(uploadDir));

// ----------------------
// Validate environment variables
// ----------------------
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
console.log("✅ MONGO_URI found");

// ----------------------
// Connect to MongoDB
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("⚡ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ----------------------
// Healthcheck endpoint
// ----------------------
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "✅ Backend server is running" });
});

// ----------------------
// API routes
// ----------------------
// scratchCardRoutes already contains authRequired for POST & DELETE internally
app.use("/api/scratchCards", scratchCardRoutes);

// ----------------------
// 404 handler
// ----------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ----------------------
// Global error handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

module.exports = app;

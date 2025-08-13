require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { ClerkExpressWithAuth } = require('@clerk/express');

const scratchCardRoutes = require("./api/scratchCards");

const app = express();

// Debug working directory
console.log("📍 Backend running from:", __dirname);

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created uploads directory at", uploadDir);
}

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://anvaya-dm8j.onrender.com",
  optionsSuccessStatus: 200,
}));

// JSON parser
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// Clerk auth init
app.use(ClerkExpressWithAuth({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}));

// Validate required env var
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined.");
  process.exit(1);
}
console.log("✅ MONGO_URI found");

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("⚡ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Healthcheck
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "✅ Backend server is running" });
});

// Routes
app.use("/api/scratchCards", scratchCardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

module.exports = app;

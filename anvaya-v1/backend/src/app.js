require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const scratchCardRoutes = require("./api/scratchCards");

const app = express();

// ----------------------
// Ensure uploads dir exists
// ----------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 Created uploads directory");
}

// ----------------------
// Enable CORS with frontend URL from env
// ----------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://anvaya-dm8j.onrender.com",
  optionsSuccessStatus: 200,
}));

// ----------------------
// Middleware to parse JSON requests
// ----------------------
app.use(express.json());

// ----------------------
// Serve uploaded files statically to frontend
// ----------------------
app.use("/uploads", express.static(uploadDir));

// ----------------------
// Validate environment variable
// ----------------------
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
console.log("✅ Mongo URI found");

// ----------------------
// Connect to MongoDB
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
// Simple healthcheck endpoint
// ----------------------
app.get("/", (req, res) => {
  res.send("✅ Backend server is running");
});

// ----------------------
// Mount API routes
// ----------------------
app.use("/api/scratchCards", scratchCardRoutes);

// ----------------------
// Start server on specified port
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

module.exports = app;

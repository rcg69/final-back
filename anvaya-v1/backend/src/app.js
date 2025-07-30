require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scratchCardRoutes = require("./routes/scratchCardRoutes");

const app = express();

// Enable CORS - use FRONTEND_URL env variable for flexibility
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://final-back-fiov.onrender.com",  // Replace * with actual frontend URL in production
  optionsSuccessStatus: 200
}));

// Middleware to parse JSON
app.use(express.json());

// Check and log Mongo URI for debugging
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
console.log("Mongo URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("⚡ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Healthcheck route
app.get("/", (req, res) => res.send("Backend server is running"));

// API routes
app.use("/api/scratchCards", scratchCardRoutes);

// Start server: listen on 0.0.0.0 and the port specified by hosting platform
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ Server running on port ${PORT}`);
});

module.exports = app;

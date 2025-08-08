require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scratchCardRoutes = require("./api/scratchCards");

const app = express();

// Enable CORS - use FRONTEND_URL env variable for flexibility
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://anvaya-dm8j.onrender.com", // Use your frontend deployed URL here
  optionsSuccessStatus: 200
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Validate required environment variable
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
console.log("Mongo URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("⚡ MongoDB connected"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Healthcheck endpoint
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Mount API routes at /api/scratchCards
app.use("/api/scratchCards", scratchCardRoutes);

// Start server: listen on provided PORT and all network interfaces (0.0.0.0)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ Server running on port ${PORT}`);
});

module.exports = app;

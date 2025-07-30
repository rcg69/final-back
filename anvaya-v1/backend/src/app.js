require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scratchCardRoutes = require("./routes/scratchCardRoutes");

const app = express();

// Enable CORS - allow your frontend URL explicitly for better security in production
// Replace 'https://your-frontend-url.com' with your actual frontend deployment URL
app.use(cors({
  origin: "https://your-frontend-url.com", 
  optionsSuccessStatus: 200
}));

// Parse incoming JSON requests
app.use(express.json());

// Check and log Mongo URI for debugging
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file.");
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
    process.exit(1); // Exit if unable to connect to DB
  });

// Healthcheck route
app.get("/", (req, res) => res.send("Backend server is running"));

// API routes
app.use("/api/scratchCards", scratchCardRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));

module.exports = app; // Export for testing, if needed

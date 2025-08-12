const mongoose = require("mongoose");

const scratchCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String, // Optional text description
  descriptionImageUrl: String, // Optional image description URL
  imageUrl: String,
  price: String,
  expiryDate: { type: Date, required: true, index: { expires: 0 } }, // TTL auto-delete
  posterEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScratchCard", scratchCardSchema);

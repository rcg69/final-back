// backend/models/userListModel.js

const mongoose = require('mongoose');

// Schema for individual card in user list
const cardSchema = new mongoose.Schema({
  cardId: { type: String, required: true },   // Reference to Scratch Card ID
  title: { type: String, required: true },    // Card title (snapshot)
  // Add more fields if you want to store more info per card
});

// Schema for user's list of cards
const userListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Clerk user ID as string
  cards: [cardSchema],                                     // Array of saved cards
  updatedAt: { type: Date, default: Date.now },           // Timestamp of last update
});

// Middleware to update `updatedAt` on save
userListSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserList', userListSchema);

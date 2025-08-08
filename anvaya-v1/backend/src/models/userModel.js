// backend/models/userModel.js

const mongoose = require('mongoose');  // Import mongoose for MongoDB schema definition

// Define the User schema structure
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },  // Clerk user ID, unique identifier for each user
  username: { type: String, trim: true },                   // Optional username, trimmed of whitespace
  email: { type: String, trim: true },                      // Optional email address, trimmed of whitespace
  createdAt: { type: Date, default: Date.now },             // Timestamp of user creation, defaults to now
});

// Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);

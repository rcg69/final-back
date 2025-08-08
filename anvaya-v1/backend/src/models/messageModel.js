// backend/models/messageModel.js

const mongoose = require('mongoose'); // Import mongoose for schema definition

// Define the Message schema for chat messages
const messageSchema = new mongoose.Schema({
  sender: { 
    type: String,             // Clerk user ID of sender (string)
    required: true 
  },
  receiver: { 
    type: String,             // Clerk user ID of receiver (string)
    required: true 
  },
  content: { 
    type: String              // Optional text content of the message
  },
  imageBase64: { 
    type: String              // Optional base64-encoded image data as string
  },
  deleted: { 
    type: Boolean,            // Whether the message is deleted (soft delete)
    default: false 
  },
  timestamp: { 
    type: Date,               // Time the message was sent
    default: Date.now 
  },
  read: { 
    type: Boolean,            // Whether the message has been read
    default: false 
  }
});

// Export the Message model based on the schema
module.exports = mongoose.model('Message', messageSchema);

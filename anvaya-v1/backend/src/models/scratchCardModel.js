// backend/models/scratchCardModel.js

const mongoose = require("mongoose");  // Import mongoose for schema definition

const scratchCardSchema = new mongoose.Schema({
  title: { 
    type: String,           // Title of the scratch card
    required: true          // Title is a required field
  },
  description: String,      // Optional description of the scratch card
  imageUrl: String,         // Optional image URL associated with the card
  price: String,            // Optional price string for the card
  expiryDate: { 
    type: Date,             // Date when the card expires
    required: true,         // Expiry date is required
    index: { expires: 0 }   // TTL index for automatic document expiry at this date
  },
  posterId: {               // Clerk user ID of the poster (string)
    type: String,
    required: true
  },
  posterEmail: { 
    type: String,           // Email of the user who posted the card - for reference only
    required: true           
  },
  createdAt: { 
    type: Date,             // Timestamp of creation of the document
    default: Date.now       // Defaults to current date/time if not provided
  }
});

// Export the ScratchCard model based on this schema
module.exports = mongoose.model("ScratchCard", scratchCardSchema);

const express = require('express');
const router = express.Router();
const ScratchCard = require('../models/scratchCardModel');

// GET /api/scratchCards
// Fetch all non-expired scratch cards, newest first
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const cards = await ScratchCard.find({ expiryDate: { $gt: now } }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching scratch cards:', error);
    res.status(500).json({ error: 'Failed to fetch scratch cards' });
  }
});

// POST /api/scratchCards
// Create a new scratch card with required expiryDate and posterEmail
router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl, price, expiryDate, posterEmail } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!expiryDate) {
      return res.status(400).json({ error: 'expiryDate is required' });
    }
    if (!posterEmail) {
      return res.status(400).json({ error: 'posterEmail is required' });
    }

    // Validate expiryDate is a valid future date
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      return res.status(400).json({ error: 'expiryDate is not a valid date' });
    }
    if (expiry <= new Date()) {
      return res.status(400).json({ error: 'expiryDate must be a future date' });
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(posterEmail)) {
      return res.status(400).json({ error: 'Invalid email format for posterEmail' });
    }

    const newCard = new ScratchCard({
      title,
      description,
      imageUrl,
      price,
      expiryDate: expiry,
      posterEmail,
    });

    await newCard.save();

    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating scratch card:', error);
    res.status(500).json({ error: 'Failed to create scratch card' });
  }
});

// DELETE /api/scratchCards/:id
// Delete a scratch card only if the requesting posterEmail matches the card's posterEmail
router.delete('/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const { posterEmail } = req.body; // posterEmail required to authorize delete

    if (!posterEmail) {
      return res.status(400).json({ error: 'posterEmail is required to delete scratch card' });
    }

    const card = await ScratchCard.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Scratch card not found' });
    }

    if (card.posterEmail !== posterEmail) {
      return res.status(403).json({ error: 'Not authorized to delete this scratch card' });
    }

    await ScratchCard.findByIdAndDelete(cardId);

    res.json({ message: 'Scratch card deleted successfully.' });
  } catch (error) {
    console.error('Error deleting scratch card:', error);
    res.status(500).json({ error: 'Failed to delete scratch card' });
  }
});

// GET /api/scratchCards/search?query=...
// Search scratch cards by title or description matching query (case-insensitive), excluding expired cards
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const regex = new RegExp(query.trim(), 'i'); // case-insensitive regex

    const now = new Date();
    const cards = await ScratchCard.find({
      expiryDate: { $gt: now },
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).sort({ createdAt: -1 });

    res.json(cards);
  } catch (err) {
    console.error("Error during scratch card search:", err);
    res.status(500).json({ error: "Failed to search scratch cards" });
  }
});

module.exports = router;

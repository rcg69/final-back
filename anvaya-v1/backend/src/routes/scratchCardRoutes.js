// routes/scratchCardRoutes.js

const express = require('express');
const router = express.Router();
const ScratchCard = require('../models/scratchCardModel');

// GET /api/scratchCards - fetch all non-expired cards sorted newest first
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const cards = await ScratchCard.find({ expiryDate: { $gt: now } }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error('Error fetching scratch cards:', err);
    res.status(500).json({ error: 'Failed to fetch scratch cards' });
  }
});

// POST /api/scratchCards - create new card with expiryDate and posterEmail validation
router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl, price, expiryDate, posterEmail } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!expiryDate) return res.status(400).json({ error: 'expiryDate is required' });
    if (!posterEmail) return res.status(400).json({ error: 'posterEmail is required' });

    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) return res.status(400).json({ error: 'expiryDate is not a valid date' });
    if (expiry <= new Date()) return res.status(400).json({ error: 'expiryDate must be a future date' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(posterEmail)) return res.status(400).json({ error: 'Invalid email format' });

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

  } catch (err) {
    console.error('Error creating scratch card:', err);
    res.status(500).json({ error: 'Failed to create scratch card' });
  }
});

// DELETE /api/scratchCards/:id - delete only if posterEmail matches
router.delete('/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const { posterEmail } = req.body;

    if (!posterEmail) return res.status(400).json({ error: 'posterEmail is required to delete card' });

    const card = await ScratchCard.findById(cardId);
    if (!card) return res.status(404).json({ error: 'Scratch card not found' });

    if (card.posterEmail !== posterEmail)
      return res.status(403).json({ error: 'Not authorized to delete this card' });

    await ScratchCard.findByIdAndDelete(cardId);
    res.json({ message: 'Scratch card deleted successfully.' });

  } catch (err) {
    console.error('Error deleting scratch card:', err);
    res.status(500).json({ error: 'Failed to delete scratch card' });
  }
});
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter missing" });
    }

    const regex = new RegExp(query, 'i'); // Case-insensitive search

    // Return cards matching title or description, and not expired
    const now = new Date();
    const results = await ScratchCard.find({
      expiryDate: { $gt: now },
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search scratch cards' });
  }
});

module.exports = router;

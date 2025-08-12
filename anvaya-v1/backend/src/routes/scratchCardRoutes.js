const express = require('express');
const multer = require('multer');
const path = require('path');
const ScratchCard = require('../models/scratchCardModel');

const router = express.Router();

// File upload settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // store in /uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
});

// GET all non-expired scratch cards
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

// POST create scratch card (text or image-based description)
router.post('/', upload.single('descriptionImage'), async (req, res) => {
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

    let descriptionImageUrl = null;
    if (req.file) {
      descriptionImageUrl = `/uploads/${req.file.filename}`; // store relative path
    }

    const newCard = new ScratchCard({
      title,
      description: req.file ? null : description, // null if using image
      descriptionImageUrl,
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

// DELETE scratch card
router.delete('/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const { posterEmail } = req.body;

    if (!posterEmail) return res.status(400).json({ error: 'posterEmail is required' });

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

// Search scratch cards
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const regex = new RegExp(query.trim(), 'i');
    const now = new Date();
    const results = await ScratchCard.find({
      expiryDate: { $gt: now },
      $or: [
        { title: regex },
        { description: regex } // will skip if description is null
      ]
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("Error during scratch card search:", err);
    res.status(500).json({ error: "Failed to search scratch cards" });
  }
});

module.exports = router;

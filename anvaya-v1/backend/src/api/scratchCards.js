const express = require('express');
const multer = require('multer');
const path = require('path');
const ScratchCard = require('../models/scratchCardModel');

const router = express.Router();

// ----------------------
// Multer storage config for uploads (absolute path & safe filenames)
// ----------------------
const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Absolute path
  },
  filename: (req, file, cb) => {
    // Replace spaces with underscores and prepend timestamp
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
});

// ----------------------
// GET all non-expired scratch cards
// ----------------------
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

// ----------------------
// POST create scratch card (supports text or image description)
// ----------------------
router.post('/', upload.single('descriptionImage'), async (req, res) => {
  try {
    // Multer populates req.body for text fields in multipart/form-data
    const { title, description, imageUrl, price, expiryDate, posterEmail } = req.body;

    // Validations
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!expiryDate) return res.status(400).json({ error: 'expiryDate is required' });
    if (!posterEmail) return res.status(400).json({ error: 'posterEmail is required' });

    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) return res.status(400).json({ error: 'expiryDate is not a valid date' });
    if (expiry <= new Date()) return res.status(400).json({ error: 'expiryDate must be a future date' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(posterEmail)) return res.status(400).json({ error: 'Invalid email format' });

    // Handle uploaded image (if any)
    let descriptionImageUrl = null;
    if (req.file) {
      descriptionImageUrl = `/uploads/${req.file.filename}`;
    }

    const newCard = new ScratchCard({
      title,
      description: req.file ? null : description,
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

// ----------------------
// DELETE endpoint (authorized by posterEmail)
// ----------------------
router.delete('/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const { posterEmail } = req.body;

    if (!posterEmail) return res.status(400).json({ error: 'posterEmail is required' });

    const card = await ScratchCard.findById(cardId);
    if (!card) return res.status(404).json({ error: 'Scratch card not found' });

    if (card.posterEmail !== posterEmail) {
      return res.status(403).json({ error: 'Not authorized to delete this card' });
    }

    await ScratchCard.findByIdAndDelete(cardId);
    res.json({ message: 'Scratch card deleted successfully.' });
  } catch (err) {
    console.error('Error deleting scratch card:', err);
    res.status(500).json({ error: 'Failed to delete scratch card' });
  }
});

// ----------------------
// SEARCH cards by title or description text
// ----------------------
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const regex = new RegExp(query.trim(), 'i');
    const now = new Date();
    const cards = await ScratchCard.find({
      expiryDate: { $gt: now },
      $or: [
        { title: regex },
        { description: regex },
      ],
    }).sort({ createdAt: -1 });

    res.json(cards);
  } catch (err) {
    console.error('Error searching scratch cards:', err);
    res.status(500).json({ error: 'Failed to search scratch cards' });
  }
});

module.exports = router;

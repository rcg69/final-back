const express = require('express');
const multer = require('multer');
const path = require('path');
const ScratchCard = require('../models/scratchCardModel');
const authRequired = require('../middleware/authRequired'); // Clerk middleware

const router = express.Router();

// Multer storage for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

// ✅ GET (Public) – fetch all active scratch cards
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

// ✅ POST (Protected) – create a scratch card
router.post('/', authRequired, upload.single('descriptionImage'), async (req, res) => {
  try {
    const { title, description, imageUrl, price, expiryDate } = req.body;
    const posterEmail = req.auth.userId; // Clerk userId as poster reference

    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!expiryDate) return res.status(400).json({ error: 'expiryDate is required' });

    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime()) || expiry <= new Date()) {
      return res.status(400).json({ error: 'expiryDate must be a valid future date' });
    }

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
      posterEmail, // Clerk userId stored instead of email string
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    console.error('Error creating scratch card:', err);
    res.status(500).json({ error: 'Failed to create scratch card' });
  }
});

// ✅ DELETE (Protected) – delete a scratch card
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const card = await ScratchCard.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Scratch card not found' });

    // Only owner (by stored userId) can delete
    if (card.posterEmail !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this card' });
    }

    await card.deleteOne();
    res.json({ message: 'Scratch card deleted successfully.' });
  } catch (err) {
    console.error('Error deleting scratch card:', err);
    res.status(500).json({ error: 'Failed to delete scratch card' });
  }
});

// ✅ Search (Public)
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
      $or: [{ title: regex }, { description: regex }]
    }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error('Error searching scratch cards:', err);
    res.status(500).json({ error: 'Failed to search scratch cards' });
  }
});

module.exports = router;

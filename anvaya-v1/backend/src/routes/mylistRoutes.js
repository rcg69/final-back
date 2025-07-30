const express = require('express');
const router = express.Router();
const UserList = require('../models/userListModel'); // import your UserList model
const authRequired = require('../middleware/authRequired'); // middleware that ensures user is logged in

// GET user's My List
router.get('/mylist', authRequired, async (req, res) => {
  const userId = req.user._id;
  try {
    const list = await UserList.findOne({ userId });
    res.json(list ? list.cards : []);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching list" });
  }
});

// POST (create/update) user's My List
router.post('/mylist', authRequired, async (req, res) => {
  const userId = req.user._id;
  const cards = req.body.cards;
  try {
    let list = await UserList.findOne({ userId });
    if (list) {
      list.cards = cards;
      await list.save();
    } else {
      list = await UserList.create({ userId, cards });
    }
    res.json(list.cards);
  } catch (err) {
    res.status(500).json({ message: "Server error saving list" });
  }
});

module.exports = router;

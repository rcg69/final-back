// backend/routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");

// POST send new message (text or base64 image)
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, content, imageBase64 } = req.body;

    // Message must have content or base64 image
    if ((!content || content.trim() === "") && !imageBase64) {
      return res.status(400).json({ error: "Message must have content or imageBase64" });
    }

    // Create and save the message
    const message = new Message({
      sender,
      receiver,
      content: content ? content.trim() : "",
      imageBase64: imageBase64 || null,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET chat messages between two users
router.get("/:otherUserId/:userId", async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
      deleted: false,
    }).sort({ timestamp: 1 }); // ascending order
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// DELETE message (soft delete)
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { deleted: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true, message });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;

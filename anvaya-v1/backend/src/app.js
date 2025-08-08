// backend/app.js

require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const scratchCardRoutes = require("./api/scratchCards");
const messageRoutes = require("./routes/messageRoutes"); // Add message routes
const UserListRoutes = require("./routes/userListRoutes"); // Add userList routes (if created)
const Message = require("./models/messageModel"); // import Message model

const app = express();

// Enable CORS - using FRONTEND_URL env variable, fallback to your deployed frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://anvaya-dm8j.onrender.com",
    optionsSuccessStatus: 200,
  })
);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If ever you enable image uploads:
// const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
console.log("MongoDB connected at: ", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("⚡ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Health-check endpoint
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Mount all API routes
app.use("/api/scratchCards", scratchCardRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", UserListRoutes); // For user list related routes

// Create HTTP server and setup Socket.IO with CORS config matching Express
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://final-back-fiov.com",
    methods: ["GET", "POST"],
  },
});

// Map of currently online users: userId -> socketId
const onlineUsers = {};

// Socket.IO connection handlers
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
  });

  socket.on("send-message", async ({ sender, receiver, content }) => {
    try {
      // Save the message in the DB with current timestamp
      const message = new Message({
        sender,
        receiver,
        content,
        timestamp: new Date(),
      });
      await message.save();

      // Send the message to the receiver if online
      const receiverSocketId = onlineUsers[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", message);
      }

      // Also confirm to sender that the message was sent and saved
      const senderSocketId = onlineUsers[sender];
      if (senderSocketId) {
        io.to(senderSocketId).emit("message-sent", message);
      }
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error-message", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    // Remove from onlineUsers map on disconnect
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socket.id === socketId) {
        delete onlineUsers[userId];
        console.log(`User ${userId} disconnected (socket ${socket.id})`);
        break;
      }
    }
  });
});

// Start server on configured PORT (or default 5000), binding to all interfaces
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ Server running on port ${PORT}`);
});

module.exports = { app, server };

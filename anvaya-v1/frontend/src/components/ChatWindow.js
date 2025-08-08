// frontend/src/components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_SERVER_URL = "https://your-backend-url.com"; // Replace with your backend URL

// Create a single socket instance for this component
const socket = io(SOCKET_SERVER_URL);

export default function ChatWindow({ currentUserId, chatWithId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join socket room for current user
    socket.emit("join", currentUserId);

    // Fetch existing chat messages between users
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${SOCKET_SERVER_URL}/api/messages/${chatWithId}/${currentUserId}`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Fetching messages failed", error);
      }
    };
    fetchMessages();

    // Listen for incoming real-time messages relevant to this chat
    socket.on("receive-message", (message) => {
      if (
        (message.sender === chatWithId && message.receiver === currentUserId) ||
        (message.sender === currentUserId && message.receiver === chatWithId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for message deletion events and mark messages deleted in UI
    socket.on("message-deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deleted: true } : msg
        )
      );
    });

    // Cleanup socket listeners on unmount or when deps change
    return () => {
      socket.off("receive-message");
      socket.off("message-deleted");
    };
  }, [chatWithId, currentUserId]);

  // Scroll the chat view smoothly to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a chat message: can include text and/or image file
  const sendMessage = async () => {
    if (!input.trim() && !imageFile) return; // Nothing to send

    try {
      let res;
      if (imageFile) {
        // Prepare image upload as multipart form data
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("sender", currentUserId);
        formData.append("receiver", chatWithId);
        formData.append("content", input);

        // Send image + message to backend
        res = await axios.post(`${SOCKET_SERVER_URL}/api/messages`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Emit real-time message with backend saved message data
        socket.emit("send-message", res.data);
        setMessages((prev) => [...prev, res.data]);
      } else {
        // Send text-only message
        const msgObj = {
          sender: currentUserId,
          receiver: chatWithId,
          content: input.trim(),
        };

        res = await axios.post(`${SOCKET_SERVER_URL}/api/messages`, msgObj);
        socket.emit("send-message", res.data);
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setInput("");
      setImageFile(null);
    }
  };

  // Delete a message by ID, update UI and notify backend & socket
  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${SOCKET_SERVER_URL}/api/messages/${messageId}`);

      // Notify receiver and sender using socket
      socket.emit("delete-message", {
        messageId,
        sender: currentUserId,
        receiver: chatWithId,
      });

      // Optimistically update UI to mark message as deleted
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, deleted: true } : msg))
      );
    } catch (error) {
      console.error("Delete message failed", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: "350px",
        maxHeight: "70vh",
        backgroundColor: "#232323",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(187,134,252,0.8)",
        display: "flex",
        flexDirection: "column",
        color: "#eee",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #444",
          fontWeight: "bold",
          fontSize: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        Chat with {chatWithId}
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#bb86fc",
            cursor: "pointer",
            fontSize: "18px",
          }}
          aria-label="Close chat"
          title="Close chat"
        >
          ×
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          fontSize: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.length === 0 && <em>No messages yet</em>}

        {messages.map((msg) => {
          const isSender = msg.sender === currentUserId;
          if (msg.deleted) {
            return (
              <div
                key={msg._id}
                style={{
                  alignSelf: isSender ? "flex-end" : "flex-start",
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                Message deleted
              </div>
            );
          }
          return (
            <div
              key={msg._id}
              style={{
                alignSelf: isSender ? "flex-end" : "flex-start",
                backgroundColor: isSender ? "#bb86fc" : "#444",
                borderRadius: "12px",
                padding: "8px 12px",
                maxWidth: "80%",
                wordBreak: "break-word",
                position: "relative",
              }}
            >
              {msg.content && <div>{msg.content}</div>}
              {msg.imageUrl && (
                <img
                  src={`${SOCKET_SERVER_URL}${msg.imageUrl}`}
                  alt="sent"
                  style={{ maxWidth: "200px", marginTop: "6px", borderRadius: "8px" }}
                />
              )}
              <div
                style={{
                  fontSize: "10px",
                  color: "#ccc",
                  textAlign: isSender ? "right" : "left",
                  marginTop: "4px",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {isSender && (
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "4px",
                    background: "transparent",
                    border: "none",
                    color: "#eee",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  title="Delete message"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #444",
          padding: "8px",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
            fontSize: "14px",
            backgroundColor: "#121212",
            color: "#eee",
          }}
        />
        <label
          htmlFor="image-upload"
          style={{
            cursor: "pointer",
            color: "#bb86fc",
            fontWeight: "bold",
            userSelect: "none",
          }}
          title="Upload image"
        >
          📷
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files[0]) setImageFile(e.target.files[0]);
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#bb86fc",
            border: "none",
            borderRadius: "20px",
            padding: "6px 14px",
            cursor: "pointer",
            color: "#121212",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

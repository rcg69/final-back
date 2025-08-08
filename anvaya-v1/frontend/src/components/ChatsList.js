import React, { useEffect, useState } from "react";
import axios from "axios";

const SOCKET_SERVER_URL = "https://your-backend-url.com";

export default function ChatsList({ currentUserId, onSelectChat }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Fetch all chats this user participates in
    async function fetchChats() {
      try {
        const res = await axios.get(`${SOCKET_SERVER_URL}/api/messages/logs/${currentUserId}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching chats", err);
      }
    }
    fetchChats();
  }, [currentUserId]);

  if (conversations.length === 0) {
    return <p>No active chats</p>;
  }

  return (
    <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
      {conversations.map(({ _id, lastMessage }) => (
        <div
          key={_id}
          onClick={() => onSelectChat(_id)}
          style={{
            padding: "10px",
            borderBottom: "1px solid #444",
            cursor: "pointer",
            backgroundColor: "#232323",
            color: "#eee",
          }}
        >
          <strong>User ID: {_id}</strong>
          <div style={{ fontSize: "14px", color: "#ccc" }}>
            {lastMessage.deleted ? "Message deleted" : lastMessage.content || "Image message"}
          </div>
          <div style={{ fontSize: "10px", textAlign: "right" }}>
            {new Date(lastMessage.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

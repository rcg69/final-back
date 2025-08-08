// src/components/Home.js

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://final-backend-srja.onrender.com";

// Inline ChatWindow Component
function ChatWindow({ currentUserId, chatWithId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${SOCKET_SERVER_URL}/api/messages/${chatWithId}/${currentUserId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchMessages();

    socketRef.current = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current.emit("join", currentUserId);

    socketRef.current.on("receive-message", (message) => {
      if (
        (message.sender === chatWithId && message.receiver === currentUserId) ||
        (message.sender === currentUserId && message.receiver === chatWithId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatWithId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msgObj = {
      sender: currentUserId,
      receiver: chatWithId,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Save message to backend
    fetch(`${SOCKET_SERVER_URL}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgObj),
    }).catch(console.error);

    // Emit socket message
    socketRef.current.emit("send-message", msgObj);

    setMessages((prev) => [...prev, msgObj]);
    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 320,
        maxHeight: "60vh",
        backgroundColor: "#232323",
        borderRadius: 12,
        boxShadow: "0 0 10px rgba(187,134,252,0.8)",
        display: "flex",
        flexDirection: "column",
        color: "#eeeeee",
        zIndex: 1000,
      }}
      role="dialog"
      aria-modal="true"
      aria-live="polite"
    >
      <div
        style={{
          padding: 12,
          borderBottom: "1px solid #444",
          fontWeight: "bold",
          fontSize: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        Chat with {chatWithId}
        <button
          onClick={onClose}
          aria-label="Close chat"
          title="Close chat"
          style={{
            background: "transparent",
            border: "none",
            color: "#bb86fc",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.length === 0 && <em>No messages yet</em>}
        {messages.map((msg, i) => {
          const isSender = msg.sender === currentUserId;
          return (
            <div
              key={i}
              style={{
                alignSelf: isSender ? "flex-end" : "flex-start",
                backgroundColor: isSender ? "#bb86fc" : "#444",
                borderRadius: 12,
                padding: "6px 12px",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
              <div
                style={{
                  fontSize: 10,
                  color: "#ccc",
                  textAlign: isSender ? "right" : "left",
                  marginTop: 4,
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #444",
          padding: 8,
          gap: 8,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 20,
            border: "none",
            outline: "none",
            fontSize: 14,
            backgroundColor: "#121212",
            color: "#eee",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          aria-label="Type a message"
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#bb86fc",
            border: "none",
            borderRadius: 20,
            padding: "6px 12px",
            cursor: "pointer",
            color: "#121212",
            fontWeight: "bold",
          }}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function Home() {
  const { user, isLoaded } = useUser();
  const [scratchCards, setScratchCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);

  // Call hooks before returns
  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`${SOCKET_SERVER_URL}/api/scratchCards`);
        if (!res.ok) throw new Error("Failed to fetch scratch cards.");
        const data = await res.json();
        setScratchCards(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  // Early return for loading Clerk user
  if (!isLoaded) return <div>Loading...</div>;

  const currentUserId = user ? user.id : null;

  const openChat = (userId) => setSelectedChatUserId(userId);
  const closeChat = () => setSelectedChatUserId(null);

  // Responsive 2 column layout on phones
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @media (max-width: 600px) {
        .scratch-cards-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 12px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const scratchCardsWrapperStyle = {
    width: "100%",
    maxWidth: "100vw",
    padding: "0 16px",
    boxSizing: "border-box",
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <div className="app-outer-wrapper">
      <main
        className="home-main"
        tabIndex={-1}
        style={{ padding: 0, maxWidth: "100vw", boxSizing: "border-box" }}
      >
        {/* Optional Banner/slider */}

        <h2 className="main-heading" style={{ paddingLeft: 16 }}>
          All Scratch Cards
        </h2>

        {error && (
          <div role="alert" style={{ color: "tomato", textAlign: "center" }}>
            {error}
          </div>
        )}
        {loading && (
          <div style={{ fontStyle: "italic", textAlign: "center" }}>
            Loading scratch cards...
          </div>
        )}

        {!loading && !error && (
          <section
            aria-label="List of available scratch cards"
            className="scratch-cards-wrapper"
            style={scratchCardsWrapperStyle}
          >
            {scratchCards.length === 0 ? (
              <p style={{ textAlign: "center" }}>No cards available.</p>
            ) : (
              <div
                className="scratch-cards-grid"
                style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
              >
                {scratchCards.map((card) => (
                  <article
                    key={card._id}
                    tabIndex={0}
                    aria-label={`Scratch card: ${card.title}`}
                    className="scratch-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: "#232323",
                      color: "#eeeeee",
                      boxShadow: "0 4px 14px rgba(187,134,252,0.25)",
                      maxWidth: 280,
                      userSelect: "none",
                    }}
                  >
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        style={{
                          width: "100%",
                          height: 160,
                          borderRadius: 10,
                          objectFit: "cover",
                          marginBottom: 10,
                          boxShadow: "0 0 10px rgba(187, 134, 252, 0.3)",
                          userSelect: "none",
                        }}
                        loading="lazy"
                      />
                    )}
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#bb86fc",
                        margin: 0,
                        wordWrap: "break-word",
                        userSelect: "text",
                      }}
                    >
                      {card.title}
                    </h3>
                    {card.description && (
                      <p
                        style={{
                          fontSize: 16,
                          color: "#bbbbbb",
                          margin: 0,
                          flexGrow: 1,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          userSelect: "text",
                        }}
                      >
                        {card.description}
                      </p>
                    )}
                    {card.price && (
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#bb86fc",
                          marginTop: 8,
                          userSelect: "text",
                        }}
                      >
                        Price: ₹{card.price}
                      </p>
                    )}
                    {card.posterEmail && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "#50beff",
                          marginTop: 4,
                          wordBreak: "break-word",
                          userSelect: "text",
                        }}
                      >
                        Posted by:{" "}
                        <a
                          href={`mailto:${card.posterEmail}`}
                          style={{ color: "#50beff", textDecoration: "underline" }}
                        >
                          {card.posterEmail}
                        </a>
                      </p>
                    )}
                    {card.expiryDate && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "#bbbbbb",
                          marginTop: 4,
                          userSelect: "text",
                        }}
                      >
                        Expires on: {new Date(card.expiryDate).toLocaleDateString()}
                      </p>
                    )}

                    <button
                      onClick={() => openChat(card.posterId)}
                      style={{
                        marginTop: 10,
                        padding: "8px 16px",
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#121212",
                        backgroundColor: "#bb86fc",
                        border: "none",
                        borderRadius: 12,
                        cursor: "pointer",
                      }}
                      aria-label={`Chat with poster of ${card.title}`}
                    >
                      Chat
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {selectedChatUserId && (
          <ChatWindow
            currentUserId={currentUserId}
            chatWithId={selectedChatUserId}
            onClose={closeChat}
          />
        )}
      </main>
    </div>
  );
}

export default Home;

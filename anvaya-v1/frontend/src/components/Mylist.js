// frontend/src/pages/Mylist.jsx

import React, { useState, useEffect } from "react";

// Banner images array
const bannerImages = [
  "https://palmonas.com/cdn/shop/files/daily_ware_c32bcc-4f4(...).jpg",
  "https://w0.peakpx.com/wallpaper/211/633/HD-wallpaper-starbucks-coffee.jpg",
  "https://pbs.twimg.com/media/DENKKAU.jpg:large",
  "https://www.trueblueadvisory.com/wp-content/uploads/case_study_ajio.jpg",
  "https://palmonas.com/lgd_mob_2_7.webp",
  "https://variety.com/wp-content/uploads/netflix-logo.png"
];

// Component to display image slideshow banners (simple sliding animation)
function BannerSlideshow({ images, direction = "left", initialIndex = 0, controlIndex, onIndexChange }) {
  const [index, setIndex] = React.useState(initialIndex);
  const timeoutRef = React.useRef();

  // Sync controlled index externally if provided
  React.useEffect(() => {
    if (typeof controlIndex === "number") {
      setIndex(controlIndex);
    }
  }, [controlIndex]);

  // Auto advance slide every 3 seconds if not controlled externally
  React.useEffect(() => {
    if (typeof controlIndex === "number") return;
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => {
        const next = (prev + 1) % images.length;
        onIndexChange && onIndexChange(next);
        return next;
      });
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, images.length, controlIndex, onIndexChange]);

  const slideStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    transition: "transform 1s cubic-bezier(.7,0,.3,1), opacity 0.85s",
    borderRadius: 18,
    boxShadow: "0 8px 32px 0 rgba(187,134,252,0.12)",
    objectFit: "cover",
    zIndex: 1,
    background: "#2a233a",
    userSelect: "none",
  };

  return (
    <div
      style={{
        position: "relative",
        width: 330,
        height: 630,
        overflow: "hidden",
        borderRadius: 18,
        background: "rgba(24, 24, 38, 0.96)",
        boxShadow: "0 0 32px 16px rgba(70,41,150,0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      aria-label="Image banner slideshow"
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`banner ${i + 1}`}
          draggable={false}
          style={{
            ...slideStyle,
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 2 : 1,
            transform:
              i === index
                ? "translateX(0)"
                : direction === "left"
                ? "translateX(-110%)"
                : "translateX(110%)",
          }}
        />
      ))}
      {/* Dots removed as requested */}
    </div>
  );
}

export default function Mylist() {
  const [cards, setCards] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [mainBannerIndex, setMainBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved cards from sessionStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const saved = sessionStorage.getItem("mylistCards");
      if (saved) {
        setCards(JSON.parse(saved));
      }
    } catch {
      // Ignore JSON parse errors
    }
    setLoading(false);
  }, []);

  // Save cards to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem("mylistCards", JSON.stringify(cards));
  }, [cards]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (cardNumber.trim() === "" || cardName.trim() === "") return;
    const newCard = {
      id: Date.now(),
      number: cardNumber.trim(),
      name: cardName.trim(),
    };
    setCards((prev) => [...prev, newCard]);
    setCardNumber("");
    setCardName("");
  };

  const handleRemove = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const homeBackground = "linear-gradient(135deg, #080808ff 100%)";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: homeBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: "40px 0",
      }}
      role="main"
      aria-label="My favorite cards list"
    >
      <div
        style={{
          display: "flex",
          gap: 46,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 1850,
          userSelect: "none",
        }}
      >
        {/* Left Banner */}
        <BannerSlideshow
          images={bannerImages}
          direction="left"
          initialIndex={mainBannerIndex}
          onIndexChange={setMainBannerIndex}
        />

        {/* Main My List panel */}
        <section
          style={{
            background: "linear-gradient(135deg, #080808ff 100%)",
            borderRadius: 18,
            padding: "32px 36px",
            maxWidth: 630,
            minWidth: 370,
            width: "100%",
            color: "#eeeeee",
            backdropFilter: "blur(12px)",
            boxSizing: "border-box",
            minHeight: 600,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              color: "#f1eef5ff",
              marginBottom: 24,
              fontWeight: "900",
              fontSize: "2rem",
              textAlign: "center",
              letterSpacing: 2,
              textShadow: "0 2px 8px #4a00e041",
              userSelect: "text",
            }}
          >
            My List
          </h2>

          {/* Input form to add favorite cards */}
          <form
            onSubmit={handleAdd}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 28,
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.6)",
              padding: 20,
              borderRadius: 14,
            }}
            aria-label="Add a card to your list"
          >
            <input
              type="email"
              placeholder="Poster mail"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              style={{
                flex: "1 1 150px",
                padding: 12,
                borderRadius: 10,
                border: "1.8px solid #593F9B",
                background: "rgba(55, 45, 90, 0.35)",
                color: "#e0dfff",
                fontSize: "1.05rem",
                outline: "none",
                transition: "border-color 0.25s",
                boxShadow: "0 0 6px #7e57f1bb",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#bb86fc")}
              onBlur={(e) => (e.target.style.borderColor = "#593F9B")}
              aria-label="Enter poster email"
            />
            <input
              type="text"
              placeholder="Card name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
              style={{
                flex: "1 1 150px",
                padding: 12,
                borderRadius: 10,
                border: "1.8px solid #593F9B",
                background: "rgba(55, 45, 90, 0.35)",
                color: "#e0dfff",
                fontSize: "1.05rem",
                outline: "none",
                transition: "border-color 0.25s",
                boxShadow: "0 0 6px #7e57f1bb",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#bb86fc")}
              onBlur={(e) => (e.target.style.borderColor = "#593F9B")}
              aria-label="Enter card name"
            />
            <button
              type="submit"
              style={{
                flex: "1 1 100px",
                padding: 12,
                borderRadius: 12,
                border: "none",
                background:
                  "linear-gradient(90deg, #7b58f9, #bb86fc, #7b58f9)",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 3px 12px #bb86fcaa",
                transition: "filter 0.3s ease",
                userSelect: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
              aria-label="Add card"
            >
              Add Card
            </button>
          </form>

          {/* Loading states and error messages */}
          {loading ? (
            <p style={{
              color: "#bbb",
              textAlign: "center",
              fontSize: "1.1rem",
              fontWeight: "500",
              marginTop: 20,
              fontStyle: "italic",
            }}>Loading...</p>
          ) : error ? (
            <p style={{
              color: "#ff6f6f",
              textAlign: "center",
              fontWeight: "600",
              marginTop: 22,
            }} role="alert">
              {error}
            </p>
          ) : cards.length === 0 ? (
            <p style={{
              color: "#bbb",
              textAlign: "center",
              fontSize: "1.1rem",
              fontWeight: "500",
              marginTop: 20,
            }}>
              No favorite cards yet.
            </p>
          ) : (
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxHeight: 320,
              overflowY: "auto",
            }}>
              {cards.map(({ id, number, name }) => (
                <li key={id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(60, 43, 90, 0.33)",
                  padding: "12px 18px",
                  borderRadius: 14,
                  boxShadow: "inset 0 0 8px #7b58f9cc",
                  fontSize: "1.08rem",
                  color: "#ddd",
                  userSelect: "text",
                }}>
                  <div>
                    <strong style={{ color: "#bb86fc", fontWeight: "700", marginRight: 8 }}>
                      {name}
                    </strong>
                    —{" "}
                    <a href={`mailto:${number}`} style={{ color: "#50beff", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
                      {number}
                    </a>
                  </div>
                  <button
                    onClick={() => handleRemove(id)}
                    style={{
                      background: "#f44336",
                      border: "none",
                      borderRadius: 10,
                      color: "#fff",
                      padding: "6px 14px",
                      cursor: "pointer",
                      fontWeight: "600",
                      boxShadow: "0 2px 10px #f4433677",
                      transition: "filter 0.25s ease",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                    aria-label={`Remove card ${name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Right Banner */}
        <BannerSlideshow
          images={bannerImages}
          direction="right"
          controlIndex={(mainBannerIndex + 1) % bannerImages.length}
        />
      </div>
    </div>
  );
}

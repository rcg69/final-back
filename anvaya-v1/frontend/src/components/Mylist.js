import React, { useState, useEffect, useRef } from "react";

// Banner images array
const bannerImages = [
  "https://palmonas.com/cdn/shop/files/daily_ware_c32bcc0d-4cd5-41c3-8868-e24936980c93.jpg?v=1752847287&width=1500",
  "https://w0.peakpx.com/wallpaper/211/633/HD-wallpaper-starbucks-coffee-brands-cafe-green-men-simple-women.jpg",
  "https://pbs.twimg.com/media/DENKKAuUQAEEsKN.jpg:large",
  "https://www.trueblueadvisory.com/wp-content/uploads/2022/06/case-study_0012_ajio.jpg",
  "https://palmonas.com/cdn/shop/files/lgd_mob_2_7c31140d-dffe-4b90-b03a-8ff410349811.webp?v=1744178192&width=750",
  "https://variety.com/wp-content/uploads/2019/03/netflix-logo-n-icon.png?w=1000&h=667&crop=1"
];

// BannerSlideshow component that slides images with animation
function BannerSlideshow({ images, direction = "left", initialIndex = 0, controlIndex, onIndexChange }) {
  const [index, setIndex] = useState(initialIndex);
  const timeoutRef = useRef();

  useEffect(() => {
    if (typeof controlIndex === "number") {
      setIndex(controlIndex);
    }
  }, [controlIndex]);

  useEffect(() => {
    if (typeof controlIndex === "number") return;

    timeoutRef.current = setTimeout(() => {
      setIndex(prev => {
        const next = (prev + 1) % images.length;
        if (onIndexChange) onIndexChange(next);
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
    borderRadius: "18px",
    boxShadow: "0 8px 32px 0 rgba(187,134,252,0.12)",
    objectFit: "cover",
    zIndex: 1,
    background: "#2a233a",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "330px", // 220px * 1.5
        height: "630px", // 420px * 1.5
        overflow: "hidden",
        borderRadius: "18px",
        background: "rgba(24,18,38,0.96)",
        boxShadow: "0 8px 32px rgba(70,41,150,0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`banner-${i}`}
          draggable="false"
          style={{
            ...slideStyle,
            opacity: i === index ? 1 : 0,
            transform:
              i === index
                ? "translateX(0)"
                : direction === "left"
                ? "translateX(-110%)"
                : "translateX(110%)",
            zIndex: i === index ? 2 : 1,
          }}
        />
      ))}
      {/* Dots removed as per request */}
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

  // Load cards from sessionStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const saved = sessionStorage.getItem("mylistCards");
      if (saved) {
        setCards(JSON.parse(saved));
      }
    } catch {
      // Ignore JSON parsing error
    }
    setLoading(false);
  }, []);

  // Save to sessionStorage whenever cards change
  useEffect(() => {
    sessionStorage.setItem("mylistCards", JSON.stringify(cards));
  }, [cards]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (cardNumber.trim() === "" || cardName.trim() === "") return;
    const newCard = { id: Date.now(), number: cardNumber.trim(), name: cardName.trim() };
    setCards(prev => [...prev, newCard]);
    setCardNumber("");
    setCardName("");
  };

  const handleRemove = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
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
    >
      <div
        style={{
          display: "flex",
          gap: 46,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 1850,
        }}
      >
        {/* Left Banner */}
        <BannerSlideshow
          images={bannerImages}
          direction="left"
          initialIndex={mainBannerIndex}
          onIndexChange={setMainBannerIndex}
        />

        {/* Main Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #080808ff 100%)",
            borderRadius: "18px",
            padding: "32px 36px",
            maxWidth: 630,
            minWidth: 370,
            width: "100%",
            color: "#eeeeee",
            backdropFilter: "blur(8px)",
            boxSizing: "border-box",
            minHeight: 500,
          }}
        >
          <h2
            style={{
              color: "#f1eef5ff",
              marginBottom: 24,
              fontWeight: "900",
              fontSize: "2rem",
              textAlign: "center",
              letterSpacing: 1,
              textShadow: "0 2px 8px #4a00e041",
            }}
          >
            My List
          </h2>

          <form
            onSubmit={handleAdd}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: 28,
              justifyContent: "center",
              background: "#000",
              padding: "16px 20px",
              borderRadius: "14px",
            }}
          >
            <input
              type="email"
              placeholder="Poster mail"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={{
                flex: "1 1 150px",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1.8px solid #5935a8",
                background: "rgba(55, 45, 90, 0.35)",
                color: "#e0dfff",
                fontSize: "1.05rem",
                outline: "none",
                transition: "border-color 0.25s ease",
                boxShadow: "0 0 6px #7e57f1a8",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#bb86fc")}
              onBlur={(e) => (e.target.style.borderColor = "#5935a8")}
              required
            />
            <input
              type="text"
              placeholder="Card Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{
                flex: "1 1 150px",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1.8px solid #5935a8",
                background: "rgba(55, 45, 90, 0.35)",
                color: "#e0dfff",
                fontSize: "1.05rem",
                outline: "none",
                transition: "border-color 0.25s ease",
                boxShadow: "0 0 6px #7e57f1a8",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#bb86fc")}
              onBlur={(e) => (e.target.style.borderColor = "#5935a8")}
              required
            />
            <button
              type="submit"
              style={{
                flex: "1 1 100px",
                padding: "12px 0",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(90deg, #7b58f9, #bb86fc, #7b58f9)",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 3px 12px #bb86fcbb",
                transition: "filter 0.3s ease",
                userSelect: "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.15)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Add Card
            </button>
          </form>

          {loading ? (
            <p
              style={{
                color: "#bbb",
                textAlign: "center",
                fontSize: "1.1rem",
                fontWeight: "500",
                marginTop: 20,
                fontStyle: "italic",
              }}
            >
              Loading your list...
            </p>
          ) : error ? (
            <p
              style={{
                color: "#ff8f8f",
                textAlign: "center",
                fontWeight: "600",
                marginTop: 22,
              }}
            >
              {error}
            </p>
          ) : cards.length === 0 ? (
            <p
              style={{
                color: "#bbb",
                textAlign: "center",
                fontSize: "1.1rem",
                fontWeight: "500",
                marginTop: 20,
              }}
            >
              No favorite cards yet. Add one above!
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                maxHeight: 320,
                overflowY: "auto",
              }}
            >
              {cards.map(({ id, number, name }) => (
                <li
                  key={id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(60, 43, 90, 0.33)",
                    padding: "12px 18px",
                    borderRadius: 14,
                    boxShadow: "inset 0 0 8px #bb86fc88",
                    fontSize: "1.08rem",
                    color: "#ddd",
                    userSelect: "text",
                  }}
                >
                  <div>
                    <strong style={{ color: "#bb86fc", fontWeight: 700, marginRight: 8 }}>
                      {name}
                    </strong>
                    —{" "}
                    <a
                      href={`mailto:${number}`}
                      style={{
                        color: "#50beff",
                        textDecoration: "underline",
                        wordBreak: "break-word",
                        cursor: "pointer",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                    onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.15)")}
                    onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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

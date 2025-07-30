import React, { useState, useEffect, useRef } from "react";

function Home() {
  const [scratchCards, setScratchCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Banner images - customize as needed
  const bannerImages = [
    "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/e9512ab9-474c-49b4-9b56-1d004a582fd5._CR0%2C0%2C3000%2C600_SX1500_.jpg",
    "https://www.agoda.com/press/wp-content/uploads/2025/02/screenshot.png",
    "https://www.abhibus.com/blog/wp-content/uploads/2023/05/abhiubs-logo-696x423.jpg",
    "https://businessmodelnavigator.com/img/case-firms-logos/42.png",
    "https://palmonas.com/cdn/shop/files/web_link_creative_2.jpg?v=1738936545",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_m9RRzlBWRBBpX39bUde7w0vwFN2IUpW68A&s",
  ];

  useEffect(() => {
    const fetchScratchCards = async () => {
      try {
        const response = await fetch("/api/scratchCards");
        if (!response.ok) throw new Error("Failed to fetch scratch cards.");
        const data = await response.json();
        setScratchCards(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchScratchCards();
  }, []);

  // Banner slider with fade effect
  const BannerSlider = ({ images, interval = 6000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);
      return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, images.length, interval]);

    const bannerStyle = {
      position: "relative",
      width: "100vw", // full viewport width
      height: "50vh",
      overflow: "hidden",
      borderRadius: "0 0 20px 20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      backgroundColor: "#232323",
      marginBottom: 24,
      left: "50%",
      right: "50%",
      transform: "translateX(-50%)", // centers the banner horizontally safely
      boxSizing: "border-box",
      userSelect: "none",
      zIndex: 1,
    };

    const imageStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "opacity 0.8s ease-in-out",
      opacity: 0,
      pointerEvents: "none",
      userSelect: "none",
      zIndex: 0,
    };

    return (
      <section aria-label="Featured scratch card banners" style={bannerStyle}>
        {images.map((src, idx) => {
          const isActive = idx === currentIndex;
          return (
            <img
              key={idx}
              src={src}
              alt={`Banner ${idx + 1}`}
              loading="lazy"
              style={{
                ...imageStyle,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 2 : 0,
              }}
            />
          );
        })}
      </section>
    );
  };

  return (
    <div className="app-outer-wrapper">
      <main className="home-main" tabIndex={-1}>
        {/* Banner below navbar */}
        <BannerSlider images={bannerImages} interval={6000} />

        {/* Page Heading */}
        <h2 className="main-heading">All Scratch Cards</h2>

        {/* Error message */}
        {error && (
          <div
            className="error-message"
            style={{ color: "tomato", textAlign: "center" }}
          >
            Error: {error}
          </div>
        )}

        {/* Loading message */}
        {loading && (
          <div
            className="loading-message"
            style={{ fontStyle: "italic", textAlign: "center" }}
          >
            Loading scratch cards...
          </div>
        )}

        {/* Scratch cards grid */}
        {!loading && !error && (
          <div className="scratch-cards-grid">
            {scratchCards.length === 0 && (
              <div className="no-cards-message">No scratch cards available.</div>
            )}
            {scratchCards.map((card, idx) => (
              <article
                key={card._id || idx}
                className="scratch-card"
                tabIndex={0}
                aria-label={`Scratch card: ${card.title || "Untitled"}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "#232323",
                  color: "#eeeeee",
                  boxShadow: "0 4px 14px rgba(187,134,252,0.25)",
                  maxWidth: "280px",
                  userSelect: "none",
                }}
              >
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={`Scratch card: ${card.title}`}
                    className="scratch-card-img"
                    style={{
                      width: "100%",
                      height: "160px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      marginBottom: "10px",
                      boxShadow: "0 0 10px rgba(187, 134, 252, 0.3)",
                      userSelect: "none",
                    }}
                  />
                )}
                <h3
                  className="scratch-card-title"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
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
                    className="scratch-card-description"
                    style={{
                      fontSize: "0.95rem",
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
                    className="scratch-card-price"
                    style={{
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      color: "#bb86fc",
                      margin: "8px 0 0 0",
                      userSelect: "text",
                    }}
                  >
                    Price: ₹{card.price}
                  </p>
                )}
                {card.posterEmail && (
                  <p
                    className="scratch-card-poster"
                    style={{
                      fontSize: "0.9rem",
                      color: "#50beff",
                      margin: "4px 0 0 0",
                      wordBreak: "break-word",
                      userSelect: "text",
                    }}
                  >
                    Posted by:{" "}
                    <a
                      href={`mailto:${card.posterEmail}`}
                      style={{
                        color: "#50beff",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {card.posterEmail}
                    </a>
                  </p>
                )}
                {card.expiryDate && (
                  <p
                    className="scratch-card-expiry"
                    style={{
                      fontSize: "0.9rem",
                      color: "#bbbbbb",
                      margin: "4px 0 0 0",
                      userSelect: "text",
                    }}
                  >
                    Expires on:{" "}
                    <strong>
                      {new Date(card.expiryDate).toLocaleDateString()}
                    </strong>
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

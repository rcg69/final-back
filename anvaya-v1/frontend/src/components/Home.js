import React, { useState, useEffect, useRef } from "react";

function Home() {
  const [scratchCards, setScratchCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Banner images
  const bannerImages = [
    "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/e9512ab9-474c-49b4-9b56-1d004a582fd5._CR0%2C0%2C3000%2C600_SX1500_.jpg",
    "https://www.agoda.com/press/wp-content/uploads/2025/02/screenshot.png",
    "https://www.abhibus.com/blog/wp-content/uploads/2023/05/abhiubs-logo-696x423.jpg",
    "https://businessmodelnavigator.com/img/case-firms-logos/42.png",
    "https://palmonas.com/cdn/shop/files/web_link_creative_2.jpg?v=1738936545",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_m9RRzlBWRBBpX39bUde7w0vwFN2IUpW68A&s"
  ];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`https://final-backend-srja.onrender.com/api/scratchCards`);
        if (!response.ok) throw new Error("Failed to fetch scratch cards.");
        const data = await response.json();
        setScratchCards(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const BannerSlider = ({ images, interval = 6000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Skip the first image on phones
    const filteredImages = windowWidth <= 600 ? images.slice(1) : images;

    useEffect(() => {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
      }, interval);
      return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, filteredImages.length, interval]);

    const bannerStyle = {
      position: "relative",
      width: "100vw",
      height: windowWidth <= 600 ? "30vh" : "50vh",
      maxHeight: windowWidth <= 600 ? 200 : 300,
      overflow: "hidden",
      borderRadius: "0 0 20px 20px",
      backgroundColor: "#232323",
      marginBottom: 24,
      boxSizing: "border-box",
      userSelect: "none",
      zIndex: 1,
      left: "50%",
      right: "50%",
      transform: "translateX(-50%)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
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
        {filteredImages.map((src, idx) => {
          const isActive = idx === currentIndex;
          return (
            <img
              key={idx}
              src={src}
              alt={`Banner ${windowWidth <= 600 ? idx + 2 : idx + 1}`}
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
        style={{
          padding: "0",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
      >
        <BannerSlider images={bannerImages} interval={6000} />

        <h2 className="main-heading" style={{ paddingLeft: 16 }}>
          All Scratch Cards
        </h2>

        {error && (
          <div style={{ color: "tomato", textAlign: "center" }} role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div style={{ fontStyle: "italic", textAlign: "center" }}>
            Loading scratch cards...
          </div>
        )}

        {!loading && !error && (
          <div className="scratch-cards-wrapper" style={scratchCardsWrapperStyle}>
            {scratchCards.length === 0 && (
              <p style={{ textAlign: "center" }}>No cards available.</p>
            )}
            <div className="scratch-cards-grid">
              {scratchCards.map((card, idx) => (
                <article
                  key={card._id || idx}
                  className="scratch-card"
                  tabIndex={0}
                  aria-label={`Scratch card: ${card.title || "Untitled"}`}
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
                      className="scratch-card-img"
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
                    className="scratch-card-title"
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
                      className="scratch-card-description"
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
                      className="scratch-card-price"
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
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

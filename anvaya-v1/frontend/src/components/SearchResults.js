import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("query") || "";
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState("priceAsc");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/scratchCards/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) throw new Error("Failed to fetch search results.");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchTerm]);

  useEffect(() => {
    if (!results) {
      setFilteredResults([]);
      return;
    }
    let sorted = [...results];
    if (sortOption === "priceAsc") {
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortOption === "priceDesc") {
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortOption === "priceRange") {
      const userPrice = parseFloat(maxPrice);
      sorted = sorted.filter((x) => (x.price ?? 0) >= 0 && (x.price ?? 0) <= (userPrice || 0));
    }
    setFilteredResults(sorted);
  }, [results, sortOption, maxPrice]);

  return (
    <main className="home-main" style={{ padding: "1.5rem 2rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.65rem",
            fontWeight: 700,
            color: "#f2f0f4ff",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Search Results for &quot;{searchTerm}&quot;
        </h2>
        <div style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <select
            style={{
              padding: "7px 14px",
              borderRadius: 6,
              border: "1.8px solid #5935a8",
              background: "rgba(40, 38, 66, 0.9)",
              color: "#e0dfff",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            aria-label="Sort search results"
          >
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="priceRange">0 to price</option>
          </select>
          {sortOption === "priceRange" && (
            <input
              type="number"
              min={0}
              style={{
                width: 100,
                borderRadius: 5,
                border: "1.4px solid #5935a8",
                background: "#232323",
                color: "#bb86fc",
                padding: "7px 12px",
                marginLeft: 2,
                fontSize: ".98rem",
              }}
              placeholder="Max price"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          )}
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ color: "tomato", textAlign: "center" }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-message" style={{ fontStyle: "italic", textAlign: "center" }}>
          Loading...
        </div>
      )}

      {!loading && !error && filteredResults.length === 0 && (
        <p style={{ textAlign: "center" }}>No scratch cards found.</p>
      )}

      <div
        className="scratch-cards-grid"
        style={{
          margin: "0 auto",
          justifyContent: "center",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "28px",
          maxWidth: 1200,
        }}
      >
      {filteredResults.map((card) => (
  <article
    key={card._id}
    className="scratch-card"
    tabIndex={0}
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
      // Removed userSelect: "none" here so text inside can be selected
    }}
  >
    {card.imageUrl && (
      <img
        src={card.imageUrl}
        alt={card.title}
        className="scratch-card-img"
        style={{
          width: "100%",
          height: "160px",
          borderRadius: "10px",
          objectFit: "cover",
          marginBottom: "10px",
          boxShadow: "0 0 10px rgba(187, 134, 252, 0.3)",
          userSelect: "none", // images typically non-selectable is fine
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
        userSelect: "text", // allow text selection here
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
          userSelect: "text", // allow selecting description text
        }}
      >
        {card.description}
      </p>
    )}
    {card.price !== undefined && (
      <p
        className="scratch-card-price"
        style={{
          fontWeight: "700",
          fontSize: "1.1rem",
          color: "#bb86fc",
          margin: "8px 0 0 0",
          userSelect: "text", // allow select
        }}
      >
        Price: ₹{card.price}
      </p>
    )}
    {card.posterEmail && (
      <p
        className="scratch-card-mail"
        style={{
          fontSize: "0.9rem",
          color: "#bbbbbb",
          margin: "4px 0 0 0",
          wordBreak: "break-word",
          userSelect: "text", // allow select to copy email
        }}
      >
        Poster Email: {card.posterEmail}
      </p>
    )}
    {card.expiryDate && (
      <p
        className="scratch-card-expiry"
        style={{
          fontSize: "0.9rem",
          color: "#bbbbbb",
          margin: "4px 0 0 0",
          userSelect: "text", // allow select expiry date
        }}
      >
        Expiry Date: {new Date(card.expiryDate).toLocaleDateString()}
      </p>
    )}
  </article>
))}



      </div>
    </main>
  );
}

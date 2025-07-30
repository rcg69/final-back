import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useUser();
  const userName =
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showLinks, setShowLinks] = useState(false);

  // Track window width for responsiveness
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === "") return;
    navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    if (showLinks) setShowLinks(false);
  };

  // Desktop styles
  const desktopStyles = {
    navbar: {
      width: "100vw",
      backgroundColor: "#121212",
      color: "#eeeeee",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.85)",
      zIndex: 1000,
      boxSizing: "border-box",
      padding: "0 28px",
    },
    navbarRow: {
      width: "100%",
      maxWidth: 1400,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navbarLeft: {
      display: "flex",
      alignItems: "center",
      gap: 24,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: "#eeeeee",
      textDecoration: "none",
      userSelect: "none",
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: "0.03em",
    },
    logo: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: 8,
      userSelect: "none",
    },
    navLinks: {
      display: "flex",
      gap: 18,
    },
    navLink: {
      color: "#eeeeee",
      textDecoration: "none",
      fontWeight: 500,
      fontSize: 16,
      userSelect: "none",
      transition: "color 0.2s ease",
    },
    navLinkHover: {
      color: "#bb86fc",
    },
    navbarRight: {
      display: "flex",
      alignItems: "center",
      gap: 18,
    },
    searchForm: {
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    searchInput: {
      minWidth: 200,
      padding: "7px 14px",
      borderRadius: 8,
      border: "1.5px solid #593d9a",
      backgroundColor: "#1e1e1e",
      color: "#eeeeee",
      fontSize: 16,
      outline: "none",
      userSelect: "text",
      transition: "border-color 0.3s ease",
    },
    searchButton: {
      padding: "7px 18px",
      borderRadius: 8,
      border: "none",
      backgroundColor: "#bb86fc",
      color: "#121212",
      fontWeight: 600,
      fontSize: 16,
      cursor: "pointer",
      userSelect: "none",
      transition: "filter 0.2s ease",
    },
    userName: {
      fontSize: 14,
      color: "#eeeeee",
      whiteSpace: "nowrap",
      userSelect: "text",
      fontWeight: 600,
    },
    toggleButton: {
      display: "none",
    },
  };

  // Mobile styles
  const mobileStyles = {
    navbar: {
      ...desktopStyles.navbar,
      height: "auto",
      padding: "0 16px",
      flexWrap: "wrap",
      justifyContent: "flex-start",
    },
    navbarRow: {
      ...desktopStyles.navbarRow,
      flexDirection: "column",
      alignItems: "stretch",
      paddingTop: 12,
      paddingBottom: 12,
      gap: 8,
    },
    navbarLeft: {
      ...desktopStyles.navbarLeft,
      width: "100%",
      justifyContent: "space-between",
      gap: 12,
    },
    brand: {
      ...desktopStyles.brand,
      fontSize: 18,
    },
    navLinks: {
      display: showLinks ? "flex" : "none",
      flexDirection: "column",
      gap: 12,
      paddingLeft: 10,
      marginTop: 6,
      backgroundColor: "#1a1a1a",
      borderRadius: 8,
      boxShadow: "0 0 8px rgba(187,134,252,0.5)",
    },
    navLink: {
      ...desktopStyles.navLink,
      fontSize: 14,
      padding: "6px 12px",
      userSelect: "text",
    },
    navbarRight: {
      ...desktopStyles.navbarRight,
      width: "100%",
      justifyContent: "flex-end",
      marginTop: 8,
      gap: 14,
    },
    searchForm: {
      ...desktopStyles.searchForm,
      width: "100%",
      justifyContent: "center",
      marginBottom: 8,
    },
    searchInput: {
      ...desktopStyles.searchInput,
      minWidth: "60%",
      fontSize: 14,
      padding: "6px 10px",
    },
    searchButton: {
      ...desktopStyles.searchButton,
      padding: "6px 10px",
      fontSize: 14,
    },
    userName: {
      ...desktopStyles.userName,
      display: "none", // Optionally hide on mobile to save space
    },
    toggleButton: {
      display: "inline-block",
      background: "none",
      border: "none",
      color: "#eeeeee",
      fontSize: 28,
      cursor: "pointer",
      padding: "0 8px",
      userSelect: "none",
    },
  };

  // Decide which style set to use
  const styles = windowWidth > 900 ? desktopStyles : mobileStyles;

  return (
    <nav style={styles.navbar} role="navigation" aria-label="Main Navigation">
      <div style={styles.navbarRow}>
        <div style={styles.navbarLeft}>
          <Link to="/" style={styles.brand} aria-label="Home">
            <img src="/logo.avif" alt="Brand Logo" style={styles.logo} loading="lazy" />
            <span>{styles.brand.fontSize && (
              <span style={{ fontSize: styles.brand.fontSize }}>{styles.brand.fontSize}</span>
            )}</span>
            <span style={{ ...styles.brand }}>{/* Brand name */}Anvaya</span>
          </Link>
          {/* Mobile toggle button */}
          {windowWidth <= 900 && (
            <button
              onClick={() => setShowLinks(!showLinks)}
              aria-label="Toggle navigation"
              aria-expanded={showLinks}
              style={styles.toggleButton}
            >
              &#9776;
            </button>
          )}
          {/* Desktop or mobile menu */}
          {(windowWidth > 900 || showLinks) && (
            <div
              style={windowWidth > 900 ? styles.navLinks : styles.navLinks}
              aria-hidden={windowWidth > 900 ? false : !showLinks}
            >
              <Link to="/postcard" style={styles.navLink} onClick={() => setShowLinks(false)}>
                Post
              </Link>
              <Link to="/contact" style={styles.navLink} onClick={() => setShowLinks(false)}>
                About us
              </Link>
              <Link to="/mylist" style={styles.navLink} onClick={() => setShowLinks(false)}>
                My List
              </Link>
            </div>
          )}
        </div>
        <div style={styles.navbarRight}>
          <form
            style={styles.searchForm}
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Search scratch cards"
          >
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search scratch cards"
              name="search"
              autoComplete="off"
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton} aria-label="Submit search">
              Search
            </button>
          </form>
          <UserButton
            showName={false}
            appearance={{ variables: { colorPrimary: "#bb86fc" } }}
            style={{ userSelect: "none" }}
          />
          <span style={styles.userName}>{userName}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

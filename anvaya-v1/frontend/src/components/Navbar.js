import React, { useState } from "react";
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


  // Mobile menu toggle state
  const [showLinks, setShowLinks] = useState(false);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === "") return;
    navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    if (showLinks) setShowLinks(false); // Close menu on search submit in mobile
  };


  // Styles


  const navbarStyle = {
    width: "100vw",
    backgroundColor: "#121212",
    color: "#eeeeee",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    boxShadow: "0 2px 6px rgba(0,0,0,0.85)",
    zIndex: 1000,
    boxSizing: "border-box",
  };


  const navbarRowStyle = {
    display: "flex",
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    flexWrap: "wrap", // allow wrapping on small screens
  };


  const navbarLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: 18,
  };


  const brandStyle = {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#eeeeee",
    cursor: "pointer",
  };


  const logoStyle = {
    width: 38,
    height: 38,
    borderRadius: "50%",
    marginRight: 7,
    objectFit: "cover",
  };


  const brandNameStyle = {
    fontSize: 20,
    fontWeight: 600,
    userSelect: "none",
  };


  const toggleButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 28,
    color: "#eeeeee",
    display: "none", // default hidden, shown on mobile via JS
  };


  const navLinksStyle = {
    display: "flex",
    gap: 16,
    flexGrow: 1,
  };


  const navLinksMobileStyle = {
    display: showLinks ? "flex" : "none",
    flexDirection: "column",
    width: "100%",
    marginTop: 8,
    gap: 12,
  };


  const navLinkStyle = {
    color: "#eeeeee",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 16,
    userSelect: "none",
  };


  const navLinkHoverStyle = {
    color: "#bb86fc",
  };


  const navbarRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "nowrap",
  };


  const searchFormStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
  };


  const searchInputStyle = {
    padding: "7px 12px",
    borderRadius: 7,
    border: "1.5px solid #5935a8",
    backgroundColor: "#1e1e1e",
    color: "#eeeeee",
    fontSize: 16,
    outline: "none",
    minWidth: 120,
  };


  const searchInputMobileStyle = {
    minWidth: 80,
  };


  const searchButtonStyle = {
    padding: "7px 14px",
    borderRadius: 7,
    backgroundColor: "#bb86fc",
    color: "#121212",
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  };


  const userNameStyle = {
    marginLeft: 6,
    color: "#eeeeee",
    fontSize: 14,
    whiteSpace: "nowrap",
  };


  // Responsive styles handled via JS window width detection
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Show toggle button on mobile
  if (windowWidth <= 700) {
    toggleButtonStyle.display = "block";
  } else {
    toggleButtonStyle.display = "none";
    // Always show nav links on desktop
    navLinksStyle.display = "flex";
    navLinksMobileStyle.display = "none";
    if (showLinks) setShowLinks(false);
  }


  // Responsive shrink search input on mobile
  if (windowWidth <= 500) {
    searchInputStyle.minWidth = 80;
  } else {
    searchInputStyle.minWidth = 120;
  }


  return (
    <nav style={navbarStyle} role="navigation" aria-label="Main Navigation">
      <div style={navbarRowStyle}>
        <div style={navbarLeftStyle}>
          <Link to="/" style={brandStyle} aria-label="Home">
            <img src="/logo.avif" alt="Brand Logo" style={logoStyle} loading="lazy" />
            <span style={brandNameStyle}>Anvaya</span>
          </Link>
          <button
            style={toggleButtonStyle}
            aria-label="Toggle navigation"
            onClick={() => setShowLinks(!showLinks)}
            aria-expanded={showLinks}
          >
            &#9776;
          </button>
          {/* Navigation links for desktop */}
          {windowWidth > 700 ? (
            <div style={navLinksStyle}>
              <Link to="/postcard" style={navLinkStyle}>
                Post
              </Link>
              <Link to="/contact" style={navLinkStyle}>
                About us
              </Link>
              <Link to="/mylist" style={navLinkStyle}>
                My List
              </Link>
            </div>
          ) : (
            // Mobile collapsible nav links
            <div style={navLinksMobileStyle} aria-hidden={!showLinks}>
              <Link to="/postcard" style={navLinkStyle} onClick={() => setShowLinks(false)}>
                Post
              </Link>
              <Link to="/contact" style={navLinkStyle} onClick={() => setShowLinks(false)}>
                About us
              </Link>
              <Link to="/mylist" style={navLinkStyle} onClick={() => setShowLinks(false)}>
                My List
              </Link>
            </div>
          )}
        </div>
        <div style={navbarRightStyle}>
          <form
            onSubmit={handleSearchSubmit}
            style={searchFormStyle}
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
              style={searchInputStyle}
            />
            <button type="submit" style={searchButtonStyle} aria-label="Submit search">
              Search
            </button>
          </form>
          <UserButton showName={false} appearance={{ variables: { colorPrimary: "#bb86fc" } }} />
          <span style={userNameStyle}>{userName}</span>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
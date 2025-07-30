import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import "./style/navbar.css";

function Navbar() {
  const { user } = useUser();
  const userName =
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  // State to hold search query
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle form submission to trigger search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === "") return; // Do nothing for empty query

    // Navigate to /search with query param
    navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img
            src="/logo.avif"
            alt="Brand Logo"
            className="navbar-logo"
          />
          <span className="navbar-brand-name">Anvaya</span>
        </Link>
        <div className="navbar-nav-links">
          <Link to="/postcard" className="navbar-link">Post</Link>
          <Link to="/contact" className="navbar-link">About us</Link>
          <Link to="/mylist" className="navbar-link">My List</Link>
        </div>
      </div>
      <div className="navbar-right">
        <form
          onSubmit={handleSearchSubmit}
          className="navbar-search-form"
          role="search"
          aria-label="Search scratch cards"
        >
          <input
            type="search"
            placeholder="Search..."
            className="navbar-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search scratch cards"
            name="search"
            autoComplete="off"
          />
          <button type="submit" className="navbar-search-button" aria-label="Submit search">
            Search
          </button>
        </form>
        <UserButton
          showName={false}
          appearance={{ variables: { colorPrimary: "#bb86fc" } }}
        />
        <span className="navbar-user-name">{userName}</span>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Postcard from "./components/Postcard";
import Contact from "./components/Contact";
import Mylist from "./components/Mylist";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";

const NotFound = () => (
  <div
    style={{
      padding: 20,
      color: "#eeeeee",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: "center",
    }}
  >
    <h2>404 - Page Not Found</h2>
    <p>The page you requested does not exist.</p>
  </div>
);

// TODO: Replace with your production publishable key before deployment
const publishableKey = "pk_test_c2FmZS1lZ3JldC0yMi5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  // State to toggle between sign in and sign up forms
  const [showSignIn, setShowSignIn] = useState(true);

  // Shared appearance settings for Clerk auth forms (colors & fonts)
  const clerkAppearance = {
    baseTheme: "dark",
    variables: {
      colorPrimary: "#bb86fc",
      colorBackground: "#121212",
      colorText: "#eeeeee",
      colorInputBackground: "#1e1e1e",
      colorInputBorder: "#333333",
    },
  };

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {/* Container centers the auth forms and main app vertically and horizontally */}
      <div
        className="app-outer-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#121212",
        }}
      >
        {/* Show sign-in or sign-up forms only when signed out */}
        <SignedOut>
          <div
            className="clerk-auth-container"
            style={{
              maxWidth: 400,
              width: "100%",
              paddingTop: 40,
              backgroundColor: "#121212",
              color: "#eeeeee",
              fontFamily: "inherit",
              textAlign: "center",
            }}
          >
            <h2>{showSignIn ? "Please sign in" : "Create an account"}</h2>

            {/* Render SignIn or SignUp component based on state */}
            {showSignIn ? (
              <SignIn appearance={clerkAppearance} />
            ) : (
              <SignUp appearance={clerkAppearance} />
            )}

            {/* Toggle link for switching between SignIn and SignUp forms */}
            <div className="clerk-signup-hint" style={{ marginTop: 16 }}>
              {showSignIn ? (
                <>
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    className="clerk-toggle-button"
                    onClick={() => setShowSignIn(false)}
                    style={{
                      all: "unset",
                      color: "#bb86fc",
                      cursor: "pointer",
                      textDecoration: "underline",
                      marginLeft: 8,
                      userSelect: "none",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#9a69e0")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#bb86fc")}
                    onFocus={(e) => (e.currentTarget.style.outline = "none")}
                    aria-label="Switch to Sign Up"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    className="clerk-toggle-button"
                    onClick={() => setShowSignIn(true)}
                    style={{
                      all: "unset",
                      color: "#bb86fc",
                      cursor: "pointer",
                      textDecoration: "underline",
                      marginLeft: 8,
                      userSelect: "none",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#9a69e0")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#bb86fc")}
                    onFocus={(e) => (e.currentTarget.style.outline = "none")}
                    aria-label="Switch to Sign In"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </SignedOut>

        {/* Main app content rendered only when signed in */}
        <SignedIn>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/postcard" element={<Postcard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mylist" element={<Mylist />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SignedIn>
      </div>
    </ClerkProvider>
  );
}

export default App;

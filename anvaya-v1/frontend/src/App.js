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

const publishableKey = "pk_test_c2FmZS1lZ3JldC0yMi5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  // State to track if showing signIn or signUp
  const [showSignIn, setShowSignIn] = useState(true);

  // Shared Clerk appearance for both forms (only colors & fonts here)
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
      {/* Center the sign-in/sign-up container */}
      <div
        className="app-outer-wrapper"
        style={{
          display: "flex", // enable flexbox
          justifyContent: "center", // center horizontally
          alignItems: "center", // center vertically
          height: "100vh",
          width: "100vw",
          backgroundColor: "#121212",
        }}
      >
        {/* Render SignIn / SignUp when user is signed out */}
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

            {showSignIn ? (
              <SignIn appearance={clerkAppearance} />
            ) : (
              <SignUp appearance={clerkAppearance} />
            )}

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
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </SignedOut>

        {/* Render App when user is signed in */}
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

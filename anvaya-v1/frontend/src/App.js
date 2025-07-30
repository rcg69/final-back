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

  // Responsive styles for the container which holds sign-in/sign-up forms
  const authContainerStyle = {
    maxWidth: 400,
    width: "90%",           // Use 90% width for responsiveness
    padding: "20px 24px",   // Slightly reduced padding on mobile
    backgroundColor: "#121212",
    color: "#eeeeee",
    fontFamily: "inherit",
    textAlign: "center",
    borderRadius: 12,
    boxShadow: "0 0 20px rgba(187, 134, 252, 0.6)",
    boxSizing: "border-box",
    margin: "20px",         // Margin added for breathing room
    // Ensure it is scrollable on very small devices if necessary
    overflowWrap: "break-word",
  };

  // Wrapper style that centers content vertically and horizontally,
  // with responsive padding & flex-wrap to adapt on small height/screen
  const outerWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#121212",
    padding: "20px 10px",      // Added horizontal padding for small devices
    boxSizing: "border-box",
    flexWrap: "wrap",           // Allow wrapping if needed on very small devices
  };

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <div style={outerWrapperStyle}>
        {/* Show sign-in/sign-up when user is signed out */}
        <SignedOut>
          <div style={authContainerStyle}>
            <h2>{showSignIn ? "Please sign in" : "Create an account"}</h2>

            {showSignIn ? (
              <SignIn appearance={clerkAppearance} />
            ) : (
              <SignUp appearance={clerkAppearance} />
            )}

            <div
              className="clerk-toggle-container"
              style={{ marginTop: 16, fontSize: "0.9rem" }}
            >
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
                      fontWeight: "600",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#9a69e")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#bb86fc")
                    }
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
                      fontWeight: "600",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#9a69e")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#bb86fc")
                    }
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

        {/* Show app when user is signed in */}
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

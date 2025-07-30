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

// Reminder: replace with your production key before deployment
const publishableKey = "pk_test_c2FmZS1lZ3JldC0yMi5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  const [showSignIn, setShowSignIn] = useState(true);

  // Clerk appearance for consistent styling of auth forms and inputs
  const clerkAppearance = {
    baseTheme: "dark",
    variables: {
      colorPrimary: "#bb86fc",
      colorBackground: "#121212",
      colorText: "#eeeeee",
      colorInputBackground: "#1e1e1e",
      colorInputBorder: "#444",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSizeBase: "16px",
      fontSizeInput: "1rem",
      fontSizeButton: "1rem",
      borderRadius: "10px",
      spacingSpaceSmall: "12px",
    },
    elements: {
      formButtonPrimary:
        "box-shadow: 0 0 10px #bb86fc; transition: filter 0.2s ease;",
      formButtonPrimaryHover: "filter: brightness(1.15);",
      formInput: `
        padding: 12px 14px !important;
        border-radius: 10px !important;
        font-size: 1rem !important;
        box-sizing: border-box !important;
        margin-bottom: 16px !important;
      `,
      formInputFocused:
        "border-color: #bb86fc !important; box-shadow: 0 0 8px #bb86fc !important;",
    },
  };

  // Outer container centers the auth box, with responsive padding for laptops and mobiles
  const outerWrapperStyle = {
    minHeight: "100vh",
    width: "100vw",
    padding: "20px 16px", // ample padding on sides on all screen sizes
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    boxSizing: "border-box",
    flexWrap: "wrap", // allows wrapping if needed on small heights or very narrow screens
  };

  // Container for sign-in/sign-up forms with max-width & width responsive to screen
  const authContainerStyle = {
    maxWidth: 400,
    width: "100%", // full width inside padding on very small phones
    padding: "30px 24px",
    backgroundColor: "#121212",
    borderRadius: 14,
    boxShadow: "0 0 20px rgba(187, 134, 252, 0.7)",
    boxSizing: "border-box",
    color: "#eeeeee",
    fontFamily: clerkAppearance.variables.fontFamily,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch", // stretch inputs full width
    margin: "0 auto",
  };

  // Title style scales well for laptop and mobile users
  const titleStyle = {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: 900,
    fontSize: "2rem",
    userSelect: "none",
  };

  // Toggle link styles
  const toggleLinkStyle = {
    all: "unset",
    color: "#bb86fc",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: 8,
    userSelect: "none",
    fontFamily: clerkAppearance.variables.fontFamily,
    fontWeight: 600,
  };

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <div style={outerWrapperStyle}>
        <SignedOut>
          <main style={authContainerStyle}>
            <h2 style={titleStyle}>
              {showSignIn ? "Please sign in" : "Create an account"}
            </h2>

            {showSignIn ? (
              <SignIn appearance={clerkAppearance} />
            ) : (
              <SignUp appearance={clerkAppearance} />
            )}

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
              {showSignIn ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="clerk-toggle-button"
                    onClick={() => setShowSignIn(false)}
                    style={toggleLinkStyle}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#9a69e0")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#bb86fc")
                    }
                    aria-label="Switch to Sign Up"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="clerk-toggle-button"
                    onClick={() => setShowSignIn(true)}
                    style={toggleLinkStyle}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#9a69e0")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#bb86fc")
                    }
                    aria-label="Switch to Sign In"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </main>
        </SignedOut>

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

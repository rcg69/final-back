import React, { useRef } from "react";

function Contact() {
  const termsRef = useRef(null);

  const handleScroll = () => {
    const el = termsRef.current;
    if (!el) return;

    const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const offset = 80; // Approx 2cm space in px

    if (scrollBottom < 1 && el.scrollTop > 0) {
      // User reached bottom, scroll up by offset smoothly
      el.scrollTo({
        top: el.scrollTop - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="app-main-container contact-container"
      style={{
        minHeight: "100vh",
        padding: "48px 16px 40px 16px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: 660,
          width: "100%",
          marginTop: 36,
        }}
      >
        {/* About Us Block */}
        <section
          style={{
            background: "rgba(40, 38, 66, 0.95)",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(187,134,252,0.15), 0 2px 8px rgba(0,0,0,0.18)",
            padding: "36px 32px",
            color: "#eeeeee",
            backdropFilter: "blur(7px)",
            marginBottom: 28,
            border: "1.5px solid #bb86fc44",
          }}
        >
          <h2
            style={{
              color: "#bb86fc",
              marginBottom: 15,
              fontWeight: 900,
              fontSize: "2.1rem",
              textShadow: "0 2px 8px #4a00e041",
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            About Us
          </h2>
          <p
            style={{
              color: "#bbb",
              fontSize: "1.15rem",
              textAlign: "center",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            We are committed to providing a secure, transparent, and trustworthy marketplace for buying and selling scratch cards. If you have any questions, feedback, or need assistance with your account or transactions, please don’t hesitate to reach out. Our dedicated support team is here to help resolve any disputes and ensure a smooth experience on the platform. We value your trust and strive to maintain the highest standards of security and user satisfaction in every interaction.
          </p>
        </section>

        {/* Terms and Conditions Block */}
        <section
          ref={termsRef}
          onScroll={handleScroll}
          style={{
            background: "rgba(40, 38, 66, 0.85)",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(100,100,150,0.12), 0 2px 10px rgba(0,0,0,0.1)",
            padding: "32px 28px",
            color: "#ddd",
            backdropFilter: "blur(5px)",
            border: "1.5px solid #775fcfbb",
            maxHeight: "420px",
            overflowY: "auto",
            lineHeight: 1.5,
          }}
        >
          {/* Terms & Conditions content same as before */}
          <h2
            style={{
              color: "#9E78FA",
              fontWeight: 800,
              textAlign: "center",
              fontSize: "1.9rem",
              marginBottom: 20,
              letterSpacing: 1,
              textShadow: "0 1px 8px #976efa50",
            }}
          >
            Terms and Conditions
          </h2>

          <h3 style={{ color: "#bb86fc", marginTop: 0, marginBottom: 10, fontWeight: 700 }}>
            General Commitment
          </h3>
          <p>
            We are committed to providing a secure, transparent, and trustworthy marketplace for buying and selling scratch cards. Our platform strives to maintain the highest standards of security and user satisfaction.
          </p>

          <h3 style={{ color: "#bb86fc", marginTop: 15, marginBottom: 10, fontWeight: 700 }}>
            User Responsibility
          </h3>
          <p>
            Users are responsible for verifying the authenticity and validity of any scratch cards purchased on the platform. We recommend exercising due diligence before completing any transactions.
          </p>

          <h3 style={{ color: "#bb86fc", marginTop: 15, marginBottom: 10, fontWeight: 700 }}>
            Limitation of Liability
          </h3>
          <p>
            We do not accept responsibility or liability for any losses, damages, or disputes arising from:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 5, color: "#ccc" }}>
            <li>Miscommunication between users,</li>
            <li>Fraudulent activities conducted by any party,</li>
            <li>Payment issues beyond our platform’s control,</li>
            <li>The sale or distribution of fake or counterfeit scratch cards.</li>
          </ul>

          <h3 style={{ color: "#bb86fc", marginTop: 15, marginBottom: 10, fontWeight: 700 }}>
            Dispute Resolution
          </h3>
          <p>
            While our dedicated support team is available to assist with account issues and transaction disputes, we cannot guarantee the resolution of disputes related to fraudulent cards or external payment failures.
          </p>

          <h3 style={{ color: "#bb86fc", marginTop: 15, marginBottom: 10, fontWeight: 700 }}>
            User Agreement
          </h3>
          <p>
            By using our platform, you acknowledge and accept these terms and agree to take full responsibility for your transactions. We encourage all users to report suspicious activities or listings immediately.
          </p>
        </section>

        <p style={{ color: "#bbbbbb", fontSize: "1rem", lineHeight: 1.5, marginTop: 16, textAlign: "center" }}>
          Explore features like posting scratch cards, managing your personalized list, and easily reaching our support through the Contact page.
        </p>

        {/* Developer Info Section */}
        <section
          className="developer-info"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1.5px solid #463268",
            background: "linear-gradient(90deg, transparent 0%, #23232380 35%, transparent 100%)",
          }}
        >
          {/* Developer Picture */}
          <img
            src="/ram.jpg"
            alt="Ram charana Goud"
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 0 24px 2px rgba(187, 134, 252, 0.46)",
              border: "3.5px solid #bb86fc33",
              background: "#18102a",
            }}
          />

          {/* Developer Text Info */}
          <div>
            <h3
              style={{
                color: "#bb86fc",
                marginBottom: 7,
                fontWeight: 800,
                fontSize: "1.11rem",
                letterSpacing: 0.6,
                textShadow: "0 1px 6px #bb86fc12",
              }}
            >
              Developer
            </h3>
            <p
              style={{
                color: "#bbbbbb",
                marginBottom: 6,
                fontSize: "1.10rem",
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              Ram charana Goud
            </p>
            <p
              style={{
                color: "#aaaaaa",
                fontSize: "0.92rem",
                lineHeight: 1.52,
                maxWidth: 340,
                marginBottom: 0,
              }}
            >
              Passionate full-stack developer specializing in building dynamic and secure web applications with sleek UI and smooth UX. Reach me at{" "}
              <a
                href="mailto:ramgoud696@gmail.com"
                style={{ color: "#bb86fc", textDecoration: "underline", fontWeight: 600 }}
              >
                ramgoud696@gmail.com
              </a>{" "}
              for any queries or feedback.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;

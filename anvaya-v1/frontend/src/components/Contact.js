import React, { useRef, useState, useEffect } from "react";

function Contact() {
  const termsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width for responsiveness
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 600);
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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

          // Responsive adjustments for mobile
          padding: isMobile ? "20px 12px" : undefined,
          marginTop: isMobile ? 20 : 36,
        }}
      >
        {/* About Us Block */}
        <section
          style={{
            background: "rgba(40, 38, 66, 0.95)",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(187,134,252,0.15), 0 2px 8px rgba(0,0,0,0.18)",
            padding: isMobile ? "24px 18px" : "36px 32px",
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
              fontSize: isMobile ? "1.8rem" : "2.1rem",
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
              fontSize: isMobile ? "1rem" : "1.15rem",
              textAlign: "center",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            We are committed to providing a secure, transparent, and trustworthy
            marketplace for buying and selling scratch cards. If you have any
            questions, feedback, or need assistance with your account or
            transactions, please don’t hesitate to reach out. Our dedicated
            support team is here to help resolve any disputes and ensure a
            smooth experience on the platform. We value your trust and strive to
            maintain the highest standards of security and user satisfaction in
            every interaction.
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
            padding: isMobile ? "24px 20px" : "32px 28px",
            color: "#ddd",
            backdropFilter: "blur(5px)",
            border: "1.5px solid #775fcfbb",
            maxHeight: isMobile ? "320px" : "420px",
            overflowY: "auto",
            lineHeight: 1.5,
          }}
        >
          {/* Terms & Conditions content unchanged */}
          <h2
            style={{
              color: "#9E78FA",
              fontWeight: 800,
              textAlign: "center",
              fontSize: isMobile ? "1.6rem" : "1.9rem",
              marginBottom: 20,
              letterSpacing: 1,
              textShadow: "0 1px 8px #976efa50",
            }}
          >
            Terms and Conditions
          </h2>

          {[{
            title: "General Commitment",
            content: "We are committed to providing a secure, transparent, and trustworthy marketplace for buying and selling scratch cards. Our platform strives to maintain the highest standards of security and user satisfaction.",
          }, {
            title: "User Responsibility",
            content: "Users are responsible for verifying the authenticity and validity of any scratch cards purchased on the platform. We recommend exercising due diligence before completing any transactions."
          }, {
            title: "Limitation of Liability",
            content: "We do not accept responsibility or liability for any losses, damages, or disputes arising from:",
            list: [
              "Miscommunication between users,",
              "Fraudulent activities conducted by any party,",
              "Payment issues beyond our platform’s control,",
              "The sale or distribution of fake or counterfeit scratch cards."
            ]
          }, {
            title: "Dispute Resolution",
            content: "While our dedicated support team is available to assist with account issues and transaction disputes, we cannot guarantee the resolution of disputes related to fraudulent cards or external payment failures."
          }, {
            title: "User Agreement",
            content: "By using our platform, you acknowledge and accept these terms and agree to take full responsibility for your transactions. We encourage all users to report suspicious activities or listings immediately."
          }].map(({ title, content, list }) => (
            <div key={title} style={{ marginTop: title === "General Commitment" ? 0 : 15 }}>
              <h3 style={{ color: "#bb86fc", marginBottom: 10, fontWeight: 700 }}>
                {title}
              </h3>
              <p>
                {content}
              </p>
              {list && (
                <ul style={{ paddingLeft: 20, marginTop: 5, color: "#ccc" }}>
                  {list.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>

        <p
          style={{
            color: "#bbbbbb",
            fontSize: isMobile ? "0.9rem" : "1rem",
            lineHeight: 1.5,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Explore features like posting scratch cards, managing your personalized list, and easily reaching our support through the Contact page.
        </p>

        {/* Developer Info Section */}
        <section
          className="developer-info"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: 22,
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1.5px solid #463268",
            background: "linear-gradient(90deg, transparent 0%, #23232380 35%, transparent 100%)",
            textAlign: isMobile ? "center" : "left"
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
              margin: isMobile ? "0 auto 16px auto" : undefined,
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

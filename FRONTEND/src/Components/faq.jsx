import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewLoader from "./NewLoader/NewLoader";
import { FaChevronDown, FaMagnifyingGlass, FaCircleQuestion, FaEnvelope } from "react-icons/fa6";

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "general",
      question: "What is Prabhu Pooja?",
      answer:
        "Prabhu Pooja is India's premier spiritual platform dedicated to bringing authentic Vedic rituals, certified astrologers, and sacred temple services to modern devotees worldwide with 100% transparency and devotion.",
    },
    {
      category: "general",
      question: "What services are offered by Prabhu Pooja?",
      answer:
        "Prabhu Pooja offers Online Pooja with live streaming, Vedic Astrology consultations (Call/Chat/Video), Temple Darshan & VIP Seva, Doorstep Consecrated Prasad Delivery, Pure Pooja Samagri Store, Shubh Muhurat calculations, and Annual Devotee Memberships.",
    },
    {
      category: "pooja",
      question: "How do I participate in an Online Pooja virtually?",
      answer:
        "Once you book an Online Pooja, you receive a dedicated HD video link on your registered WhatsApp number and email. During the live ceremony, the Pandit ji connects with you, chants your family Gotra and Sankalp wishes, and conducts all rituals live in front of you.",
    },
    {
      category: "pooja",
      question: "Do I need to be physically present at the temple or pooja venue?",
      answer:
        "No. Our qualified Gurukul-trained Pandits perform the sacred rituals at holy shrines (Ujjain, Kashi, Haridwar, etc.) on your behalf while you participate virtually from the peace of your home.",
    },
    {
      category: "astro",
      question: "How do Vedic Astrology consultations work?",
      answer:
        "You can choose an astrologer based on language, experience, and specialization (Kundali, Career, Marriage, Health). You can connect instantly via Live Phone Call, Chat, or Video Call. Astrologers provide detailed charts, planetary analysis, and customized Vedic remedies.",
    },
    {
      category: "prasad",
      question: "How is Prasad packed and dispatched to my home?",
      answer:
        "After the pooja or temple offering, authentic Mahaprasad (bhasma, dry sweets, energized raksha sutra, holy yantra) is packed in vacuum-sealed, food-grade devotional boxes and shipped via express courier right to your doorstep.",
    },
    {
      category: "samagri",
      question: "Are the Pooja Samagri and Gemstones certified and authentic?",
      answer:
        "Yes! All items in our Pooja Samagri & Store—including Gangajal from Haridwar, genuine Rudraksha from Nepal/Indonesia, natural gemstones, and pure dhoop—undergo strict purity tests and are energised before shipping.",
    },
    {
      category: "general",
      question: "What payment methods are supported on Prabhu Pooja?",
      answer:
        "We support 100% secure payments via UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Wallet recharge with instant digital receipts.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <NewLoader />;
  }

  return (
    <div className="faq_page_wrapper" style={{ backgroundColor: "#fdfaf6", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Hero Header */}
      <div className="sub_header_about_new">
        <div className="overlay_about"></div>
        <div className="container">
          <div className="subheader_inner_about">
            <div className="subheader_text_about">
              <span className="hero_badge_about">❓ Frequently Asked Questions</span>
              <h1>Help & Devotee FAQs</h1>
              <p>Find quick answers regarding pooja bookings, live streaming, astrology, and deliveries.</p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Brand Info</li>
                <li className="breadcrumb-item active">FAQ</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main FAQ Section */}
      <section className="container py-5">
        {/* Search Bar & Category Filter */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <div
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: "30px",
                border: "1.5px solid #fed7aa",
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 6px 20px rgba(234, 88, 12, 0.06)",
                marginBottom: "25px",
              }}
            >
              <FaMagnifyingGlass style={{ color: "#ea580c", marginRight: "12px", fontSize: "18px" }} />
              <input
                type="text"
                placeholder="Search questions (e.g. online pooja, prasad delivery, payment)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14.5px",
                  color: "#1e293b",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                className={`tab_pill ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All Questions
              </button>
              <button
                className={`tab_pill ${activeCategory === "general" ? "active" : ""}`}
                onClick={() => setActiveCategory("general")}
              >
                🕉️ General
              </button>
              <button
                className={`tab_pill ${activeCategory === "pooja" ? "active" : ""}`}
                onClick={() => setActiveCategory("pooja")}
              >
                🪔 Online Pooja
              </button>
              <button
                className={`tab_pill ${activeCategory === "astro" ? "active" : ""}`}
                onClick={() => setActiveCategory("astro")}
              >
                🔮 Astrology
              </button>
              <button
                className={`tab_pill ${activeCategory === "prasad" ? "active" : ""}`}
                onClick={() => setActiveCategory("prasad")}
              >
                📦 Prasad Delivery
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    background: "#ffffff",
                    border: openIndex === index ? "1.5px solid #ea580c" : "1px solid #ffedd5",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    onClick={() => toggleFAQ(index)}
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: openIndex === index ? "#fffaf5" : "#ffffff",
                      transition: "background-color 0.25s",
                    }}
                  >
                    <h5
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 700,
                        color: openIndex === index ? "#c2410c" : "#1e293b",
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.question}
                    </h5>
                    <FaChevronDown
                      style={{
                        color: openIndex === index ? "#ea580c" : "#94a3b8",
                        transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        fontSize: "14px",
                        marginLeft: "15px",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  {openIndex === index && (
                    <div
                      style={{
                        padding: "0 24px 22px 24px",
                        color: "#475569",
                        fontSize: "14.5px",
                        lineHeight: 1.7,
                        backgroundColor: "#fffaf5",
                        borderTop: "1px dashed #fed7aa",
                        paddingTop: "16px",
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <FaCircleQuestion style={{ fontSize: "40px", color: "#fed7aa", marginBottom: "15px" }} />
                <h4 style={{ color: "#1e293b", fontWeight: 700 }}>No matching questions found</h4>
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Try searching with different terms or contact our Devotee Care coordinator.
                </p>
              </div>
            )}

            {/* Still have questions? */}
            <div
              style={{
                marginTop: "40px",
                background: "linear-gradient(135deg, #7c2d12 0%, #431407 100%)",
                borderRadius: "20px",
                padding: "30px",
                textAlign: "center",
                color: "#ffffff",
                boxShadow: "0 15px 35px rgba(67, 20, 7, 0.2)",
              }}
            >
              <h3 style={{ color: "#ffedd5", fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>
                Still have unanswered questions?
              </h3>
              <p style={{ color: "#fed7aa", fontSize: "14px", marginBottom: "20px" }}>
                Our Devotee Care coordinators are available 7 days a week to guide you.
              </p>
              <Link
                to="/enquiryform"
                className="btn_feedback_gold"
                style={{ display: "inline-block" }}
              >
                <FaEnvelope className="me-2" /> Contact Devotee Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Faq;

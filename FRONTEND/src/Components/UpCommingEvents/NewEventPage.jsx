// NewEventPage.jsx

import React, { useState, useEffect } from "react";
import "./NewEventPage.css";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";

import {
  FaFire,
  FaPhoneAlt,
  FaArrowRight,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

import { MdCalendarMonth } from "react-icons/md";
import { GiSparkles } from "react-icons/gi";

import defaultImg from "../Assets/events/2.png";
import defaultImg1 from "../Assets/events/4.png";
import EventForm from "./EventForm";

const NewEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image, fallback) => {
    if (!image || image === "null" || image === "undefined") return fallback;
    const cleanImg = typeof image === "string" ? image.trim() : "";
    if (!cleanImg || cleanImg === "null" || cleanImg === "undefined") return fallback;
    if (
      cleanImg.startsWith("http://") ||
      cleanImg.startsWith("https://") ||
      cleanImg.startsWith("data:") ||
      cleanImg.startsWith("/static/")
    ) {
      return cleanImg;
    }
    const backendBase =
      process.env.REACT_APP_BACKEND_URL ||
      process.env.REACT_APP_BASE_URL ||
      "https://api.prabhupooja.com";
    return `${backendBase}/uploads/${cleanImg}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEventData = async () => {
      try {
        if (id) {
          const res = await api.get(`/events/get/${id}`);
          if (res.data?.success && res.data?.data) {
            setEventData(res.data.data);
            setLoading(false);
            return;
          }
        }
        // If no ID or ID fetch fails, fetch the primary latest event
        const resAll = await api.get("/events/getall?type=latest");
        if (resAll.data?.success && Array.isArray(resAll.data?.data) && resAll.data.data.length > 0) {
          setEventData(resAll.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching dynamic event page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div className="sawan-loader" style={{ width: "40px", height: "40px", borderColor: "rgba(255, 122, 0, 0.2)", borderTopColor: "#ff7a00", borderWidth: "3px" }}></div>
        <p style={{ marginTop: "16px", color: "#666", fontSize: "16px" }}>लोड हो रहा है... कृपया प्रतीक्षा करें</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h2 style={{ fontSize: "28px", color: "#1e1e1e", marginBottom: "12px" }}>कोई इवेंट उपलब्ध नहीं है</h2>
        <p style={{ color: "#666", maxWidth: "480px", marginBottom: "24px" }}>
          फिलहाल यह इवेंट उपलब्ध नहीं है या समाप्त हो चुका है। हमारे अन्य आगामी दिव्य आयोजनों को देखें।
        </p>
        <button className="book-btn" onClick={() => navigate("/latest-events")}>
          सभी इवेंट्स देखें →
        </button>
      </div>
    );
  }

  const currentEvent = eventData;
  const heroImgUrl = getImageUrl(currentEvent.image, defaultImg);

  const features = [
    {
      icon: <GiSparkles size={38} />,
      title: "विशेष पूजा",
      desc: currentEvent.special_pooja || "वैदिक अनुष्ठान एवं विशेष जाप।",
    },
    {
      icon: <MdCalendarMonth size={38} />,
      title: "शुभ आयोजन",
      desc: currentEvent.date_info || (currentEvent.start_date ? `${currentEvent.start_date} से ${currentEvent.end_date || ""}` : "संपूर्ण मास"),
    },
    {
      icon: <FaPhoneAlt size={38} />,
      title: "ऑनलाइन सुविधा",
      desc: currentEvent.service_type || "घर बैठे पूजा बुक करें एवं लाइव दर्शन।",
    },
  ];

  const benefits = [
    "अनुभवी वैदिक पंडितों द्वारा संकल्प",
    "ऑनलाइन एवं ऑफलाइन पूजा की सुविधा",
    "पूजा एवं आरती का लाइव प्रसारण",
    "शुद्ध पूजा सामग्री की सम्पूर्ण व्यवस्था",
  ];

  const contacts = [
    {
      icon: <FaWhatsapp size={18} />,
      label: "WhatsApp",
      value: "+91 72250 16699",
      href: "https://wa.me/917225016699",
    },
    {
      icon: <FaPhoneAlt size={18} />,
      label: "कॉल करें",
      value: "+91 72250 16699",
      href: "tel:+917225016699",
    },
    {
      icon: <FaEnvelope size={18} />,
      label: "ईमेल",
      value: "support@prabhupooja.com",
      href: "mailto:support@prabhupooja.com",
    },
  ];

  return (
    <>
      <div className="new-event-page">
        {/* ================= HERO SECTION ================= */}

        <section className="new-event-hero-section">
          <div className="new-event-hero-overlay"></div>

          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>

          <div className="new-event-hero-container">
            {/* LEFT CONTENT */}

            <div className="new-event-hero-left">
              <span className="new-event-hero-tag">{currentEvent.tag || "✨ विशेष दिव्य महोत्सव"}</span>

              <h1 className="new-event-hero-title">
                {currentEvent.title}
              </h1>

              <p className="new-event-hero-desc">
                {currentEvent.description}
              </p>

              <div className="new-event-hero-buttons">
                <button className="book-btn" onClick={() => setShowPopup(true)}>
                  🚩 अभी बुक करें
                </button>
                <button 
                  className="sawan-view-btn" 
                  onClick={() => navigate("/latest-events")}
                  style={{ marginLeft: "12px" }}
                >
                  सभी इवेंट्स देखें →
                </button>
              </div>

              <div className="new-event-contact-row">
                {contacts.map((item, index) => (
                  <a
                    key={index}
                    className="new-event-contact-item"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="contact-icon">{item.icon}</span>
                    <div>
                      <div className="contact-label">{item.label}</div>
                      <div className="contact-value">{item.value}</div>
                    </div>
                  </a>
                ))}

                <a
                  href="https://wa.me/917225016699"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="new-event-contact-cta"
                >
                  <span>अभी कॉल करें या मैसेज करें</span>
                  <FaArrowRight />
                </a>
              </div>

              <div className="new-event-hero-stats">
                <div className="stat-card">
                  <h3>{currentEvent.start_date || "आगामी"}</h3>
                  <p>आरंभ तिथि</p>
                </div>

                <div className="stat-card">
                  <h3>{currentEvent.end_date || "शुभ मुहूर्त"}</h3>
                  <p>समापन तिथि</p>
                </div>

                <div className="stat-card">
                  <h3>24/7</h3>
                  <p>ऑनलाइन सेवा</p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}

            <div className="new-event-hero-right">
              <img 
                src={heroImgUrl} 
                alt={currentEvent.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImg;
                }}
              />
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}

        <section className="new-eventfeatures-section">
          <div className="new-event-section-header">
            <h2>
              पूजा <span>विशेषताएँ</span>
            </h2>

            <p>अनुभवी पंडितों द्वारा वैदिक विधि से सम्पन्न पूजा एवं जाप।</p>
          </div>

          <div className="new-event-features-grid">
            {features.map((item, index) => (
              <div className="new-event-feature-card" key={index}>
                <div className="new-event-feature-icon">{item.icon}</div>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}

        <section className="new-event-about-section">
          <div className="new-event-about-container">
            {/* IMAGE */}

            <div className="new-event-about-image">
              <img 
                src={heroImgUrl || defaultImg1} 
                alt={currentEvent.title || "Spiritual event"} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImg1;
                }}
              />
            </div>

            {/* CONTENT */}

            <div className="new-event-about-content">
              <span className="new-event-about-tag">{currentEvent.tag || "Divine Blessings"}</span>

              <h2>
                {currentEvent.title ? `${currentEvent.title} का महत्व` : "भगवान की असीम कृपा से भरें अपना जीवन"}
              </h2>

              <p>
                {currentEvent.description || "विशेष पूजा एवं अनुष्ठान से जीवन में सुख, शांति, समृद्धि एवं सकारात्मक ऊर्जा प्राप्त करें।"}
              </p>

              <div className="new-event-benefits-list">
                {benefits.map((item, index) => (
                  <div className="new-event-benefit-item" key={index}>
                    <FaFire className="new-event-benefit-icon" />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}

        <section className="new-event-cta-section">
          <div className="new-event-cta-box">
            <h2>
              अभी बुक करें
              <br />
              <span>{currentEvent.title}</span>
            </h2>

            <p>
              सीमित स्लॉट उपलब्ध हैं। अभी अपनी पूजा बुक करें और प्रभु का आशीर्वाद प्राप्त करें।
            </p>

            <button className="new-event-cta-btn" onClick={() => setShowPopup(true)}>
              अभी बुक करें
              <FaArrowRight />
            </button>
          </div>
        </section>
      </div>
      {showPopup && (
        <EventForm 
          setShowPopup={setShowPopup}
          eventTitle={currentEvent.title}
          prefilledService={currentEvent.special_pooja || currentEvent.title}
          prefilledDate={currentEvent.start_date || ""}
          user={user}
        />
      )}
    </>
  );
};

export default NewEventPage;

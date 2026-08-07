// NewEventPage.jsx

import React, { useState } from "react";
import "./NewEventPage.css";

import {
  FaFire,
  FaPhoneAlt,
  FaArrowRight,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

import { MdCalendarMonth } from "react-icons/md";

import { GiSparkles } from "react-icons/gi";

import img from "../Assets/events/2.png";
import img1 from "../Assets/events/4.png";

import EventForm from "./EventForm";

const NewEventPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const features = [
    {
      icon: <GiSparkles size={38} />,
      title: "विशेष पूजा",
      desc: "रुद्राभिषेक।",
    },
    {
      icon: <MdCalendarMonth size={38} />,
      title: "पूरे सावन मास",
      desc: "30 जुलाई 2026 से 28 अगस्त 2026 तक।",
    },
    {
      icon: <FaPhoneAlt size={38} />,
      title: "ऑनलाइन सुविधा",
      desc: "घर बैठे पूजा बुक करें एवं लाइव दर्शन।",
    },
  ];

  const benefits = [
    "अनुभवी वैदिक पंडित",
    "ऑनलाइन एवं ऑफलाइन पूजा",
    "पूजा का लाइव प्रसारण",
    "पूजा सामग्री की सम्पूर्ण व्यवस्था",
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
              <span className="new-event-hero-tag">🕉 सावन महोत्सव 2026</span>

              <h1 className="new-event-hero-title">
                महा <span>रुद्राभिषेक</span>
              </h1>

              <p className="new-event-hero-desc">
                भगवान शिव की दिव्य कृपा प्राप्त करें और सावन के पावन महीने में
                घर बैठे ऑनलाइन एवं ऑफलाइन रुद्राभिषेक पूजा बुक करें।
              </p>

              <div className="new-event-hero-buttons">
                <button className="book-btn" onClick={() => setShowPopup(true)}>
                🚩 पूजा बुक करें
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
                  <h3>30</h3>
                  <p>जुलाई 2026</p>
                </div>

                <div className="stat-card">
                  <h3>28</h3>
                  <p>अगस्त 2026</p>
                </div>

                <div className="stat-card">
                  <h3>24/7</h3>
                  <p>ऑनलाइन सेवा</p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}

            <div className="new-event-hero-right">
              <img src={img} alt="shiv pooja" />
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}

        <section className="new-eventfeatures-section">
          <div className="new-event-section-header">
            <h2>
              सावन पूजा <span>विशेषताएँ</span>
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
              <img src={img1} alt="temple" />
            </div>

            {/* CONTENT */}

            <div className="new-event-about-content">
              <span className="new-event-about-tag">Divine Blessings</span>

              <h2>
                भगवान शिव की कृपा
                <br />
                से भरें अपना जीवन
              </h2>

              <p>
                रुद्राभिषेक से जीवन में शांति, समृद्धि एवं
                सकारात्मक ऊर्जा प्राप्त करें।
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
              <span>सावन विशेष पूजा</span>
            </h2>

            <p>
              सीमित स्लॉट उपलब्ध हैं। अभी अपनी पूजा बुक करें और भगवान शिव की
              कृपा प्राप्त करें।
            </p>

            <button className="new-event-cta-btn">
              अभी बुक करें
              <FaArrowRight />
            </button>
          </div>
        </section>
      </div>
      {showPopup && <EventForm setShowPopup={setShowPopup} />}
    </>
  );
};

export default NewEventPage;

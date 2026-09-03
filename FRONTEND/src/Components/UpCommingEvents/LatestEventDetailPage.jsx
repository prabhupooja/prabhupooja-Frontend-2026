import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";
import EventForm from "./EventForm";
import useAuthStore from "../../Store/UserStore/userAuthStore";

import defaultLatestImg from "../Assets/adhiyogi1.jpg";

const fallbackEvent = {
  id: 1,
  tag: "Maha Utsav",
  title: "Grand Maha Shivratri Rudrabhishek & Bhajan Sandhya",
  description:
    "Join us for the divine celebration of Maha Shivratri with continuous Rudrabhishek, Vedic chanting, special aarti, and spiritual discourses by revered pandits. Devotees can participate online or in-person for the sacred anushthan to receive the supreme grace of Lord Shiva.",
  short_description:
    "Annual divine celebration of Maha Shivratri with 24-hour Akhand Rudrabhishek.",
  date_info: "18th - 19th September 2026",
  start_date: "2026-09-18",
  end_date: "2026-09-19",
  location: "Kashi Vishwanath Complex, Varanasi & Live Online",
  special_pooja: "Akhand Rudrabhishek & Maha Aarti",
  service_type: "Varanasi & Online",
  image: defaultLatestImg,
  website: null,
};

const LatestEventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  
  const { user } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/get/${id}`);
        if (response.data.success && response.data.data) {
          setEvent(response.data.data);
        } else {
          setEvent(fallbackEvent);
        }
      } catch (error) {
        console.error("Error fetching event detail:", error);
        setEvent(fallbackEvent);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Loading event details...</div>;
  }

  const currentEvent = event || fallbackEvent;

  const getImageUrl = (image) => {
    if (!image) return defaultLatestImg;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
    return `${backendBase}/uploads/${image}`;
  };

  const imageUrl = getImageUrl(currentEvent.image);

  return (
    <div className="pe-detail-page">
      {/* Detail Hero */}
      <section
        className="pe-detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('${imageUrl}'), linear-gradient(135deg, #1e1b18, #3b1e08)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pe-detail-hero-overlay" />
        <div className="pe-detail-hero-content">
          <button className="pe-back-btn" onClick={() => navigate("/latest-events")}>
            ← Back to Events
          </button>
          {currentEvent.tag && <span className="pe-detail-tag">✨ {currentEvent.tag}</span>}
          <h1>{currentEvent.title}</h1>
          <div className="pe-detail-meta">
            <span>📅 {currentEvent.date_info || currentEvent.start_date || "Upcoming"}</span>
            <span>📍 {currentEvent.location || currentEvent.service_type || "भारत"}</span>
          </div>
        </div>
      </section>

      <section className="pe-detail-body">
        <div className="pe-detail-container">
          <div className="pe-detail-info-row">
            <div className="pe-detail-info-card">
              <span className="pe-info-label">📅 Date</span>
              <span className="pe-info-value">
                {currentEvent.date_info || (currentEvent.start_date ? `${currentEvent.start_date} - ${currentEvent.end_date || ""}` : "Upcoming")}
              </span>
            </div>
            <div className="pe-detail-info-card">
              <span className="pe-info-label">🕉 Special Pooja</span>
              <span className="pe-info-value">{currentEvent.special_pooja || "Special Anushthan"}</span>
            </div>
            <div className="pe-detail-info-card">
              <span className="pe-info-label">📍 Location / Service</span>
              <span className="pe-info-value">{currentEvent.location || currentEvent.service_type || "Online & Offline"}</span>
            </div>
          </div>

          <div className="pe-detail-section">
            <h2>About this Event</h2>
            <p className="pe-detail-desc">{currentEvent.description}</p>
          </div>

          {/* CTA Section */}
          <div className="pe-detail-cta">
            <h3>Join Us in this Divine Journey</h3>
            <p style={{ color: "#64748b", margin: "10px 0 20px" }}>
              Be part of the sacred celebrations and receive divine blessings.
            </p>
            <button
              className="pe-cta-btn"
              onClick={() => {
                const linkUrl = currentEvent.website || currentEvent.redirect_url;
                if (linkUrl && (linkUrl.startsWith("http://") || linkUrl.startsWith("https://"))) {
                  window.open(linkUrl, "_blank", "noopener,noreferrer");
                } else if (linkUrl) {
                  navigate(linkUrl.startsWith("/") ? linkUrl : `/${linkUrl}`);
                } else {
                  setShowPopup(true);
                }
              }}
            >
              Participate / Register Now 🙏
            </button>
          </div>
        </div>
      </section>

      {showPopup && (
        <EventForm
          eventTitle={currentEvent.title}
          user={user}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default LatestEventDetailPage;

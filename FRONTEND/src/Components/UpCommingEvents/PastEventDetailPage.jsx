import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PastEvents.css";
import api from "../Axios/api";

// Default fallback images
import img1 from "../Assets/Sounds/55.jpeg";
import img2 from "../Assets/pooja-img.jpg";
import img3 from "../Assets/adhiyogi2.jpg";

const PastEventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image || image === "null" || image === "undefined") return img1;
    const cleanImg = typeof image === "string" ? image.trim() : "";
    if (!cleanImg || cleanImg === "null" || cleanImg === "undefined") return img1;
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
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/get/${id}`);
        if (response.data?.success && response.data?.data) {
          setEvent(response.data.data);
        } else {
          setEvent(null);
        }
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Loading event details...</div>;
  }

  if (!event) {
    return (
      <div className="pe-not-found">
        <h2>Event not found</h2>
        <button onClick={() => navigate("/past-events")}>← Back to Past Events</button>
      </div>
    );
  }

  const imageUrl = getImageUrl(event.image);
  const eventDate = event.date_info || event.date || (event.start_date ? `${event.start_date}` : "Past Event");
  const eventLocation = event.location || event.service_type || "भारत";
  const eventSpeaker = event.speaker || event.tag || event.special_pooja || "आचार्य";

  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return field.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const highlightsList = parseArrayField(event.highlights);
  const galleryList = parseArrayField(event.gallery);

  return (
    <div className="pe-detail-page">
      {/* Hero */}
      <section className="pe-detail-hero">
        <div 
          className="pe-detail-hero-bg-blur"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="pe-detail-hero-overlay" />
        <div className="pe-detail-hero-container">
          <div className="pe-detail-hero-left">
            <button className="pe-back-btn" onClick={() => navigate("/past-events")}>
              ← Back to Events
            </button>
            <span className="pe-detail-tag">✨ Past Event</span>
            <h1>{event.title}</h1>
            <div className="pe-detail-meta">
              <span>📅 {eventDate}</span>
              <span>📍 {eventLocation}</span>
              {eventSpeaker && <span>🙏 {eventSpeaker}</span>}
            </div>
            <div className="pe-detail-hero-actions">
              <button 
                className="pe-hero-cta-btn"
                onClick={() => navigate("/onlinepooja")}
              >
                🕉 Book Similar Pooja
              </button>
            </div>
          </div>
          <div className="pe-detail-hero-right">
            <div className="pe-detail-hero-img-wrapper">
              <img
                className="pe-detail-hero-featured-img"
                src={imageUrl}
                alt={event.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = img1;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pe-detail-body">
        <div className="pe-detail-container">
          {/* Info Row */}
          <div className="pe-detail-info-row">
            <div className="pe-detail-info-card">
              <span className="pe-info-label">🙏 Speaker / Anushthan</span>
              <span className="pe-info-value">{eventSpeaker}</span>
            </div>
            <div className="pe-detail-info-card">
              <span className="pe-info-label">📅 Event Date</span>
              <span className="pe-info-value">{eventDate}</span>
            </div>
            <div className="pe-detail-info-card">
              <span className="pe-info-label">📍 Location</span>
              <span className="pe-info-value">{eventLocation}</span>
            </div>
          </div>

          {/* Description */}
          <div className="pe-detail-section">
            <h2>About This Event</h2>
            <p className="pe-detail-desc">{event.description}</p>
          </div>

          {/* Highlights */}
          {highlightsList.length > 0 && (
            <div className="pe-detail-section">
              <h2>Event Highlights</h2>
              <div className="pe-highlights-grid">
                {highlightsList.map((h, i) => (
                  <div className="pe-highlight-item" key={i}>
                    <span className="pe-highlight-icon">✅</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {galleryList.length > 0 && (
            <div className="pe-detail-section">
              <h2>📸 Event Gallery</h2>
              <div className="pe-gallery-grid">
                {galleryList.map((img, i) => (
                  <div className="pe-gallery-img" key={i}>
                    <img
                      src={getImageUrl(img)}
                      alt={`event-gallery-${i}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = img1;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pe-detail-cta">
            <h3>Want to book a similar event or pooja?</h3>
            <button
              className="pe-cta-btn"
              onClick={() => navigate("/onlinepooja")}
            >
              Book a Pooja Now 🙏
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastEventDetailPage;

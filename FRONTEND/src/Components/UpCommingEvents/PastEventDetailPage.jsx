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
    if (!image) return img1;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || "";
    return `${backendBase}/uploads/${image}`;
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

  return (
    <div className="pe-detail-page">
      {/* Hero */}
      <section
        className="pe-detail-hero"
        style={{ backgroundImage: `url(${imageUrl}), linear-gradient(135deg, #431407, #7c2d12)` }}
      >
        <div className="pe-detail-hero-overlay" />
        <div className="pe-detail-hero-content">
          <button className="pe-back-btn" onClick={() => navigate("/past-events")}>
            ← Back to Events
          </button>
          <span className="pe-detail-tag">✨ Past Event</span>
          <h1>{event.title}</h1>
          <div className="pe-detail-meta">
            <span>📅 {eventDate}</span>
            <span>📍 {eventLocation}</span>
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
          {event.highlights && event.highlights.length > 0 && (
            <div className="pe-detail-section">
              <h2>Event Highlights</h2>
              <div className="pe-highlights-grid">
                {event.highlights.map((h, i) => (
                  <div className="pe-highlight-item" key={i}>
                    <span className="pe-highlight-icon">✅</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="pe-detail-section">
              <h2>📸 Event Gallery</h2>
              <div className="pe-gallery-grid">
                {event.gallery.map((img, i) => (
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

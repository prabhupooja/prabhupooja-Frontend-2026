import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";
import EventForm from "./EventForm";
import useAuthStore from "../../Store/UserStore/userAuthStore";

// High quality divine fallback image
import defaultLatestImg from "../Assets/adhiyogi1.jpg";

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
        if (response.data?.success && response.data?.data) {
          setEvent(response.data.data);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching event detail:", error);
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
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Event Not Found (कार्यक्रम नहीं मिला)</h2>
        <p style={{ color: "#666", margin: "15px 0 25px" }}>The requested event details could not be found.</p>
        <button className="pe-card-btn" onClick={() => navigate("/latest-events")}>
          ← Back to Latest Events
        </button>
      </div>
    );
  }

  const currentEvent = event;

  const getImageUrl = (image) => {
    if (!image || image === "null" || image === "undefined") return defaultLatestImg;
    const cleanImg = typeof image === "string" ? image.trim() : "";
    if (!cleanImg || cleanImg === "null" || cleanImg === "undefined") return defaultLatestImg;
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

  const imageUrl = getImageUrl(currentEvent.image);

  return (
    <div className="pe-detail-page">
      {/* Detail Hero */}
      <section className="pe-detail-hero">
        <img
          className="pe-detail-hero-bg-img"
          src={imageUrl}
          alt={currentEvent.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultLatestImg;
          }}
        />
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

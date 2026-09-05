import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";

// Default placeholder images if event image is missing
import img1 from "../Assets/Sounds/55.jpeg";
import img2 from "../Assets/pooja-img.jpg";
import img3 from "../Assets/adhiyogi2.jpg";

const PastEventsPage = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image, index = 0) => {
    const fallbacks = [img1, img2, img3];
    if (!image) return fallbacks[index % fallbacks.length];
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || "";
    return `${backendBase}/uploads/${image}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPastEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=past");
        if (response.data?.success && Array.isArray(response.data?.data)) {
          setPastEvents(response.data.data);
        } else {
          setPastEvents([]);
        }
      } catch (error) {
        console.error("Error fetching past events:", error);
        setPastEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPastEvents();
  }, []);

  const displayEvents = pastEvents;

  return (
    <div className="past-events-page">
      {/* Hero */}
      <section className="past-events-hero">
        <div className="past-events-hero-overlay" />
        <div className="past-events-hero-content">
          <span className="past-events-hero-tag">✨ Our Spiritual Journey</span>
          <h1>Past Events (सम्पन्न हुए कार्यक्रम)</h1>
          <p>
            Relive the divine moments and blessings from our previous spiritual gatherings and events.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="past-events-grid-section">
        <div className="past-events-container">
          <div className="past-events-header">
            <h2>
              All <span>Past Events</span>
            </h2>
            <p>Browse through our archive of completed spiritual events and divine programs.</p>
          </div>

          <div className="past-events-grid">
            {loading ? (
              <p style={{ textAlign: "center", width: "100%", padding: "30px 0" }}>Loading past events...</p>
            ) : displayEvents.length === 0 ? (
              <div style={{ textAlign: "center", width: "100%", padding: "50px 20px" }}>
                <p style={{ fontSize: "1.1rem", color: "#666" }}>
                  कोई सम्पन्न कार्यक्रम उपलब्ध नहीं है। (No past events found.)
                </p>
              </div>
            ) : (
              displayEvents.map((event, index) => {
                const defaultImg = [img1, img2, img3][index % 3];
                const eventImage = getImageUrl(event.image, index);
                const eventDate = event.date_info || event.date || (event.start_date ? `${event.start_date}` : "");
                const eventSpeaker = event.speaker || event.tag || event.special_pooja || "";
                const eventLocation = event.location || event.service_type || "भारत";
                const linkUrl = event.website || event.redirect_url;

                return (
                  <div className="pe-card" key={event.id || index}>
                    <div className="pe-card-img">
                      <img
                        src={eventImage}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultImg;
                        }}
                      />
                      {eventDate && <span className="pe-card-date-badge">{eventDate}</span>}
                    </div>
                    <div className="pe-card-body">
                      <h3>{event.title}</h3>
                      {eventSpeaker && <p className="pe-card-speaker">🙏 {eventSpeaker}</p>}
                      {eventLocation && <p className="pe-card-location">📍 {eventLocation}</p>}
                      <p className="pe-card-desc">
                        {event.description?.length > 130
                          ? event.description.slice(0, 130) + "..."
                          : event.description}
                      </p>
                      <button
                        className="pe-card-btn"
                        onClick={() => {
                          if (linkUrl && (linkUrl.startsWith("http://") || linkUrl.startsWith("https://"))) {
                            window.open(linkUrl, "_blank", "noopener,noreferrer");
                          } else if (linkUrl) {
                            navigate(linkUrl.startsWith("/") ? linkUrl : `/${linkUrl}`);
                          } else {
                            navigate(`/past-events/${event.id}`);
                          }
                        }}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastEventsPage;

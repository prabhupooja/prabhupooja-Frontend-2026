import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";

const LatestEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x300?text=Prabhu+Pooja+Event";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
    return `${backendBase}/uploads/${image}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=latest");
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setEvents(response.data.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching latest events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="pe-page-container">
      {/* Hero Section */}
      <section className="pe-hero-section">
        <div className="pe-hero-content">
          <h1>Latest Events & Mahotsav</h1>
          <p>Join us in our upcoming divine spiritual gatherings.</p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="pe-grid-section">
        <div className="pe-grid-container">
          {loading ? (
            <p style={{ textAlign: "center", width: "100%", padding: "40px 0" }}>Loading events...</p>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", padding: "40px 20px" }}>
              <p style={{ fontSize: "1.1rem", color: "#666" }}>
                फिलहाल कोई नया इवेंट उपलब्ध नहीं है। हमारे आगामी विशेष अनुष्ठानों के लिए जुड़े रहें!
              </p>
            </div>
          ) : (
            events.map((event) => {
              const linkUrl = event.website || event.redirect_url;
              return (
                <div className="pe-card" key={event.id}>
                  <div className="pe-card-image">
                    <img
                      src={getImageUrl(event.image)}
                      alt={event.title}
                    />
                    {(event.date_info || event.start_date) && (
                      <div className="pe-date-badge">
                        {event.date_info || event.start_date}
                      </div>
                    )}
                  </div>
                  <div className="pe-card-content">
                    <h2 className="pe-card-title">{event.title}</h2>
                    {event.tag && (
                      <p className="pe-card-speaker">
                        <strong>Tag:</strong> {event.tag}
                      </p>
                    )}
                    {event.service_type && (
                      <p className="pe-card-location">
                        <strong>Location/Service:</strong> {event.service_type}
                      </p>
                    )}
                    <p className="pe-card-desc">
                      {event.description?.length > 100
                        ? event.description.substring(0, 100) + "..."
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
                          navigate(`/latest-events/${event.id}`);
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
      </section>
    </div>
  );
};

export default LatestEventsPage;

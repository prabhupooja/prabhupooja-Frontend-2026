import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";

// High quality divine fallback image
import defaultLatestImg from "../Assets/adhiyogi1.jpg";

const fallbackLatestEvents = [
  {
    id: 1,
    tag: "Maha Utsav",
    title: "Grand Maha Shivratri Rudrabhishek & Bhajan Sandhya",
    description:
      "Join us for the divine celebration of Maha Shivratri with continuous Rudrabhishek, Vedic chanting, special aarti, and spiritual discourses by revered pandits.",
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
  },
];

const LatestEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return defaultLatestImg;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || "";
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
          setEvents(fallbackLatestEvents);
        }
      } catch (error) {
        console.error("Error fetching latest events:", error);
        setEvents(fallbackLatestEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const displayEvents = events.length > 0 ? events : fallbackLatestEvents;

  return (
    <div className="pe-page-container">
      {/* Hero Section */}
      <section className="pe-hero-section">
        <div className="pe-hero-overlay" />
        <div className="pe-hero-content">
          <span className="pe-hero-tag">✨ दिव्य आयोजन एवं उत्सव</span>
          <h1>Latest Events & Mahotsav</h1>
          <p>Join us in our upcoming divine spiritual gatherings, yagyas, and Vedic anushthans.</p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="pe-grid-section">
        <div className="pe-grid-container">
          {loading ? (
            <p style={{ textAlign: "center", width: "100%", padding: "40px 0", color: "#666" }}>Loading events...</p>
          ) : displayEvents.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", padding: "40px 20px" }}>
              <p style={{ fontSize: "1.1rem", color: "#666" }}>
                फिलहाल कोई नया इवेंट उपलब्ध नहीं है। हमारे आगामी विशेष अनुष्ठानों के लिए जुड़े रहें!
              </p>
            </div>
          ) : (
            displayEvents.map((event) => {
              const linkUrl = event.website || event.redirect_url;
              const eventImage = getImageUrl(event.image);

              return (
                <div className="pe-card" key={event.id}>
                  <div className="pe-card-image">
                    <img
                      src={eventImage}
                      alt={event.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultLatestImg;
                      }}
                    />
                    {(event.date_info || event.start_date) && (
                      <div className="pe-date-badge">
                        📅 {event.date_info || event.start_date}
                      </div>
                    )}
                  </div>
                  <div className="pe-card-content">
                    {event.tag && (
                      <span className="pe-tag-pill">
                        ✨ {event.tag}
                      </span>
                    )}
                    <h3 className="pe-card-title">{event.title}</h3>
                    {(event.location || event.service_type) && (
                      <p className="pe-card-location">
                        📍 {event.location || event.service_type}
                      </p>
                    )}
                    <p className="pe-card-desc">
                      {event.description?.length > 130
                        ? event.description.substring(0, 130) + "..."
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

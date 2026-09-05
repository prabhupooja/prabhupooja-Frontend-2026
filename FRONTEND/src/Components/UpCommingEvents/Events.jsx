import React, { useEffect, useState } from "react";
import "./Events.css";
import img1 from "../Assets/Sounds/55.jpeg";
import img2 from "../Assets/pooja-img.jpg";
import img3 from "../Assets/adhiyogi2.jpg";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";

const Events = () => {
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
    const fetchPastEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=past");
        if (response.data.success && Array.isArray(response.data.data)) {
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

  if (!pastEvents || pastEvents.length === 0) {
    return null;
  }

  const displayEvents = pastEvents;

  return (
    <section className="events-section">
      <div className="events-section-header">
        <span className="events-section-tag">✨ सम्पन्न हुए दिव्य कार्यक्रम ✨</span>
        <h2 className="events-title">Our Past Spiritual Events</h2>
        <p className="events-subtitle">
          Relive the divine blessings from our previous grand spiritual gatherings and anushthans.
        </p>
      </div>

      <div className="events-container">
        {displayEvents.slice(0, 3).map((event, index) => {
          const defaultImg = [img1, img2, img3][index % 3];
          const eventImage = getImageUrl(event.image, index);
          const eventDate = event.date_info || event.date || (event.start_date ? `${event.start_date}` : "");
          const eventLocation = event.location || event.service_type || "भारत";
          const eventSpeaker = event.speaker || event.tag || event.special_pooja || "";
          const linkUrl = event.website || event.redirect_url;

          return (
            <div className="katha-card" key={event.id || index}>
              <div className="katha-image-wrap">
                <img
                  src={eventImage}
                  alt={event.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultImg;
                  }}
                />
                {eventDate && <span className="katha-date-chip">{eventDate}</span>}
              </div>

              <div className="katha-card-body">
                <h3 className="katha-card-title">{event.title}</h3>

                {eventSpeaker && (
                  <p className="katha-speaker">
                    <span>🙏</span> {eventSpeaker}
                  </p>
                )}

                {eventLocation && (
                  <p className="katha-location">
                    <span>📍</span> {eventLocation}
                  </p>
                )}

                <p className="katha-desc">
                  {event.description?.length > 120
                    ? event.description.substring(0, 120) + "..."
                    : event.description}
                </p>

                <button
                  className="katha-btn"
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
        })}
      </div>

      {/* View All Past Events button */}
      <div className="events-view-all">
        <button
          className="events-view-all-btn"
          onClick={() => navigate("/past-events")}
        >
          View All Past Events →
        </button>
      </div>
    </section>
  );
};

export default Events;
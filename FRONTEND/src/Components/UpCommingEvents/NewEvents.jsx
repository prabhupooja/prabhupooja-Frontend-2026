import React, { useState, useEffect } from "react";
import "./newEvents.css";
import { useNavigate } from "react-router-dom";
import EventForm from "./EventForm";
import api from "../Axios/api";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Images
import eventImg from "../Assets/events/3.png";
import bgImg from "../Assets/astrology-img.jpg";

import useAuthStore from "../../Store/UserStore/userAuthStore";

const NewEvents = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const { user } = useAuthStore();

  const getImageUrl = (image) => {
    if (!image) return eventImg;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || "";
    return `${backendBase}/uploads/${image}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=latest");
        if (response.data.success && response.data.data.length > 0) {
          setEvents(response.data.data);
        } else {
          setEvents([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching latest events:", error);
      }
    };
    fetchEvents();
  }, []);

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <>
      <section
        className="sawan-event-section"
        style={{
          backgroundImage: `url(${bgImg})`,
        }}
      >
        {/* Overlay */}
        <div className="overlay"></div>

        {/* Blur Effects */}
        <div className="blur-circle blur-one"></div>
        <div className="blur-circle blur-two"></div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          style={{ width: "100%", zIndex: 1 }}
        >
          {events.map((evt) => (
            <SwiperSlide key={evt.id}>
              <div className="event-container">
                {/* LEFT CONTENT */}
                <div className="event-content">
                  <span className="event-tag">{evt.tag || "Latest Event"}</span>

                  <h1>{evt.title}</h1>

                  <p>{evt.description}</p>

                  {/* DETAILS */}
                  <div className="event-details">
                    {evt.date_info && (
                      <div className="detail-box">
                        <h3>📅 आयोजन</h3>
                        <p>{evt.date_info}</p>
                        <p>
                          {evt.start_date && <>आरंभ: {evt.start_date} <br /></>}
                          {evt.end_date && <>समापन: {evt.end_date}</>}
                        </p>
                      </div>
                    )}

                    {evt.special_pooja && (
                      <div className="detail-box">
                        <span>
                          <h4>🕉</h4>
                          <h3> विशेष पूजा</h3>
                        </span>
                        <p>{evt.special_pooja}</p>
                      </div>
                    )}

                    {evt.service_type && (
                      <div className="detail-box">
                        <h3>📍 सेवा</h3>
                        <p>{evt.service_type}</p>
                      </div>
                    )}
                  </div>

                  {/* BUTTON */}
                  <div className="event-buttons">
                    <button className="book-btn" onClick={() => {
                      setSelectedEvent(evt);
                      setShowPopup(true);
                    }}>
                      🚩 पूजा बुक करें
                    </button>
                    <button
                      onClick={() => {
                        const externalLink = evt.website || evt.redirect_url;
                        if (externalLink && (externalLink.startsWith("http://") || externalLink.startsWith("https://"))) {
                          window.open(externalLink, "_blank", "noopener,noreferrer");
                        } else if (externalLink) {
                          navigate(externalLink.startsWith("/") ? externalLink : `/${externalLink}`);
                        } else {
                          navigate(`/latest-events/${evt.id}`);
                        }
                      }}
                      type="button"
                      className="sawan-view-btn"
                    >
                      विवरण देखें
                    </button>
                  </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="event-image">
                  <img
                    src={getImageUrl(evt.image)}
                    alt={evt.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = eventImg;
                    }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "40px" }}>
        <button
          onClick={() => navigate("/latest-events")}
          className="katha-btn"
        >
          View All Latest Events →
        </button>
      </div>

      {showPopup && (
        <EventForm 
          setShowPopup={setShowPopup} 
          eventTitle={selectedEvent?.title || ""}
          prefilledService={selectedEvent?.title || ""}
          prefilledDate={selectedEvent?.start_date || ""}
          user={user}
        />
      )}
    </>
  );
};

export default NewEvents;

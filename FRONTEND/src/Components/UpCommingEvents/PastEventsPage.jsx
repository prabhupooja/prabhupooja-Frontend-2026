import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";

// Fallback images
import img1 from "../Assets/Sounds/55.jpeg";
import img2 from "../Assets/pooja-img.jpg";
import img3 from "../Assets/adhiyogi2.jpg";

const fallbackPastEvents = [
  {
    id: 101,
    title: "Bhagwat Katha, Indore",
    speaker: "डॉ. मनोज मोहन शास्त्री जी महाराज",
    date: "अप्रैल 2026",
    location: "दौलतराम छावछरिया प्रवचन हॉल, खजराना श्रीगणेश मंदिर, इंदौर",
    description:
      "परम पूज्य डॉ. मनोज मोहन शास्त्री जी महाराज के श्रीमुख से प्रसारित दिव्य श्रीमद भागवत कथा में श्रद्धालुओं ने बड़ी संख्या में भाग लेकर आध्यात्मिक आनंद प्राप्त किया।",
    image: img1,
    website: "https://drmanojmohanshastriji.com",
  },
  {
    id: 102,
    title: "शिवपुरी नववर्ष महोत्सव 2026",
    speaker: "सहस्त्र चंडी महायज्ञ",
    date: "मार्च 2026",
    location: "शिवपुरी, मध्य प्रदेश",
    description:
      "विश्व कल्याण एवं परिवार की शांति-समृद्धि हेतु इस पवित्र सहस्त्र चंडी महायज्ञ में भाग लें। इस महायज्ञ में भाग लेकर आप अपने जीवन को आध्यात्मिक ऊर्जा से आलोकित कर सकते हैं।",
    image: img2,
    website: "https://shivpurikatha.com/",
  },
  {
    id: 2,
    title: "Shravan Somwar Akhand Mahapuja",
    speaker: "आचार्य पंडित समूह",
    date: "14th August 2025",
    location: "Prabhu Pooja Dham, Haridwar",
    description:
      "A grand gathering of devotees witnessed the sacred Somwar Mahapuja with over 10,000 online and offline participants.",
    image: img3,
    website: null,
  },
];

const PastEventsPage = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image, index = 0) => {
    const fallbacks = [img1, img2, img3];
    if (!image) return fallbacks[index % fallbacks.length];
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
    return `${backendBase}/uploads/${image}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPastEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=past");
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          const apiData = response.data.data;
          const merged = [...apiData];
          fallbackPastEvents.forEach((fb) => {
            if (!merged.some((m) => String(m.title).toLowerCase().includes(String(fb.title).toLowerCase().slice(0, 8)))) {
              merged.push(fb);
            }
          });
          setPastEvents(merged);
        } else {
          setPastEvents(fallbackPastEvents);
        }
      } catch (error) {
        console.error("Error fetching past events:", error);
        setPastEvents(fallbackPastEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchPastEvents();
  }, []);

  const displayEvents = pastEvents.length > 0 ? pastEvents : fallbackPastEvents;

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

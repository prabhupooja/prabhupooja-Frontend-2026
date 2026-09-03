import React, { useEffect, useState } from "react";
import "./Events.css";
import img1 from "../Assets/Sounds/55.jpeg";
import img2 from "../Assets/pooja-img.jpg";
import img3 from "../Assets/adhiyogi2.jpg";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";

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

const Events = () => {
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
    const fetchPastEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=past");
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // Merge API data with fallbacks so all past events remain visible
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
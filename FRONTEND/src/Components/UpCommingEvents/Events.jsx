import React, { useEffect, useState } from "react";
import "./Events.css";
import img1 from "../Assets/Sounds/55.jpeg";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";

const fallbackPastEvents = [
  {
    id: 2,
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
    id: 1,
    title: "शिवपुरी नववर्ष महोत्सव 2026",
    speaker: "सहस्त्र चंडी महायज्ञ",
    date: "मार्च 2026",
    location: "शिवपुरी, मध्य प्रदेश",
    description:
      "विश्व कल्याण एवं परिवार की शांति-समृद्धि हेतु इस पवित्र सहस्त्र चंडी महायज्ञ में भाग लें। इस महायज्ञ में भाग लेकर आप अपने जीवन को आध्यात्मिक ऊर्जा से आलोकित कर सकते हैं और अपने परिवार के लिए सुख-समृद्धि की कामना कर सकते हैं।",
    image: "https://shivpurikatha.com/assets/1-CDLcTgCy.jpeg",
    website: "https://shivpurikatha.com/",
  },
];

const Events = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return img1;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
    return `${backendBase}/uploads/${image}`;
  };

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const response = await api.get("/events/getall?type=past");
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setPastEvents(response.data.data);
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
      <h2 className="events-title">✨ Past Events (सम्पन्न हुए कार्यक्रम) ✨</h2>

      <div className="events-container">
        {displayEvents.slice(0, 4).map((event) => {
          const eventImage = getImageUrl(event.image);
          const eventDate = event.date_info || event.date || (event.start_date ? `${event.start_date}` : "");
          const eventLocation = event.location || event.service_type || "भारत";
          const eventSpeaker = event.speaker || event.tag || event.special_pooja || "";
          const linkUrl = event.website || event.redirect_url;

          return (
            <div className="katha-wrapper" key={event.id}>
              <div className="katha-image">
                <img src={eventImage} alt={event.title} />
              </div>

              <div className="katha-info">
                <h3>{event.title}</h3>

                {eventSpeaker && (
                  <p className="katha-speaker">
                    <strong>{eventSpeaker}</strong>
                  </p>
                )}

                <div className="katha-meta">
                  {eventDate && <p>📅 {eventDate}</p>}
                  {eventLocation && <p>📍 {eventLocation}</p>}
                </div>

                <p className="katha-text">
                  {event.description?.length > 150
                    ? event.description.substring(0, 150) + "..."
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
                  View Details
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
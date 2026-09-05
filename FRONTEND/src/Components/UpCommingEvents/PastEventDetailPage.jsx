import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PastEvents.css";
import api from "../Axios/api";

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
      "परम पूज्य डॉ. मनोज मोहन शास्त्री जी महाराज के श्रीमुख से प्रसारित दिव्य श्रीमद भागवत कथा में श्रद्धालुओं ने बड़ी संख्या में भाग लेकर आध्यात्मिक आनंद प्राप्त किया। इस 7 दिवसीय भागवत कथा में हजारों श्रद्धालुओं ने भाग लिया और आध्यात्मिक ज्ञान प्राप्त किया।",
    image: img1,
    gallery: [img1, img2, img3],
    highlights: [
      "7 दिवसीय भागवत कथा का भव्य आयोजन",
      "श्रद्धालुओं की रिकॉर्ड भागीदारी",
      "प्रसाद वितरण एवं भंडारा",
      "लाइव स्ट्रीमिंग की सुविधा",
    ],
  },
  {
    id: 102,
    title: "शिवपुरी नववर्ष महोत्सव 2026",
    speaker: "सहस्त्र चंडी महायज्ञ",
    date: "मार्च 2026",
    location: "शिवपुरी, मध्य प्रदेश",
    description:
      "विश्व कल्याण एवं परिवार की शांति-समृद्धि हेतु इस पवित्र सहस्त्र चंडी महायज्ञ में भाग लेने का अवसर मिला। इस महायज्ञ में भाग लेकर भक्तगण अपने जीवन को आध्यात्मिक ऊर्जा से आलोकित कर सके और परिवार के लिए सुख-समृद्धि की कामना की।",
    image: img2,
    gallery: [img2, img1, img3],
    highlights: [
      "सहस्त्र कुंडीय यज्ञ का आयोजन",
      "108 विद्वान पंडितों द्वारा अनुष्ठान",
      "विशाल कलश यात्रा",
      "निःशुल्क भंडारा प्रसाद",
    ],
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
    gallery: [img3, img1, img2],
    highlights: [
      "24 घंटे अखंड रुद्राभिषेक",
      "हजारों भक्तों का समागम",
      "विशेष महाआरती एवं भस्म आरती",
      "महाप्रसाद वितरण",
    ],
  },
];

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
        if (response.data.success && response.data.data) {
          setEvent(response.data.data);
        } else {
          const fallback = fallbackPastEvents.find((e) => String(e.id) === String(id));
          setEvent(fallback || fallbackPastEvents[0]);
        }
      } catch {
        const fallback = fallbackPastEvents.find((e) => String(e.id) === String(id));
        setEvent(fallback || fallbackPastEvents[0]);
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

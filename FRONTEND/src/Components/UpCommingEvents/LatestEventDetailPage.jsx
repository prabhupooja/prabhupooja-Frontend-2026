import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import "./PastEvents.css";
import EventForm from "./EventForm";
import useAuthStore from "../../Store/UserStore/userAuthStore";

const LatestEventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  
  // Get user details if logged in
  const { user } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/get/${id}`);
        if (response.data.success) {
          setEvent(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching event detail:", error);
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
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Event not found</h2>
        <button onClick={() => navigate("/latest-events")} className="pe-card-btn">
          Back to Events
        </button>
      </div>
    );
  }

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/1200x600";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const backendBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
    return `${backendBase}/uploads/${image}`;
  };

  const imageUrl = getImageUrl(event.image);

  return (
    <div className="pe-detail-container">
      {/* Detail Hero */}
      <section
        className="pe-detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${imageUrl}')`,
        }}
      >
        <div className="pe-detail-hero-content">
          <button className="pe-back-btn" onClick={() => navigate("/latest-events")}>
            ← Back to Events
          </button>
          <h1>{event.title}</h1>
          <p>{event.tag}</p>
        </div>
      </section>

      <section className="pe-detail-body">
        <div className="pe-info-row">
          <div className="pe-info-box">
            <span>📅 Date</span>
            <p>{event.date_info || (event.start_date ? `${event.start_date} - ${event.end_date}` : "Upcoming")}</p>
          </div>
          <div className="pe-info-box">
            <span>🕉 Special Pooja</span>
            <p>{event.special_pooja || "Special Anushthan"}</p>
          </div>
          <div className="pe-info-box">
            <span>📍 Location / Service</span>
            <p>{event.service_type || "Online & Offline"}</p>
          </div>
        </div>

        <div className="pe-content-section">
          <h2>About this Event</h2>
          <p>{event.description}</p>
        </div>

        {/* CTA Section */}
        <div className="pe-cta-section" style={{ marginTop: '50px' }}>
          <h2>Join Us in this Divine Journey</h2>
          <p>Book your pooja online now and receive divine blessings.</p>
          <button className="pe-card-btn" style={{ fontSize: '1.2rem', padding: '15px 30px' }} onClick={() => setShowPopup(true)}>
            Book Now 🙏
          </button>
        </div>
      </section>

      {/* Booking Form Integration */}
      {showPopup && (
        <EventForm 
          setShowPopup={setShowPopup} 
          prefilledService={event.title} 
          prefilledDate={event.start_date} 
          user={user}
        />
      )}
    </div>
  );
};

export default LatestEventDetailPage;

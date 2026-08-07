import React, { useState } from "react";
import "./newEvents.css";
import { useNavigate } from "react-router-dom";
import EventForm from "./EventForm";

// Images
import eventImg from "../Assets/events/3.png";
import bgImg from "../Assets/astrology-img.jpg";


const NewEvents = () => {
  const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

  

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

        <div className="event-container">
          {/* LEFT CONTENT */}
          <div className="event-content">
            <span className="event-tag">🕉 सावन महोत्सव 2026</span>

            <h1>
              महा रुद्राभिषेक <br />
              
            </h1>

            <p>
              भगवान शिव की दिव्य कृपा प्राप्त करें और सावन के पावन महीने में घर
              बैठे ऑनलाइन एवं ऑफलाइन रुद्राभिषेक पूजा बुक करें।
            </p>

            {/* DETAILS */}
            <div className="event-details">
              <div className="detail-box">
                <h3>📅 आयोजन</h3>
                <p>संपूर्ण सावन मास 2026</p>
                <p>
                  आरंभ: 30 जुलाई 2026 <br />
                  समापन: 28 अगस्त 2026
                </p>
              </div>

              <div className="detail-box">
                <span>
                  <h4>🕉</h4>
                  <h3> विशेष पूजा</h3>
                </span>
                <p>रुद्राभिषेक</p>
              </div>

              <div className="detail-box">
                <h3>📍 सेवा</h3>
                <p>ऑनलाइन एवं ऑफलाइन पूजा सुविधा</p>
              </div>
            </div>

            {/* BUTTON */}
            <div className="event-buttons">
              <button className="book-btn" onClick={() => setShowPopup(true)}>
                🚩 पूजा बुक करें
              </button>
              <button
                onClick={() => navigate("/sawan-festival")}
                type="button"
                className="sawan-view-btn"
              >
                विवरण देखें
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="event-image">
            <img src={eventImg} alt="Rudrabhishek" />
          </div>
        </div>
      </section>

      {/* POPUP */}
      {/* POPUP */}

      {showPopup && (
        <EventForm setShowPopup={setShowPopup} />
      )}
    </>
  );
};

export default NewEvents;



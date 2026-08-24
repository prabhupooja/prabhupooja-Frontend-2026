import React, { useEffect, useState } from "react";
import "./HanumanEventPopup.css";

import eventImg from "../Assets/Sounds/1.png";
import sathaImg from "../Assets/Sounds/2.png";

const HanumanEventPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div className="hanuman-event-popup-overlay">

      <div className="hanuman-event-popup">

        <button
          className="hanuman-event-popup-close"
          onClick={() => setShowPopup(false)}
        >
          ✕
        </button>

        <div className="hanuman-event-banner">
          <img src={eventImg} alt="शिवपुरी नववर्ष महोत्सव" />

          <div className="hanuman-event-banner-text">
            <h2>शिवपुरी नववर्ष महोत्सव</h2>
            <h3>सहस्त्र चंडी महायज्ञ</h3>
          </div>
        </div>

        <div className="hanuman-event-content">

          <div className="hanuman-event-images">
            <img src={sathaImg} alt="हनुमान साठा" />
          </div>

          <p className="hanuman-event-description">
            इस पावन अवसर पर **हनुमान साठा** जो कि
            पवित्र वैदिक मंत्रों से मंत्रित होगा।
            श्रद्धालु मात्र **₹1 में प्री-बुकिंग** कर सकते हैं।
          </p>

          <div className="hanuman-event-price">
            प्री-बुकिंग शुल्क ₹1
          </div>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfb7RVF7XfqD9j3OVBY_ywp_nucGA0pU-OU74iSlOXMjirC1w/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="hanuman-event-book-btn"
          >
            अभी प्री-बुक करें
          </a>

        </div>

      </div>

    </div>
  );
};

export default HanumanEventPopup;
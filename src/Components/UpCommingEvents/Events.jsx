import React from "react";
import "./Events.css";
import img1 from "../Assets/Sounds/55.jpeg";

const Events = () => {
  const eventsData = [
        {
  id: 2,
  title: "Bhagwat Katha, Indore",
  speaker: "डॉ. मनोज मोहन शास्त्री जी महाराज",
  date: "अप्रैल 2026",
  location:
    "दौलतराम छावछरिया प्रवचन हॉल, खजराना श्रीगणेश मंदिर, इंदौर",
  description:
    "परम पूज्य डॉ. मनोज मोहन शास्त्री जी महाराज के श्रीमुख से प्रसारित दिव्य श्रीमद भागवत कथा में श्रद्धालुओं ने बड़ी संख्या में भाग लेकर आध्यात्मिक आनंद प्राप्त किया।",
  image: img1,
  website: "https://drmanojmohanshastriji.com",
},
    {
      id: 1,
      title: "शिवपुरी नववर्ष महोत्सव 2026",
      speaker: "सहस्त्र चंडी महायज्ञ",
      date: "मार्च 2025",
      location: "शिवपुरी , मध्य प्रदेश",
      description:
        "विश्व कल्याण एवं परिवार की शांति-समृद्धि हेतु इस पवित्र सहस्त्र चंडी महायज्ञ में भाग लें । इस महायज्ञ में भाग लेकर आप अपने जीवन को आध्यात्मिक ऊर्जा से आलोकित कर सकते हैं और अपने परिवार के लिए सुख-समृद्धि की कामना कर सकते हैं।",
      image: "https://shivpurikatha.com/assets/1-CDLcTgCy.jpeg",
      website: "https://shivpurikatha.com/",
    }


  ];

  return (
    <section className="events-section">
      <h2 className="events-title">✨ Past Events ✨</h2>

      <div className="events-container">
        {eventsData.map((event) => (
          <div className="katha-wrapper" key={event.id}>
            <div className="katha-image">
              <img src={event.image} alt="event" />
            </div>

            <div className="katha-info">
              <h3>{event.title}</h3>

              <p className="katha-speaker">
                <strong>{event.speaker}</strong>
              </p>

              <div className="katha-meta">
                <p>📅 {event.date}</p>
                <p>📍 {event.location}</p>
              </div>

              <p className="katha-text">{event.description}</p>

              <button className="katha-btn"
               onClick={() =>
              window.open(event.website, "_blank")
            }
              >View Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
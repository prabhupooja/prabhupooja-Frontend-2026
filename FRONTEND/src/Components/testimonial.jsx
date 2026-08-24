import React, { useState, useEffect } from "react";
import "../styles/testimonial.css";

import customerimg from "../Components/Assets/customerreview.jpeg"
import customerimg1 from "../Components/Assets/customerreview1.jpeg"
import customerimg2 from "../Components/Assets/customerreview2.jpeg"

import NewLoader from "./NewLoader/NewLoader";

function Testimonial() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <>
        <div>
          <NewLoader />
        </div>
      </>
    );
  }

  const testimonials = [
    {
      text: "I recently used Prabhu Puja’s online puja services, and I must say, the experience was truly divine. The process was simple, and the prasad delivery was timely and beautifully packaged.",
      name: "Sharvan Sharma",
      role: "Customer",
      image: customerimg,
    },
    {
      text: "The astrology services offered by Prabhu Puja are incredible. I had a consultation for my career, and the insights were spot-on. The astrologer was knowledgeable and provided me with practical advice.",
      name: "Rajesh Kumar",
      role: "Devotee",
      image: customerimg1,
    },
    {
      text: "Prabhu Puja’s services are exceptional! The online puja was done with utmost care, and the pandit was very professional. I felt the positive energy from the ceremony, and it truly helped me in my personal life.",
      name: "Deepak Singh",
      role: "Client",
      image: customerimg2,
    },
    // {
    //   text: "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.",
    //   name: "Micheal Worin",
    //   role: "Product Designer",
    //   image: customerimg3,
    // },
    // {
    //   text: "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.",
    //   name: "Micheal Worin",
    //   role: "Product Designer",
    //   image: customerimg4,
    // },
  ];

  return (
    <>
      <section className="testimonial_section">
        <div className="testimonial_content">
          <h1>Hear from our customers</h1>
          <p>
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release
          </p>
        </div>
        <div className="testimonial_box">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial_para">
              <p>{testimonial.text}</p>
              <div className="testimonial_fullcontent">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="testimonial_headpara">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Testimonial;

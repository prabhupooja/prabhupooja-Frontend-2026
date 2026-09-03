import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/testimonial.css";
import { FaStar, FaQuoteLeft, FaCheckCircle, FaPrayingHands } from "react-icons/fa";
import NewLoader from "./NewLoader/NewLoader";

import customerimg from "./Assets/customerreview.jpeg";
import customerimg1 from "./Assets/customerreview1.jpeg";
import customerimg2 from "./Assets/customerreview2.jpeg";
import customerimg4 from "./Assets/customerreview4.jpeg";
import customerimg5 from "./Assets/customerreview5.jpeg";
import profileimg from "./Assets/profileimg.png";

function Testimonial() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sharvan Sharma",
      location: "Indore, Madhya Pradesh",
      category: "pooja",
      service: "Mahamrityunjaya Jaap & Havan",
      rating: 5,
      date: "August 2026",
      text: "I booked the Mahamrityunjaya Jaap for my father's health. The live video streaming was crystal clear, and the Pandit ji recited all family gotra details with pure Sanskrit pronunciation. The positive energy was truly palpable.",
      image: customerimg,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "New Delhi",
      category: "astro",
      service: "Career & Kundali Consultation",
      rating: 5,
      date: "July 2026",
      text: "The astrology consultation by Prabhu Pooja exceeded my expectations. The astrologer provided deep insights into my Mahadasha transitions and suggested very practical, sattvic remedies that brought immense clarity.",
      image: customerimg1,
    },
    {
      id: 3,
      name: "Deepak Singh",
      location: "Mumbai, Maharashtra",
      category: "pooja",
      service: "Kaal Sarp Dosh Nivaran Pooja",
      rating: 5,
      date: "June 2026",
      text: "Conducting the Ujjain Trimbakeshwar Kaal Sarp Dosh online seemed doubtful at first, but Prabhu Pooja's team handled everything with complete transparency. We received the consecrated prasad and energized yantra within 3 days!",
      image: customerimg2,
    },
    {
      id: 4,
      name: "Ananya Deshmukh",
      location: "Pune, Maharashtra",
      category: "prasad",
      service: "Mahakaleshwar Temple Prasad",
      rating: 5,
      date: "August 2026",
      text: "Received the Mahakal Bhasma and Bada Ganpati prasad box. The packaging is pure, hygienic, and smells of fresh sandalwood. Felt like I visited the holy shrine in person. Highly recommended for all devotees!",
      image: customerimg4,
    },
    {
      id: 5,
      name: "Vikramaditya Rao",
      location: "Bengaluru, Karnataka",
      category: "pooja",
      service: "Rudra Abhishek Live Pooja",
      rating: 5,
      date: "July 2026",
      text: "The two-way HD interaction made the Shivratri Rudrabhishek feel like the Pandit ji was right in our home temple. Our entire family took the sankalp together. Har Har Mahadev!",
      image: customerimg5,
    },
    {
      id: 6,
      name: "Pooja & Amit Singhal",
      location: "Dallas, Texas (USA)",
      category: "pooja",
      service: "Griha Pravesh & Vastu Shanti",
      rating: 5,
      date: "May 2026",
      text: "Living in the USA, getting an authentic Vedic Pandit on our auspicious date was difficult. Prabhu Pooja coordinated everything perfectly according to our local time zone. Our new home feels blessed.",
      image: profileimg,
    },
  ];

  const filteredTestimonials =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === filter);

  if (loading) {
    return <NewLoader />;
  }

  return (
    <div className="testimonial_page_wrapper">
      {/* Hero Subheader */}
      <div className="sub_header_testimonial_new">
        <div className="overlay_testimonial"></div>
        <div className="container">
          <div className="subheader_inner_testimonial">
            <div className="subheader_text_testimonial">
              <span className="hero_badge_testimonial">⭐ 50,000+ Happy Devotees</span>
              <h1>Devotee Testimonials & Blessings</h1>
              <p>Real stories of faith, divine solace, and spiritual fulfillment from our global family.</p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Brand Info</li>
                <li className="breadcrumb-item active">Testimonials</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <section className="testimonials_main_section">
        <div className="container">
          {/* Header & Filter Tabs */}
          <div className="reviews_filter_header">
            <div className="overall_rating_badge">
              <span className="big_star"><FaStar /></span>
              <span className="score">4.9 / 5.0</span>
              <span className="count">(5,200+ Verified Devotee Reviews)</span>
            </div>

            <div className="review_tabs">
              <button
                className={`tab_pill ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Stories ({testimonials.length})
              </button>
              <button
                className={`tab_pill ${filter === "pooja" ? "active" : ""}`}
                onClick={() => setFilter("pooja")}
              >
                🪔 Online Pooja
              </button>
              <button
                className={`tab_pill ${filter === "astro" ? "active" : ""}`}
                onClick={() => setFilter("astro")}
              >
                🔮 Astrology
              </button>
              <button
                className={`tab_pill ${filter === "prasad" ? "active" : ""}`}
                onClick={() => setFilter("prasad")}
              >
                📦 Temple Prasad
              </button>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="row g-4 mt-1">
            {filteredTestimonials.map((review) => (
              <div key={review.id} className="col-12 col-md-6 col-lg-4">
                <div className="premium_review_card">
                  <div className="review_card_top">
                    <div className="stars_row">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="gold_star" />
                      ))}
                    </div>
                    <span className="review_date">{review.date}</span>
                  </div>

                  <span className="service_badge_review">
                    <FaPrayingHands className="me-1" /> {review.service}
                  </span>

                  <div className="quote_icon_wrap">
                    <FaQuoteLeft />
                  </div>

                  <p className="review_text">"{review.text}"</p>

                  <div className="reviewer_profile_row">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="reviewer_avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profileimg;
                      }}
                    />
                    <div className="reviewer_meta">
                      <h4>
                        {review.name} <FaCheckCircle className="verified_icon" title="Verified Devotee" />
                      </h4>
                      <p>{review.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Your Story CTA */}
          <div className="share_experience_cta">
            <div className="cta_content">
              <h3>Have you experienced Prabhu Pooja's sacred services?</h3>
              <p>Share your spiritual feedback or sankalp experience to inspire millions of fellow devotees.</p>
            </div>
            <Link to="/feedbackform" className="btn_feedback_gold">
              Share Your Feedback →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Testimonial;

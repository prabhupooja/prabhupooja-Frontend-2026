import React, { useState, useEffect } from "react";
import "../../styles/about.css";
import { Link } from "react-router-dom";
import { 
  FaOm, 
  FaHandsPraying, 
  FaAward, 
  FaShieldHalved, 
  FaTruckFast, 
  FaStar,
  FaCheck
} from "react-icons/fa6";
import aboutimg from "../Assets/about-img.jpeg";
import aboutusimg from "../Assets/aboutusimg.png";
import NewLoader from "../NewLoader/NewLoader";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <NewLoader />;
  }

  const milestones = [
    { number: "50,000+", label: "Vedic Poojas Conducted", icon: "🪔" },
    { number: "150+", label: "Certified Gurukul Pandits", icon: "🕉️" },
    { number: "25+", label: "Historic Partner Temples", icon: "🏛️" },
    { number: "4.9 ★", label: "Devotee Trust Rating", icon: "⭐" },
  ];

  const corePillars = [
    {
      title: "100% Shastra Compliant",
      desc: "Every ritual strictly adheres to ancient Vedic texts, Vedic samagri standards, and precise muhurats.",
      icon: <FaOm />,
    },
    {
      title: "Certified Gurukul Acharyas",
      desc: "Our pandits are rigorously vetted and trained in traditional Gurukuls like Kashi, Ujjain, and Haridwar.",
      icon: <FaAward />,
    },
    {
      title: "Live Virtual Participation",
      desc: "Join your personalized sankalp live from anywhere in the world with two-way HD video interaction.",
      icon: <FaHandsPraying />,
    },
    {
      title: "Doorstep Blessed Prasad",
      desc: "Directly sanctified prasad from sacred shrines, vacuum-sealed and dispatched with complete sanctity.",
      icon: <FaTruckFast />,
    },
  ];

  const servicesOffered = [
    {
      title: "Online Pooja Services",
      desc: "Personalized dosha nivaran, graha shanti, and festive rituals conducted live in your family's name.",
      link: "/onlinepooja",
      tag: "Live Streaming",
    },
    {
      title: "Vedic Astrology Consultations",
      desc: "Accurate birth chart Kundali readings, career, marriage, and health remedies by seasoned astrologers.",
      link: "/astrology",
      tag: "Call & Chat",
    },
    {
      title: "Prasad Delivery",
      desc: "Authentic Mahaprasad from historic temples like Mahakaleshwar, Khajrana Ganesh, and Siddhivinayak.",
      link: "/prasaddelivery",
      tag: "Express Shipping",
    },
    {
      title: "Pure Pooja Samagri Store",
      desc: "100% pure gangajal, energized rudraksha, authentic gemstones, brass idols, and herbal havan packets.",
      link: "/e-commerce",
      tag: "E-Commerce",
    },
    {
      title: "Temple Darshan & VIP Booking",
      desc: "Seamless darshan booking and specialized sevas at ancient holy shrines across India.",
      link: "/temple",
      tag: "VIP Seva",
    },
    {
      title: "Shubh Muhurat Services",
      desc: "Find the most auspicious time for Griha Pravesh, Vivah, Naamkaran, and business beginnings.",
      link: "/muhurat",
      tag: "Panchang Guided",
    },
  ];

  return (
    <div className="about_page_wrapper">
      {/* Hero Subheader */}
      <div className="sub_header_about_new">
        <div className="overlay_about"></div>
        <div className="container">
          <div className="subheader_inner_about">
            <div className="subheader_text_about">
              <span className="hero_badge_about">🕉️ Preserving Sanatan Heritage</span>
              <h1>About Prabhu Pooja</h1>
              <p>Bridging Timeless Vedic Traditions with Modern Technology for Devotees Worldwide</p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Brand Info</li>
                <li className="breadcrumb-item active">About Us</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Story Section */}
      <section className="about_story_section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about_image_composition">
                <div className="main_img_wrapper">
                  <img src={aboutimg} alt="Prabhu Pooja Devotional Ritual" className="img_main" />
                </div>
                <div className="floating_badge_card">
                  <span className="badge_icon">🕉️</span>
                  <div>
                    <h4>Sanatan Seva</h4>
                    <p>Authentic rituals at your fingertips</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about_narrative">
                <span className="section_tag">Our Sacred Calling</span>
                <h2>Bringing Divine Blessings to Every Home, Everywhere</h2>
                <p className="lead_para">
                  Welcome to <strong>Prabhu Pooja</strong>, India's trusted spiritual ecosystem dedicated to making authentic Vedic rituals, certified astrologers, and sacred temple services easily accessible to modern devotees across the globe.
                </p>
                <p className="body_para">
                  In today's fast-paced world, distance and busy schedules often keep devotees away from their spiritual roots. Prabhu Pooja bridges this sacred gap by enabling you to participate in live, personalized rituals conducted by renowned Acharyas, order pure consecrated prasad, and seek astrological guidance—all with complete transparency and devotion.
                </p>

                <div className="about_highlights_list">
                  <div className="highlight_item">
                    <span className="check_icon"><FaCheck /></span>
                    <span>Direct one-on-one live video interaction with Pandits</span>
                  </div>
                  <div className="highlight_item">
                    <span className="check_icon"><FaCheck /></span>
                    <span>Eco-friendly, authentic, and naturally sourced samagri</span>
                  </div>
                  <div className="highlight_item">
                    <span className="check_icon"><FaCheck /></span>
                    <span>Dedicated Devotee Care team assisting at every step</span>
                  </div>
                </div>

                <div className="narrative_action_btns">
                  <Link to="/enquiryform" className="btn_gold_primary">
                    Connect With Us
                  </Link>
                  <Link to="/onlinepooja" className="btn_outline_spiritual">
                    Explore Online Poojas →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Counter */}
      <section className="about_milestones_section">
        <div className="container">
          <div className="row g-4">
            {milestones.map((item, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="milestone_card">
                  <span className="milestone_icon">{item.icon}</span>
                  <h3>{item.number}</h3>
                  <p>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Dual Cards */}
      <section className="about_vision_mission_section">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="vision_mission_card vision">
                <div className="card_icon">👁️</div>
                <h3>Our Vision</h3>
                <p>
                  To become the world's most trusted, authentic, and technologically empowered Sanatan spiritual platform, reconnecting millions of global devotees with the profound wisdom, peace, and spiritual power of ancient Vedic traditions.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="vision_mission_card mission">
                <div className="card_icon">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  To preserve the sacred sanctity of Hindu rituals by partnering with certified Gurukul-trained Acharyas, ensuring 100% transparency in sankalp recitation, and delivering pure sanctified offerings with speed and heartfelt devotion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="about_pillars_section">
        <div className="container">
          <div className="section_title_center">
            <span className="sub_pill">Why Devotees Trust Us</span>
            <h2>The Four Pillars of Prabhu Pooja</h2>
            <p>Our uncompromising commitment to purity, devotion, and Vedic truth.</p>
          </div>

          <div className="row g-4 mt-2">
            {corePillars.map((pillar, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="pillar_card_modern">
                  <div className="pillar_icon_circle">{pillar.icon}</div>
                  <h4>{pillar.title}</h4>
                  <p>{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="about_services_overview">
        <div className="container">
          <div className="section_title_center">
            <span className="sub_pill">Holistic Divine Care</span>
            <h2>Everything for Your Spiritual Journey</h2>
            <p>From sacred home rituals to personalized astrological wisdom.</p>
          </div>

          <div className="row g-4 mt-2">
            {servicesOffered.map((srv, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="service_overview_card">
                  <div className="service_top_row">
                    <span className="service_tag_pill">{srv.tag}</span>
                    <Link to={srv.link} className="service_arrow_link">→</Link>
                  </div>
                  <h3>{srv.title}</h3>
                  <p>{srv.desc}</p>
                  <Link to={srv.link} className="btn_view_service">
                    Explore Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="about_cta_banner">
        <div className="container">
          <div className="cta_banner_inner">
            <div className="cta_left_text">
              <h2>Experience the Divine Grace Today</h2>
              <p>Book an auspicious pooja or consult our senior astrologers for guidance in life, career, and family harmony.</p>
            </div>
            <div className="cta_right_buttons">
              <Link to="/onlinepooja" className="btn_cta_gold">Book a Pooja Now</Link>
              <Link to="/enquiryform" className="btn_cta_outline">Contact Devotee Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

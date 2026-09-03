import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ourteam.css";
import { FaLinkedinIn, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import NewLoader from "./NewLoader/NewLoader";

import authorimg from "./Assets/authorimg.png";
import panditimg from "./Assets/pandit1.png";
import astrologerImg from "./Assets/astrologer-img.jpg";
import profileimg from "./Assets/profileimg.png";
import teamimg from "./Assets/teamimg.jpg";

function Ourteam() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Acharya Rajesh Sharma",
      role: "Head Vedic Acharya & Rituals Director",
      department: "vedic",
      category: "Vedic & Spiritual",
      image: panditimg,
      bio: "Over 22+ years of Vedic ritual expertise from Kashi Vidyapeeth, overseeing authentic sankalp procedures across India.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "acharya@prabhupooja.com",
      },
    },
    {
      id: 2,
      name: "Nikhil Bopche",
      role: "Digital Marketing & Growth Head",
      department: "growth",
      category: "Marketing & Growth",
      image: authorimg,
      bio: "Leading digital outreach and devotee engagement to connect millions of Sanatan devotees worldwide.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "nikhil@prabhupooja.com",
      },
    },
    {
      id: 3,
      name: "Rishikesh",
      role: "Lead Full Stack Architect",
      department: "tech",
      category: "Technology",
      image: teamimg,
      bio: "Architecting resilient, high-speed backend infrastructure and real-time live darshan streaming platforms.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "rishikesh@prabhupooja.com",
      },
    },
    {
      id: 4,
      name: "Kiran",
      role: "Lead UI/UX & Frontend Engineer",
      department: "tech",
      category: "Technology",
      image: profileimg,
      bio: "Crafting beautiful, responsive, and spiritually intuitive digital experiences for modern devotees.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "kiran@prabhupooja.com",
      },
    },
    {
      id: 5,
      name: "Pt. Vidya Sagar Shastri",
      role: "Senior Jyotish & Muhurat Specialist",
      department: "vedic",
      category: "Vedic & Spiritual",
      image: astrologerImg,
      bio: "Gold-medalist astrologer specializing in Vedic kundali dosha analysis, vivah muhurat, and planetary remedies.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "astrology@prabhupooja.com",
      },
    },
    {
      id: 6,
      name: "Meera Sharma",
      role: "Devotee Care & Puja Coordinator",
      department: "operations",
      category: "Operations & Care",
      image: authorimg,
      bio: "Ensuring every devotee's sankalp, family details, and ritual timings are coordinated with utmost precision.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "care@prabhupooja.com",
      },
    },
    {
      id: 7,
      name: "Suresh Patidar",
      role: "Pure Samagri & Quality Control Head",
      department: "operations",
      category: "Operations & Care",
      image: teamimg,
      bio: "Inspecting organic herbs, authentic gangajal, pure desi ghee, and consecrated prasad before dispatch.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "quality@prabhupooja.com",
      },
    },
    {
      id: 8,
      name: "Amitabh Verma",
      role: "Temple Partnerships & Logistics Lead",
      department: "growth",
      category: "Marketing & Growth",
      image: profileimg,
      bio: "Building sacred partnerships with renowned historic temples across Ujjain, Varanasi, Ayodhya, and Haridwar.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "partnerships@prabhupooja.com",
      },
    },
  ];

  const filteredMembers =
    activeTab === "all"
      ? teamMembers
      : teamMembers.filter((m) => m.department === activeTab);

  if (loading) {
    return <NewLoader />;
  }

  return (
    <div className="our_team_page_wrapper">
      {/* Hero Header */}
      <div className="sub_header_team">
        <div className="overlay_team"></div>
        <div className="container">
          <div className="subheader_inner_team">
            <div className="subheader_text_team">
              <span className="hero_badge_team">🕉️ Sanatan Seva Team</span>
              <h1>Meet Our Dedicated Team</h1>
              <p>The Passionate Minds & Vedic Scholars Guiding Prabhu Pooja's Divine Mission</p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Brand Info</li>
                <li className="breadcrumb-item active">Our Team</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Intro Mission Statement */}
      <section className="team_intro_section">
        <div className="container">
          <div className="team_intro_card">
            <h2>Serving Devotees with Sacred Dedication</h2>
            <p>
              At <strong>Prabhu Pooja</strong>, our diverse team unites certified Vedic Acharyas, seasoned astrologers, passionate technologists, and quality assurance artisans. Together, we blend timeless spiritual traditions with modern convenience to bring authentic rituals, pure consecrated samagri, and divine temple darshan directly to devotees worldwide.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="team_filter_tabs">
            <button
              className={`team_tab_btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Members ({teamMembers.length})
            </button>
            <button
              className={`team_tab_btn ${activeTab === "vedic" ? "active" : ""}`}
              onClick={() => setActiveTab("vedic")}
            >
              🪔 Vedic & Spiritual
            </button>
            <button
              className={`team_tab_btn ${activeTab === "tech" ? "active" : ""}`}
              onClick={() => setActiveTab("tech")}
            >
              💻 Tech & Engineering
            </button>
            <button
              className={`team_tab_btn ${activeTab === "operations" ? "active" : ""}`}
              onClick={() => setActiveTab("operations")}
            >
              📦 Operations & Care
            </button>
            <button
              className={`team_tab_btn ${activeTab === "growth" ? "active" : ""}`}
              onClick={() => setActiveTab("growth")}
            >
              📈 Growth & Outreach
            </button>
          </div>

          {/* Team Cards Grid */}
          <div className="row g-4 justify-content-center">
            {filteredMembers.map((member) => (
              <div key={member.id} className="col-12 col-sm-6 col-md-6 col-lg-3">
                <div className="premium_team_card">
                  <div className="team_card_header">
                    <span className="member_dept_tag">{member.category}</span>
                  </div>

                  <div className="team_avatar_frame">
                    <div className="avatar_glow_ring"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team_avatar_img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profileimg;
                      }}
                    />
                    <span className="verified_badge" title="Verified Prabhu Pooja Team">
                      <BsPatchCheckFill />
                    </span>
                  </div>

                  <div className="team_info">
                    <h3 className="member_name">{member.name}</h3>
                    <h4 className="member_role">{member.role}</h4>
                    <p className="member_bio">{member.bio}</p>
                  </div>

                  <div className="team_social_links">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} aria-label="LinkedIn" className="social_icon">
                        <FaLinkedinIn />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a href={member.social.instagram} aria-label="Instagram" className="social_icon">
                        <FaInstagram />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} aria-label="Twitter" className="social_icon">
                        <FaTwitter />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} aria-label="Email" className="social_icon">
                        <FaEnvelope />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our 3 Pillars Section */}
      <section className="team_pillars_section">
        <div className="container">
          <div className="section_heading_center">
            <span className="sub_pill">Sanatan Values</span>
            <h2>Principles That Guide Our Team</h2>
            <p>Every ritual, consultation, and package is governed by our core devotional ethos.</p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="pillar_box">
                <div className="pillar_icon_wrap">🪔</div>
                <h3>100% Vedic Sanctity</h3>
                <p>Strict adherence to Shastras, authentic Sanskrit mantras, and certified pandits trained in traditional Gurukuls.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pillar_box">
                <div className="pillar_icon_wrap">🕉️</div>
                <h3>Devotee Transparency</h3>
                <p>Live video pooja streaming, personalized sankalp recitation, and direct one-on-one communication with Acharyas.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pillar_box">
                <div className="pillar_icon_wrap">✨</div>
                <h3>Purity & Quality</h3>
                <p>Zero compromises on holy offerings, natural Ayurvedic samagri, energized gemstones, and authentic temple prasad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Join Us */}
      <section className="team_cta_section">
        <div className="container">
          <div className="team_cta_card">
            <div className="cta_content">
              <h2>Join Our Spiritual Mission</h2>
              <p>Are you a Vedic Acharya, Astrologer, or passionate technologist looking to serve Sanatan Dharma?</p>
            </div>
            <div className="cta_actions">
              <Link to="/enquiryform" className="btn_primary_gold">
                Connect With Us →
              </Link>
              <Link to="/panditform" className="btn_secondary_outline">
                Register as Pandit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Ourteam;

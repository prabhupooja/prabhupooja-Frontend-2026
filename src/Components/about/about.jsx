import React, { useState, useEffect } from "react";
import "../../styles/about.css";
import "../../styles/about.css";
import { Link } from "react-router-dom";
import aboutimg from "../Assets/about-img.jpeg";
import NewLoader from "../NewLoader/NewLoader";

const About = () => {
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

  return (
    <>
      <div className="sub_header_about">
        <div className="container">
          <div className="subheader_inner_about">
            <div className="subheader_text_about">
              <h1>About Us</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">About Us</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="about_content">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="about_img">
                <img src={aboutimg} alt="img" className="aboutsectionimg" />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="title_about">
                <h1>About Us</h1>
                <h4>
                  Welcome to Prabhu Pooja, your one-stop destination for all
                  things spiritual and divine. Our platform is dedicated to
                  bringing the essence of traditional Hindu rituals, astrology,
                  and temple services to the modern world, making them
                  accessible to everyone, everywhere.
                </h4>
              </div>

              <div className="subtitle">
                <h4>Our Mission</h4>
                <p>
                  At Prabhu Pooja, our mission is to bridge the gap between the
                  divine and the devotees. We aim to provide a seamless
                  experience for those seeking spiritual solace, guidance, and
                  blessings, right from the comfort of their homes. Whether you
                  are looking to perform a pooja, consult with an astrologer,
                  practice yoga, or receive prasadam from your favorite temple,
                  we are here to make it happen.
                </p>
              </div>

              <button className="about-btn1">
                <Link to="/enquiryform">Contact Us</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="services_section">
        <div className="container">
          <div className="service_title">
            <h1>Our Services</h1>
          </div>

          <ul className="service_list">
            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Online Pooja Services : </span>
              Experience the power of traditional poojas performed by
              experienced and certified pandits. You can book poojas for various
              occasions like birthdays, anniversaries, festivals, and special
              personal milestones. Our pandits will conduct the ceremonies live,
              allowing you to participate virtually.
            </li>

            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Astrology Consultations : </span>
              Get personalized astrological advice from renowned astrologers.
              Whether you need insights into your career, relationships, health,
              or finances, our experts are here to guide you. Our services
              include horoscope readings, birth chart analysis, and personalized
              remedies.
            </li>

            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Prasad Delivery : </span>
              Relish the sacred offerings from your beloved temples delivered
              straight to your doorstep. We partner with temples across the
              country to bring you authentic prasadam, ensuring you receive
              divine blessings no matter where you are.
            </li>

            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Pandit Booking : </span>Need a
              pandit for a home ceremony or special event? Our platform allows
              you to book knowledgeable and experienced pandits for various
              rituals, ensuring that your ceremonies are conducted with utmost
              devotion and adherence to traditional practices.
            </li>

            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Yoga Classes : </span>Embrace
              holistic wellness with our online yoga classes. Our certified yoga
              instructors offer sessions for all levels, from beginners to
              advanced practitioners. Whether you seek physical fitness, mental
              clarity, or spiritual growth, our yoga classes provide a balanced
              approach to health and well-being.
            </li>

            <li>
              <span style={{ color: "black" }}>Temple Information : </span>
              Explore detailed information about temples across India, including
              their history, significance, festivals, and visiting hours. Plan
              your pilgrimage or virtual visit with ease using our comprehensive
              temple directory.
            </li>
          </ul>
        </div>
      </div>

      <div className="whychoose_us">
        <div className="container">
          <div className="whychoose_us_title">
            <h1>Why Choose Us?</h1>
          </div>

          <ul className="whychoose_list">
            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Authenticity : </span> We are
              committed to preserving the authenticity of traditional Hindu
              practices. Our pandits, astrologers, and yoga instructors are
              well-versed in Vedic rituals and scriptures, ensuring that all
              services are conducted with precision and reverence.
            </li>

            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Convenience : </span> With our
              online platform, accessing spiritual services has never been
              easier. From booking a pooja to consulting an astrologer or
              joining a yoga class, everything is just a few clicks away.
            </li>

            <li style={{ paddingBottom: "10px" }}>
              <span style={{ color: "black" }}>Quality : </span> We partner with
              certified pandits, renowned astrologers, experienced yoga
              instructors, and reputable temples to ensure that you receive the
              highest quality of service and guidance.
            </li>

            <li>
              <span style={{ color: "black" }}>Customer Support : </span>Our
              dedicated support team is always here to assist you with any
              queries or concerns, ensuring a smooth and fulfilling spiritual
              experience.
            </li>
          </ul>
        </div>
      </div>

      <div className="community">
        <div className="container">
          <div className="community_title">
            <h1>Join Our Community</h1>
            <p>
              At Prabhu Pooja, we believe in creating a community of like-minded
              individuals who seek spiritual growth and divine blessings. Follow
              us on social media, subscribe to our newsletter, and join our
              online forums to stay connected with the latest updates, special
              offers, and spiritual insights.
            </p>
          </div>
        </div>
      </div>

      <div className="contact-us">
        <div className="container">
          <div className="contact_heading">
            <h1>Contact Us</h1>
            <p style={{ paddingBottom: "10px" }}>
              Have questions or need assistance? Feel free to reach out to us at
              <a href="mailto:enquiry@prabhupooja.com">
                <span style={{ color: "blue" }}> enquiry@prabhupooja.com </span>{" "}
              </a>
              .We are here to help you on your spiritual journey.
            </p>
            <p>
              Thank you for choosing Prabhu Pooja. May you find peace,
              prosperity, and divine blessings through our services
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

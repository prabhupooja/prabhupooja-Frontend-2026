import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PanchmukhiShaniHanumanMandir.css";

import templeImg from "../Assets/temple/01.png";

import hanumanImg from "../Assets/temple/02.jpeg";
import shaniImg from "../Assets/temple/03.jpeg";
import templeImg2 from "../Assets/temple/05.jpeg";
import templeImg3 from "../Assets/temple/04.jpeg";

const PanchmukhiShaniHanumanMandir = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booknowform");
  };

  return (
    <>
      {/* Hero Section */}
      <div className="sub_header_pshm">
        <div className="overlay_pshm"></div>

        <div className="container">
          <div className="subheader_inner_pshm">
            <div className="subheader_text_pshm">
              <h1>Panchmukhi Shani</h1>
              <h1>Hanuman Mandir</h1>
            </div>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">
                  Panchmukhi Shani Hanuman Mandir
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Temple Details */}
      <div className="pshm_section">
        <div className="container">
          <div className="row align-items-start">
            {/* Left Side */}
            <div className="col-lg-5 col-md-12">
              <div className="image_card_pshm">
                <span className="tag_pshm">Divine Temple</span>

                <img
                  src={templeImg}
                  alt="Panchmukhi Shani Hanuman Mandir"
                  className="templeimg_pshm"
                />
              </div>

              <div className="image_gallery_pshm">
                <img
                  src={hanumanImg}
                  alt="Panchmukhi Hanuman Ji"
                  className="gallery_img_pshm"
                />
                <img
                  src={shaniImg}
                  alt="Lord Shanidev"
                  className="gallery_img_pshm"
                />
                <img
                  src={templeImg2}
                  alt="Temple Architecture"
                  className="gallery_img_pshm"
                />
                <img
                  src={templeImg3}
                  alt="Temple Architecture"
                  className="gallery_img_pshm"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="col-lg-7 col-md-12">
              <div className="temple_content_pshm">
                {/* Buttons */}
                <div className="button_group_pshm">
                  <Link className="primary_btn_pshm" to="/enquiryform">
                    Enquiry Now
                  </Link>

                  <a
                    className="primary_btn_pshm facebook"
                    href="https://www.facebook.com/profile.php?id=61565211141697"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-facebook-f" />
                    Facebook
                  </a>

                  <a
                    className="primary_btn_pshm whatsapp"
                    href="https://wa.me/7225016699?text=Namaste"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp" />
                    Whatsapp
                  </a>

                  <button className="primary_btn_pshm orange" onClick={handleBookNow}>
                    Book Now
                  </button>
                </div>

                <h2 className="heading_pshm">
                  Panchmukhi Shani Hanuman Mandir
                </h2>

                <p>
                  Panchmukhi Shani Hanuman Mandir is a sacred spiritual place
                  devoted to Lord Shanidev, Panchmukhi Hanuman Ji, and Lord
                  Shiva. Devotees visit this temple to seek protection,
                  positivity, strength, peace, and relief from negative
                  planetary effects.
                </p>

                <p>
                  The divine atmosphere of the temple creates a feeling of
                  devotion and inner peace. Regular पूजा, अभिषेक, मंत्र जाप, and
                  विशेष आराधना are performed here with great faith and
                  dedication.
                </p>

                <p>
                  Panchmukhi Hanuman Ji is worshipped for courage, protection,
                  and spiritual power, while Lord Shanidev is worshipped to
                  reduce hardships and bring discipline, justice, and success in
                  life.
                </p>

                {/* Pooja Section */}
                <div className="info_box_pshm">
                  <h3>🕉️ पूजा एवं अनुष्ठान</h3>

                  <ul>
                    <li>शनिदेव अभिषेक</li>
                    <li>शनि स्तुति पाठ</li>
                    <li>नवग्रह स्तोत्र पाठ</li>
                    <li>पंचमुखी हनुमान चालीसा पाठ</li>
                    <li>1008 कवच मंत्र जाप</li>
                    <li>शिव पंचामृत स्नान</li>
                    <li>विशेष शिव आराधना</li>
                  </ul>
                </div>

                {/* History */}
                <div className="info_box_pshm">
                  <h3>📖 Temple Significance</h3>

                  <p>
                    This temple is known among devotees for its spiritual energy
                    and peaceful environment. Many devotees visit on Saturdays,
                    Hanuman Jayanti, and special Shiv पूजा occasions to perform
                    prayers and seek blessings.
                  </p>

                  <p>
                    The temple represents faith, devotion, and divine energy,
                    where devotees gather to perform पूजा and experience
                    spiritual positivity.
                  </p>
                </div>

                {/* Timing */}
                <div className="info_box_pshm">
                  <h3>🕰️ Temple Timings</h3>

                  <ul>
                    <li>Morning Darshan - 6:00 AM to 12:00 PM</li>
                    <li>Evening Darshan - 4:00 PM to 9:00 PM</li>
                    <li>Special Saturday Pooja Available</li>
                  </ul>
                </div>

                {/* Location */}
                <div className="location_box_pshm">
                  <h3>📍 Temple Location</h3>

                  <a
                    href="https://share.google/ARpxTZuexHY8VobeJ"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Location on Google Maps
                  </a>
                </div>

                <div className="bottom_text_pshm">
                  <h4>🌺 जय श्री शनिदेव 🌺</h4>
                  <h4>🌺 जय पंचमुखी हनुमान 🌺</h4>
                  <h4>🌺 हर हर महादेव 🌺</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanchmukhiShaniHanumanMandir;
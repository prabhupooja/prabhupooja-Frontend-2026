import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/khajranatemple.css";

import khajranatemple from "../Assets/ujjaintemple-img.jpeg";
import api from "../Axios/api";

const Ujjaintemple = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [price, setPrice] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await api.get(`/temple/gettemple/${id}`);
        setPrice(response.data.data.price);
      } catch (error) {
        console.error("Error fetching temples:", error);
      }
    };

    fetchTemples();
  }, [id]);

  const handleBookNow = () => {
    navigate("/booknowform", {
      state: {
        templeId: id,
        price: price,
      },
    });
  };
  return (
    <>
      <div className="sub_header_ktemple">
        <div className="container">
          <div className="subheader_inner_ktemple">
            <div className="subheader_text_ktemple">
              <h1>Ujjain Temple </h1>
              <h1>Pooja</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">Ujjain Temple Pooja</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-sm-5">
              <h1 className="heading">MAHAKALESHWAR</h1>
              <img src={khajranatemple} alt="" className="templeimg" />
            </div>

            <div className="col-sm-5">
              <div className="temple_content">
                <Link className="primary_btn" to="/enquiryform">
                  Enquiry Now
                </Link>

                <Link
                  className="primary_btn blue"
                  to="https://www.facebook.com/profile.php?id=61565211141697"
                >
                  <i
                    className="fa-brands fa-facebook-f"
                    style={{ paddingRight: "5px" }}
                  ></i>
                  Facebook
                </Link>

                <Link
                  to="https://wa.me/7225016699?text=Namaste"
                  className="primary_btn yellow"
                >
                  <i
                    className="fa-brands fa-whatsapp"
                    style={{ paddingRight: "5px" }}
                  ></i>
                  Whatsapp
                </Link>

                <button
                  className="primary_btn darkorange"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>

                <p style={{ paddingTop: "5px" }}>
                  <b>DESCRIPTION</b>
                </p>
                <p>
                  Mahakal Mandir in Ujjain, also known as Mahakaleshwar
                  Jyotirlinga, is one of the most revered temples dedicated to
                  Lord Shiva. Here are key points about the temple:
                </p>

                <p style={{ paddingTop: "10px" }}>
                  <b>Significance:</b> Mahakal Mandir is one of the twelve
                  Jyotirlingas, which are considered the most sacred abodes of
                  Lord Shiva. It holds immense spiritual significance for
                  Hindus.
                </p>

                <p>
                  <b>Location:</b> The temple is situated in the ancient city of
                  Ujjain in the state of Madhya Pradesh, India, on the banks of
                  the river Shipra.
                </p>

                <p>
                  <b> Deity:</b> The main deity, Mahakaleshwar, is a Swayambhu
                  (self-manifested) lingam, which is believed to derive its
                  power from within itself, unlike other lingams that are
                  ritually installed. .
                </p>

                <p>
                  <b>Rituals and Worship: </b>The temple follows a unique Bhasma
                  Aarti ritual every morning, where the lingam is worshipped
                  with sacred ash. Devotees from all over the country visit the
                  temple to participate in this ritual
                </p>

                <p>
                  <b>Architecture:</b> The temple exhibits a classic
                  architectural style with intricate carvings and a towering
                  spire. It has five levels, including an underground level, and
                  houses various shrines dedicated to different deities.
                </p>

                <p>
                  <b>Festivals:</b> Major festivals like Mahashivaratri and
                  Kartik Purnima are celebrated with great enthusiasm. During
                  these times, the temple attracts thousands of devotees
                </p>

                <p>
                  <b> Mythological Importance: </b> The Mahakal Temple has deep
                  roots in Hindu mythology and is mentioned in various ancient
                  texts and scriptures. It is believed that the lingam here is
                  the most powerful of all the Jyotirlingas
                </p>

                <p>
                  <b>Spiritual Experience:</b> Visiting Mahakal Mandir is
                  considered a profoundly spiritual experience, offering
                  devotees a chance to seek blessings, meditate, and immerse
                  themselves in the divine atmosphere.
                </p>

                <p>
                  Mahakal Mandir in Ujjain is not just a temple but a symbol of
                  deep religious faith, historical grandeur, and spiritual
                  reverence, making it a must-visit for devotees and tourists
                  alike.
                </p>

                <p style={{ paddingTop: "5px" }}>
                  <b>Darshan (Viewing of the Deity):</b>
                </p>
                <ul>
                  <li>Morning: From 4:00 AM</li>
                  <li>Evening: Till 11:00 PM</li>
                </ul>

                <p style={{ paddingTop: "5px" }}>
                  <b>Bhasma Aarti:</b>
                </p>
                <ul>
                  <li>Morning: From 4:00 AM to 6:00 AM</li>
                  <li>Morning Aarti From 7:00 AM to 7:30 AM</li>
                  <li>Evening Aarti Evening: From 5:00 PM to 5:30 PM</li>
                  <li>Shri Mahakal Aarti Evening: From 7:00 PM to 7:30 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ujjaintemple;

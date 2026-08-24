import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/khajranatemple.css";

import khajranatemple from "../Assets/khajranatemple-img.jpeg";
import api from "../Axios/api";

const Khajranatemple = () => {
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
  }, []);

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
              <h1>Khajrana Temple </h1>
              <h1>Pooja</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">
                  Khajrana Temple Pooja
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-sm-5">
              <h1 className="heading">KHAJRANA</h1>
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
                  The temple
                  dedicated to Lord Ganesh, located in the Khajrana area of the
                  city. Here are some key points about the temple:
                </p>

                <p style={{ paddingTop: "10px" }}>
                  <b>Significance:</b> The temple is renowned for its powerful
                  deity, Lord Ganesh, known as Khajrana Ganesh. Devotees believe
                  that praying here fulfills wishes and removes obstacles.
                </p>

                <p>
                  <b>History:</b> The temple was established by Rani Ahilyabai
                  Holkar, the ruler of Indore, in the 18th century. It has since
                  become a beloved pilgrimage site for locals and visitors
                  alike.
                </p>

                <p>
                  <b> Architecture:</b> The temple architecture is distinctively
                  Hindu, with a traditional style reflecting the cultural
                  heritage of Madhya Pradesh.
                </p>

                <p>
                  <b>Rituals and Offerings: </b> Devotees offer flowers,
                  coconuts, sweets, and prayers to Lord Ganesh. Special prayers
                  and aarti (worship with lamps) are performed regularly.
                </p>

                <p>
                  <b>Festivals:</b> Ganesh Chaturthi is celebrated with great
                  fervor at Khajrana Ganesh Mandir, drawing large crowds who
                  participate in the festivities.
                </p>

                <p>
                  <b>Accessibility:</b> The temple is easily accessible by road
                  and is a significant landmark in the Khajrana locality of
                  Indore.
                </p>

                <p>
                  <b> Spiritual Atmosphere: </b>The temple provides a serene and
                  spiritual atmosphere, where devotees find solace and seek
                  blessings from Lord Ganesh.
                </p>

                <p>
                  Khajrana Ganesh Mandir holds a special place in the hearts of
                  devotees in Indore and beyond, embodying faith, tradition, and
                  cultural heritage.
                </p>

                <p style={{ paddingTop: "5px" }}>
                  <b>TIMINGS:</b>
                </p>
                <ul>
                  <li>Temple Opening Time 5:00 AM</li>
                  <li>Temple Closing Time 12:00 AM</li>
                </ul>

                <p style={{ paddingTop: "5px" }}>
                  <b>Aarti Time:</b>
                </p>
                <ul>
                  <li>Morning - 8.00 AM</li>
                  <li>Evening - 8.00 PM</li>
                  <li>Abhishek Time 05:30 AM to 6.30 AM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Khajranatemple;

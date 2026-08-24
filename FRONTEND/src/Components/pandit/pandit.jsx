import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import "../../styles/panditkicss.css";
import usePanditStore from "../../Store/PanditStore/PanditStore";
import CryptoJS from "crypto-js";
import panditImage from '../Assets/profile-pic.png';
import NewLoader from "../NewLoader/NewLoader";

const Pandit = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { PanditGet, Pandit } = usePanditStore();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        await PanditGet();
        // console.log("m chal rh ");
      } catch (error) {
        setError("Error fetching services. Please try again.");
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };


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
      <div className="sub_header_ktemple">
        <div className="container">
          <div className="subheader_inner_ktemple">
            <div className="subheader_text_ktemple">
              <h1>Pandit</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">Pandit</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="services-section">
        <div className="services-container">
          <div className="services-row">
            {Pandit.map((service, index) => {
              const encryptedId = encryptId(service.id);
              return (
                <div className="service-card" key={index}>
                  <div className="service-image">
                    <Link to={`/panditprofile/${encryptedId}`}>
                      <img
                        src={service.profileImage ? service.profileImage : panditImage}
                        alt={service.name}
                        className="service-img"
                      />
                    </Link>
                  </div>

                  <div className="service-details">
                    <h6 className="service-name">
                      <Link to={`/panditprofile/${encryptedId}`}>
                        {service.name}
                      </Link>
                    </h6>
                    <div className="service-rating">
                      <div className="rating-stars">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <div className="rating-info">
                        <span className="average-rating">0</span> |
                        <span className="review-count">0 reviews</span>
                      </div>
                    </div>

                    <p className="service-language">
                      <i className="fa-solid fa-language"></i> {service.language}
                    </p>
                    <p className="service-experience">
                      <i className="fa-solid fa-suitcase"></i> Exp:{" "}
                      {service.experience} Years
                    </p>
                    <p className="service-price">
                      <i className="fa-solid fa-rupee-sign"></i> Starting From
                      Rs.1100 / 30 minutes
                    </p>
                    <div className="service-action">
                      <Link className="enquire-btn" to="/enquiryform">
                        Enquire Now
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  );
};


export default Pandit;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/prasaddelivery.css";
import usePrasadStore from "../../Store/PrasadStore/PrasadStore";
import NewLoader from "../NewLoader/NewLoader";
import Khajranaprasadimg from "../Assets/Khajarana Mandir.png";
import ujjainprasadimg from "../Assets/Ujjain temple.png";
import defaultPrasadImg from "../Assets/prasadimg.webp";
import { normalizeImageUrl } from "../../utils/imageHelper";
import { FaTruck, FaShieldAlt, FaArrowRight, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const Prasaddelivery = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { prasadGet, prasad } = usePrasadStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await prasadGet();
      } catch (error) {
        setError("Error fetching services. Please try again.");
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [prasadGet]);

  const getPrasadImage = (service) => {
    const name = ((service.prasad_name || "") + " " + (service.temple_name || "")).toLowerCase();
    let defaultLocal = defaultPrasadImg;
    if (service.id === 1 || name.includes("khajrana") || name.includes("ganesh")) {
      defaultLocal = Khajranaprasadimg;
    } else if (service.id === 2 || name.includes("ujjain") || name.includes("mahakal")) {
      defaultLocal = ujjainprasadimg;
    }
    return normalizeImageUrl(service.image, defaultLocal);
  };

  const getFallbackLocal = (service) => {
    const name = ((service.prasad_name || "") + " " + (service.temple_name || "")).toLowerCase();
    if (service.id === 1 || name.includes("khajrana") || name.includes("ganesh")) {
      return Khajranaprasadimg;
    }
    if (service.id === 2 || name.includes("ujjain") || name.includes("mahakal")) {
      return ujjainprasadimg;
    }
    return defaultPrasadImg;
  };

  if (loading) {
    return <NewLoader />;
  }

  if (error) {
    return <div className="text-center p-5 text-danger"><h4>{error}</h4></div>;
  }

  return (
    <div className="prasad-delivery-page">
      <div className="sub_header_delivery">
        <div className="container">
          <div className="subheader_inner_delivery">
            <div className="subheader_text_delivery">
              <h1>Divine Prasad Delivery</h1>
              <p className="delivery-hero-sub">Directly from Holy Temples to Your Doorstep with Sacred Vedic Blessings</p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">Prasad Delivery</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="prasad_section">
        <div className="container">
          <div className="prasad-features-bar">
            <div className="p-feat-item">
              <MdVerified className="p-feat-icon" />
              <div>
                <strong>100% Authentic Temple Prasad</strong>
                <span>Offered in your Name & Gotra</span>
              </div>
            </div>
            <div className="p-feat-item">
              <FaTruck className="p-feat-icon" />
              <div>
                <strong>Safe & Express Delivery</strong>
                <span>Air-sealed hygienic packing</span>
              </div>
            </div>
            <div className="p-feat-item">
              <FaShieldAlt className="p-feat-icon" />
              <div>
                <strong>Sacred Gangajal Sanctified</strong>
                <span>Packed with divine care</span>
              </div>
            </div>
          </div>

          <div className="prasad-cards-grid">
            {prasad && prasad.length > 0 ? (
              prasad.map((service) => {
                const prasadImg = getPrasadImage(service);
                const fallbackImg = getFallbackLocal(service);
                const originalPrice = service.price ? Math.round(Number(service.price) * 1.35) : 699;

                return (
                  <div key={service.id} className="prasad-custom-card">
                    <div className="prasad-card-img-wrapper">
                      <Link
                        to={`/prasad/${service.id}`}
                        state={{ service, price: service.price, id: service.id }}
                      >
                        <img
                          src={prasadImg}
                          alt={service.prasad_name || "Temple Prasad"}
                          className="prasad-card-img"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImg;
                          }}
                        />
                      </Link>
                      <div className="prasad-card-badge-overlay">
                        <span className="temple-verified-tag">
                          <MdVerified /> Sanctified
                        </span>
                      </div>
                    </div>

                    <div className="prasad-card-body">
                      <div className="prasad-rating-row">
                        <span className="prasad-star-rating">
                          <FaStar className="star-icon" /> 4.9 (500+ Devotees)
                        </span>
                      </div>

                      <h3 className="prasad-card-title">
                        <Link
                          to={`/prasad/${service.id}`}
                          state={{ service, price: service.price, id: service.id }}
                        >
                          {service.prasad_name} {service.temple_name ? `• ${service.temple_name}` : ""}
                        </Link>
                      </h3>

                      <p className="prasad-card-desc">
                        {service.description 
                          ? (service.description.length > 80 ? service.description.slice(0, 80) + "..." : service.description)
                          : "Pure Desi Ghee Prasad, Raksha Sutra, Holy Chandan & Temple Blessings."}
                      </p>

                      <div className="prasad-card-footer">
                        <div className="prasad-price-box">
                          <span className="prasad-current-price">₹{service.price}</span>
                          <span className="prasad-mrp-cut">₹{originalPrice}</span>
                        </div>

                        <Link
                          to={`/prasad/${service.id}`}
                          state={{ service, price: service.price, id: service.id }}
                          className="prasad-book-btn"
                        >
                          <span>Book Now</span>
                          <FaArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-prasad-box">
                <p>Sacred Prasad offerings are currently being updated.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prasaddelivery;

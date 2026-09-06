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
          <div className="services-header-intro">
            <h2>हमारे सिद्ध एवं <span>विद्वान पंडित</span></h2>
            <p>अनुभवी एवं वैदिक आचार्यों से संपूर्ण विधि-विधान के साथ पूजा एवं अनुष्ठान संपन्न कराएं।</p>
          </div>

          {Pandit && Pandit.length > 0 ? (
            <div className="services-row">
              {Pandit.map((service, index) => {
                const encryptedId = encryptId(service.id);
                const profileImg = service.profileImage && service.profileImage !== "null" && service.profileImage !== "undefined"
                  ? (service.profileImage.startsWith("http") ? service.profileImage : `${process.env.REACT_APP_BACKEND_URL || ""}/uploads/${service.profileImage}`)
                  : panditImage;

                return (
                  <div className="service-card" key={service.id || index}>
                    <div className="service-card-top">
                      <div className="service-image">
                        <Link to={`/panditprofile/${encryptedId}`}>
                          <img
                            src={profileImg}
                            alt={service.name || "Pandit Ji"}
                            className="service-img"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = panditImage;
                            }}
                          />
                        </Link>
                      </div>
                      <div className="service-card-badges" style={{ position: "absolute", top: "10px", right: "10px", display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
                        {service.is_online === 1 ? (
                          <span
                            className="badge_online"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              background: "#dcfce7",
                              color: "#15803d",
                              fontSize: "0.74rem",
                              fontWeight: "700",
                              padding: "3px 9px",
                              borderRadius: "20px",
                              border: "1px solid #86efac",
                              boxShadow: "0 2px 5px rgba(34, 197, 94, 0.2)"
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "#22c55e",
                                boxShadow: "0 0 6px #22c55e"
                              }}
                            ></span>
                            Online Now
                          </span>
                        ) : (
                          <span
                            className="badge_offline"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              background: "rgba(243, 244, 246, 0.9)",
                              color: "#6b7280",
                              fontSize: "0.74rem",
                              fontWeight: "600",
                              padding: "3px 9px",
                              borderRadius: "20px",
                              border: "1px solid #e5e7eb"
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#9ca3af"
                              }}
                            ></span>
                            Offline
                          </span>
                        )}

                        {service.verified === 1 && (
                          <span className="service-verified-chip" style={{ margin: 0 }}>
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="service-details">
                      <h6 className="service-name">
                        <Link to={`/panditprofile/${encryptedId}`}>
                          {service.name || "पंडित जी"}
                        </Link>
                      </h6>
                      
                      <div className="service-rating">
                        <div className="rating-stars">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                        <div className="rating-info">
                          <span className="average-rating">{service.rating || "5.0"}</span> |
                          <span className="review-count"> (Verified)</span>
                        </div>
                      </div>

                      {service.skills && service.skills !== "NA" && (
                        <p className="service-skills-tag">
                          <span>🕉</span> {service.skills}
                        </p>
                      )}

                      <p className="service-language">
                        <i className="fa-solid fa-language"></i> {service.language || "Hindi, Sanskrit"}
                      </p>
                      
                      <p className="service-experience">
                        <i className="fa-solid fa-suitcase"></i> अनुभव:{" "}
                        {service.experience || "5+"} Years
                      </p>
                      
                      <p className="service-price">
                        <i className="fa-solid fa-rupee-sign"></i> Starting From{" "}
                        <strong>₹{service.price || "1100"}</strong>
                      </p>

                      <div className="service-action">
                        <Link className="enquire-btn" to={`/panditprofile/${encryptedId}`}>
                          View Profile & Book
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: "17px", color: "#666" }}>
                फिलहाल कोई पंडित उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};


export default Pandit;

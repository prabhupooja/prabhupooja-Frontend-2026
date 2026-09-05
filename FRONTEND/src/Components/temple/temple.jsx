import React, { useState, useEffect } from "react";
import "../../styles/temple.css";
import { Link, useNavigate } from "react-router-dom";
import mapimg from "../Assets/map-temple-image.png";
import { IoCheckmark } from "react-icons/io5";
import useTempleStore from "../../Store/TempleStore/TempleStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";
import NewLoader from "../NewLoader/NewLoader";

const Temple = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user1 } = useAuthStore();
  const { templeGet, temple } = useTempleStore();

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        await templeGet();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching temples:", error);
        setLoading(false);
      }
    };

    fetchTemples();
  }, [templeGet]);

  const handleViewClick = (id) => {
    navigate(`/temple/${id}`, { state: { id } });
  };
  const handleBookClick = (templeId, price) => {
    if (!user1) {
      // navigate("/login");
      Swal.fire({
        title: "Login Required",
        text: "Please login!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
    } else {
      navigate("/booknowform", { state: { templeId, price } });
    }
  };

  if (loading) {
    return (
      <>
        <div>
          <NewLoader/>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="temple-header">
        <div className="container">
          <div className="row">
            <div className="col-sm-7">
              <div className="temple-intro">
                <h1>Visit the holy places and temples of India.</h1>
              </div>
              <div className="temple-features">
                <p className="feature-item">
                  <IoCheckmark className="feature-icon" />
                  Learn about their culture and history.
                </p>
                <p className="feature-item">
                  <IoCheckmark className="feature-icon" />
                  Find temples of your favorite gods.
                </p>
                <p className="feature-item">
                  <IoCheckmark className="feature-icon" />
                  Do charity work and donate to these temples.
                </p>
              </div>
            </div>

            <div className="col-sm-5">
              <Link to="#">
                <img
                  src={mapimg}
                  alt="Map of Temples"
                  className="temple-map-image"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="temple-gallery">
        <div className="container">
          <div className="row">
            {Array.isArray(temple) && temple.length > 0 ? (
              temple.map((item) => (
                <div className="col-sm-4" key={item.id}>
                  <article className="temple-gallery-item" style={{ position: "relative" }}>
                    <span className="temple_card_tag_badge">
                      {item.tag || "Divine Temple"}
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      height={245}
                      className="temple-image"
                      onClick={() => handleViewClick(item.id)}
                      style={{ cursor: "pointer" }}
                    />

                    <div className="temple-info">
                      <h3 className="temple-title" onClick={() => handleViewClick(item.id)} style={{ cursor: "pointer" }}>
                        {item.name}
                      </h3>
                      <p className="temple-description">
                        📍 {item.location || item.description || "Holy Shrine"}
                      </p>
                      <div className="temple-price">₹ {item.price || 501}</div>
                      <div className="temple-actions">
                        <button
                          className="temple-action-link1"
                          onClick={() => handleViewClick(item.id)}
                        >
                          VIEW
                        </button>

                        <button
                          className="temple-action-link1"
                          onClick={() => handleBookClick(item.id, item.price)}
                        >
                          BOOK
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", width: "100%", padding: "50px 0" }}>
                <p>No temples found at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temple;

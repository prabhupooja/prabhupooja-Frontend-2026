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
            {temple?.map((temple) => (
              <div className="col-sm-4" key={temple.id}>
                <article className="temple-gallery-item">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    height={245}
                    className="temple-image"
                    onClick={() => handleViewClick(temple.id)}
                  />

                  <div className="temple-info">
                    <h3 className="temple-title">{temple.name}</h3>
                    <p className="temple-description">{temple.location || temple.description || "Holy Shrine"}</p>
                    <div className="temple-price">₹ {temple.price}</div>
                    <div className="temple-actions">
                      <button
                        className="temple-action-link1"
                        onClick={() => handleViewClick(temple.id)}
                      >
                        VIEW
                      </button>

                      <button
                        className="temple-action-link1"
                        onClick={() => handleBookClick(temple.id, temple.price)}
                      >
                        BOOK
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temple;

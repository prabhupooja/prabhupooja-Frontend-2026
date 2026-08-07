import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/prasaddelivery.css";
import usePrasadStore from "../../Store/PrasadStore/PrasadStore";
// import CryptoJS from "crypto-js";
import NewLoader from "../NewLoader/NewLoader";

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

  if (error) {
    return <p>{error}</p>;
  }

  // const encryptId = (ID) => {
  //   const encrypted = CryptoJS.AES.encrypt(
  //     ID.toString(),
  //     "prabhupooja2024"
  //   ).toString();
  //   return encodeURIComponent(encrypted);
  // };

  return (
    <>
      <div className="sub_header_delivery">
        <div className="container">
          <div className="subheader_inner_delivery">
            <div className="subheader_text_delivery">
              <h1>Prasad Delivery</h1>
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
          <div className="row">
            {prasad.map((service) => {
              // const encryptedId = encryptId(service.id);
              return (
                <div key={service.id} className="col-sm-3">
                  <div className="tp-box-prasad">
                    <div className="tp-img">
                      <Link
                        to={`/prasad/${service.id}`}
                        state={{ price: service.price, id: service.id }}
                      >
                        <img src={service.image} alt={service.prasad_name} />
                      </Link>
                    </div>

                    <div className="tp-box-content">
                      <h6>
                        {service.prasad_name} {service.temple_name}
                      </h6>
                      <div className="price-booknow">
                        <div className="price-grp">
                          <p className="current_price">
                            <strong>
                              <span>Rs.{service.price}</span>
                            </strong>
                          </p>
                        </div>
                        <Link
                          className="booknow-btn"
                          to={`/prasad/${service.id}`}
                          state={{ price: service.price, id: service.id }}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Prasaddelivery;

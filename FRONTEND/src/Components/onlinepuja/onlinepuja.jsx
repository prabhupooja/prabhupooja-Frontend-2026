import React, { useEffect } from "react";
import "../../styles/onlinepuja.css";
import { Link } from "react-router-dom";
import useHomeStore from "../../Store/dataStore/homeStore";
import CryptoJS from "crypto-js";
import NewLoader from "../NewLoader/NewLoader";

const Onlinepuja = () => {
  const { getOnlinePuja, pujas, isLoading } = useHomeStore();

  useEffect(() => {
    getOnlinePuja();
  }, [getOnlinePuja]);

  const encryptId = (ID) => {
    if (!ID) return "";
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  const getPoojaUrl = (service) => {
    const param = service.slug || encryptId(service.id);
    return `/online-pooja/${param}`;
  };

  if (isLoading) {
    return (
      <div>
        <NewLoader />
      </div>
    );
  }

  return (
    <>
      <div className="sub_header_pooja">
        <div className="container">
          <div className="subheader_inner_pooja">
            <div className="subheader_text_pooja">
              <h1>Online Pooja</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">Online Pooja</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="puja_category">
        <div className="container">
          <div className="row" style={{ marginTop: "50px" }}>
            {pujas.map((service) => {
              const poojaUrl = getPoojaUrl(service);

              return (
                <div className="col-sm-3" key={service.id}>
                  <div className="tp-box-pooja">
                    <div className="tp-img-pooja">
                      <Link to={poojaUrl}>
                        <img src={service.image} alt={service.name} />
                      </Link>
                    </div>

                    <div className="tp-box-content">
                      <h2>{service.name}</h2>
                      <div className="price-booknow">
                        <div className="price-grp">
                          <p className="current_price">
                            <strong>
                              <span className="current_price_pooja">
                                Rs.{service.price}
                              </span>
                            </strong>
                          </p>
                          <p className="current_price">
                            <strong>
                              <span className="final_price_pooja">
                                Rs.{service.final_price}
                              </span>
                            </strong>
                          </p>
                        </div>

                        <Link
                          className="booknow_btn"
                          to={poojaUrl}
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

export default Onlinepuja;

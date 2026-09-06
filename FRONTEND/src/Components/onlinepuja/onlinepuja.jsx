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
          <div className="row g-4" style={{ marginTop: "30px" }}>
            {pujas.map((service) => {
              const poojaUrl = getPoojaUrl(service);
              const originalPrice = Number(service.price) || 0;
              const finalPrice = Number(service.final_price) || originalPrice;
              const hasDiscount = originalPrice > finalPrice;
              const discountAmount = originalPrice - finalPrice;

              return (
                <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4" key={service.id}>
                  <div className="tp-box-pooja">
                    <div className="tp-img-pooja">
                      <Link to={poojaUrl}>
                        <img src={service.image} alt={service.name} />
                      </Link>
                      <span className="pooja-vedic-badge">🕉️ Vedic Pooja</span>
                      {hasDiscount && discountAmount > 0 && (
                        <span className="pooja-discount-badge">Save ₹{discountAmount}</span>
                      )}
                    </div>

                    <div className="tp-box-content">
                      <h2 className="pooja-card-title">
                        <Link to={poojaUrl}>{service.name}</Link>
                      </h2>

                      <div className="pooja-card-features">
                        <span className="pooja-feat-chip">🪔 Vidhan & Sankalp</span>
                        <span className="pooja-feat-chip">🌸 Pure Vedic Ritual</span>
                      </div>

                      <div className="price-booknow">
                        <div className="price-grp">
                          <div className="pooja-price-current">
                            <span className="pooja-currency">₹</span>
                            <span className="pooja-amount">{finalPrice}</span>
                          </div>
                          {hasDiscount && (
                            <span className="pooja-price-original">
                              ₹{originalPrice}
                            </span>
                          )}
                        </div>

                        <Link className="booknow_btn" to={poojaUrl}>
                          Book Now 🙏
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

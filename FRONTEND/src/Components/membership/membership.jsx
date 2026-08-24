import { React, useState, useEffect } from "react";
import "../../styles/membership.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logoimg from "../Assets/prabhupooja-logo.png";
import poojaservice from "../Assets/online-pujaimg.jpeg";
import yogaservice from "../Assets/yoga-service.png";
import astrologyservice from "../Assets/astrology-service.png";
import ecommerceservice from "../Assets/ecommerce-service.png";
import muhuratservice from "../Assets/muhurat-service.png";
import prasadservice from "../Assets/prasad-delivery-service.png";
import templeservice from "../Assets/temple-service.png";
import panditservice from "../Assets/pandit-service.png";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import NewLoader from "../NewLoader/NewLoader";

const Membership = () => {
  const navigate = useNavigate();
  const {
    user1,
    getPrimeMember,
    setIsMember,
    isMember,
    expiryDate,
    paymentDate,
  } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDate = async () => {
      if (user1) await getPrimeMember(user1?.id);
    };
    fetchDate();
  }, [user1?.id]);

  const handleBuyMembership = () => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to buy a membership!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
    } else {
      navigate("/buymembership");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  <div>{loading && <NewLoader />}</div>;

  if (isMember) {
    return (
      <>
        <div className="sub_header_membership">
          <div className="container">
            <div className="subheader_inner_membership">
              <div className="subheader_text_membership">
                <h1>Membership</h1>
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

        <div className="memberMessage">
          <h3>Congratulations! You have already purchased a membership!</h3>
          <p>
            Enjoy all the benefits of your membership and spiritual services
            without needing to purchase again.
          </p>
          <p>
            your membership date :{" "}
            {new Date(paymentDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            your membership is expires on :{" "}
            {new Date(expiryDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="membership">
            <div className="container">
              <div className="membership_box">
                <div className="logo_img">
                  <img src={logoimg} alt="Logo" />
                </div>
                <div className="membership-title">
                  <h1>Membership Scheme</h1>
                </div>

                <div className="benefits">
                  <div className="row">
                    <div className="col-sm-9">
                      <h1>Benefits</h1>
                      <ul className="benefits_list">
                        <li>
                          <span className="benefit-title">
                            Exclusive Spiritual Outreach Programs:
                          </span>
                          Receive exclusive invitations to spiritual outreach
                          programs for a year.
                        </li>
                        <li>
                          <span className="benefit-title">
                            Easy Access to Pandits:
                          </span>
                          Enjoy convenient access to pandits for your spiritual
                          needs.
                        </li>
                        <li>
                          <span className="benefit-title">
                            Customized Gift Hampers:
                          </span>
                          Membership includes specially tailored complimentary
                          gift hampers just for you.
                        </li>
                        <li>
                          <span className="benefit-title">
                            No Annual Maintenance Fees:
                          </span>
                          No annual maintenance fees required.
                        </li>
                        <li>
                          <span className="benefit-title">
                            Terms & Conditions Apply:
                          </span>
                          T&C Apply.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="benefits membership-service">
                  <h1>Spiritual Services</h1>
                  <ul className="benefits_list">
                    <li>
                      <span className="benefit-title">
                        Complimentary Gemstone/Rudraksha:{" "}
                      </span>
                      Receive a free gemstone or rudraksha (subject to
                      availability).
                    </li>
                    <li>
                      <span className="benefit-title">
                        Free Astrological Consultancy:{" "}
                      </span>
                      Enjoy a complimentary astrological consultation along with
                      your Kundli.
                    </li>
                    <li>
                      <span className="benefit-title">
                        Complimentary Yoga/Wellness Session:
                      </span>{" "}
                      Participate in a free yoga or wellness session.
                    </li>
                    <li>
                      <span className="benefit-title">
                        Complimentary Puja Services:
                      </span>
                      Avail a complimentary pooja service. Online pooja services
                      are also available with your name and Gotra.
                    </li>
                    <li>
                      <span className="benefit-title">
                        Free Temple Gift Box:{" "}
                      </span>
                      Receive a complimentary temple gift box.
                    </li>
                    <li>
                      <span className="benefit-title">VIP Darshan:</span> Enjoy
                      a complimentary VIP darshan at select locations.
                    </li>
                    <li>
                      <span className="benefit-title">
                        10% Discount on All Products and Services:
                      </span>{" "}
                      As a privileged cardholder, enjoy a 10% discount on all
                      Prabhu Pooja products and services.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="membership_service">
            <div className="container">
              <div className="row">
                <div className="col-sm-3">
                  <Link to="/onlinepooja">
                    <img
                      src={poojaservice}
                      alt="Online Pooja"
                      className="service_image"
                    />
                  </Link>
                </div>

                <div className="col-sm-3">
                  <Link to="/e-commerce">
                    <img
                      src={ecommerceservice}
                      alt="E-Commerce"
                      className="service_image"
                    />
                  </Link>
                </div>

                <div className="col-sm-3">
                  <Link to="/astrology">
                    <img
                      src={astrologyservice}
                      alt="Astrology"
                      className="service_image"
                    />
                  </Link>
                </div>

                <div className="col-sm-3">
                  <Link to="/muhurat">
                    <img
                      src={muhuratservice}
                      alt="Muhurat"
                      className="service_image"
                    />
                  </Link>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <h1 className="services_title">
                    SPIRITUAL SERVICES
                  </h1>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3">
                  <Link to="/prasaddelivery">
                    <img
                      src={prasadservice}
                      alt="Prasad Delivery"
                      className="service_image"
                    />
                  </Link>
                </div>

                <div className="col-sm-3">
                  <Link to="/pandit">
                    <img
                      src={panditservice}
                      alt="Pandit"
                      className="service_image"
                    />
                  </Link>
                </div>

                <div className="col-sm-3">
                  <Link to="/temple">
                    <img
                      src={templeservice}
                      alt="Temple"
                      className="service_image"
                    />
                  </Link>
                </div>

                <div className="col-sm-3">
                  <Link to="/yoga">
                    <img
                      src={yogaservice}
                      alt="Yoga"
                      className="service_image"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="sub_header_membership">
          <div className="container">
            <div className="subheader_inner_membership">
              <div className="subheader_text_membership">
                <h1>Membership</h1>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="btn-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Membership</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="membership">
          <div className="container">
            <div className="membership_box">
              <div className="buy_btn">
                <button onClick={handleBuyMembership}>Buy Membership</button>
              </div>

              <div className="benefits">
                <div className="row">
                  <div className="col-sm-9">
                    <h1>Benefits</h1>
                    <ul className="benefits_list">
                      <li>
                        <span className="benefit-title">
                          Exclusive Spiritual Outreach Programs:{" "}
                        </span>{" "}
                        Receive exclusive invitations to spiritual outreach
                        programs for a year.
                      </li>
                      <li>
                        <span className="benefit-title">
                          Easy Access to Pandits:
                        </span>{" "}
                        Enjoy convenient access to pandits for your spiritual
                        needs.
                      </li>
                      <li>
                        <span className="benefit-title">
                          Customized Gift Hampers:{" "}
                        </span>
                        Membership includes specially tailored complimentary
                        gift hampers just for you.
                      </li>
                      <li>
                        <span className="benefit-title">
                          No Annual Maintenance Fees:
                        </span>{" "}
                        No annual maintenance fees required.
                      </li>
                      <li>
                        <span className="benefit-title">
                          Terms & Conditions Apply:{" "}
                        </span>
                        T&C Apply.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="benefits membership-service">
                <h1>Spiritual Services</h1>
                <ul className="benefits_list">
                  <li>
                    <span className="benefit-title">
                      Complimentary Gemstone/Rudraksha:{" "}
                    </span>
                    Receive a free gemstone or rudraksha (subject to
                    availability).
                  </li>
                  <li>
                    <span className="benefit-title">
                      Free Astrological Consultancy:{" "}
                    </span>
                    Enjoy a complimentary astrological consultation along with
                    your Kundli.
                  </li>
                  <li>
                    <span className="benefit-title">
                      Complimentary Yoga/Wellness Session:
                    </span>{" "}
                    Participate in a free yoga or wellness session.
                  </li>
                  <li>
                    <span className="benefit-title">
                      Complimentary Puja Services:
                    </span>
                    Avail a complimentary pooja service. Online pooja services
                    are also available with your name and Gotra.
                  </li>
                  <li>
                    <span className="benefit-title">
                      Free Temple Gift Box:{" "}
                    </span>
                    Receive a complimentary temple gift box.
                  </li>
                  <li>
                    <span className="benefit-title">VIP Darshan:</span> Enjoy a
                    complimentary VIP darshan at select locations.
                  </li>
                  <li>
                    <span className="benefit-title">
                      10% Discount on All Products and Services:
                    </span>{" "}
                    As a privileged cardholder, enjoy a 10% discount on all
                    Prabhu Pooja products and services.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="membership_service">
          <div className="container">
            <div className="row">
              <div className="col-sm-3">
                <Link to="/onlinepooja">
                  <img
                    src={poojaservice}
                    alt="Online Pooja"
                    className="service_image"
                  />
                </Link>
              </div>

              <div className="col-sm-3">
                <Link to="/e-commerce">
                  <img
                    src={ecommerceservice}
                    alt="E-Commerce"
                    className="service_image"
                  />
                </Link>
              </div>

              <div className="col-sm-3">
                <Link to="/astrology">
                  <img
                    src={astrologyservice}
                    alt="Astrology"
                    className="service_image"
                  />
                </Link>
              </div>

              <div className="col-sm-3">
                <Link to="/muhurat">
                  <img
                    src={muhuratservice}
                    alt="Muhurat"
                    className="service_image"
                  />
                </Link>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <h1 className="services_title">SPIRITUAL SERVICES</h1>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-3">
                <Link to="/prasaddelivery">
                  <img
                    src={prasadservice}
                    alt="Prasad Delivery"
                    className="service_image"
                  />
                </Link>
              </div>

              <div className="col-sm-3">
                <Link to="/pandit">
                  <img
                    src={panditservice}
                    alt="Pandit"
                    className="service_image"
                  />
                </Link>
              </div>

              <div className="col-sm-3">
                <Link to="/temple">
                  <img
                    src={templeservice}
                    alt="Temple"
                    className="service_image"
                  />
                </Link>
              </div>

              <div className="col-sm-3">
                <Link to="/yoga">
                  <img src={yogaservice} alt="Yoga" className="service_image" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Membership;

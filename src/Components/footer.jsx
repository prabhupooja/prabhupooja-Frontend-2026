import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

import logo from "../Components/Assets/prabhupooja-logo.png";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <div className="logo">
              <Link>
                <img src={logo} alt="" />
              </Link>
            </div>
            <p className="footer-para">
              Online Pooja and Astrology Services In today's digital age, the
              ancient practices of Hindu rituals and astrology have seamlessly
              integrated with technology to offer online Pooja and astrology
              services.
            </p>
          </div>

          <div className="col-sm-3">
            <div className="f_heading1">Quick Links</div>
            <div className="f_links">
              <li>
                <Link to="/">
                  <i className="fa-solid fa-angles-right"></i>
                  Home
                </Link>
              </li>

              <li>
                <Link to="/onlinepooja">
                  <i className="fa-solid fa-angles-right"></i>
                  Online Pooja
                </Link>
              </li>

              <li>
                <Link to="/prasaddelivery">
                  <i className="fa-solid fa-angles-right"></i>
                  Prasad Delivery
                </Link>
              </li>

              <li>
                <Link to="/astrology">
                  <i className="fa-solid fa-angles-right"></i>
                  Astrology
                </Link>
              </li>

              <li>
                <Link to="/e-commerce">
                  <i className="fa-solid fa-angles-right"></i>
                  E-Commerce
                </Link>
              </li>

              <li>
                <Link to="/blogs">
                  <i className="fa-solid fa-angles-right"></i>
                  Blog
                </Link>
              </li>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="f_heading1">Our Policy</div>
            <div className="f_links">
              <li>
                <Link to="/termsandcondition">
                  <i className="fa-solid fa-angles-right"></i>
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link to="/privacypolicy">
                  <i className="fa-solid fa-angles-right"></i>
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="/shipingpolicy">
                  <i className="fa-solid fa-angles-right"></i>
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link to="/paymentpolicy">
                  <i className="fa-solid fa-angles-right"></i>
                  Payment Policy
                </Link>
              </li>

              <li>
                <Link to="/refund&cancle">
                  <i className="fa-solid fa-angles-right"></i>
                  Return & Refund
                </Link>
              </li>

              <li>
                <Link to="/disclaimer">
                  <i className="fa-solid fa-angles-right"></i>
                  Disclaimer
                </Link>
              </li>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="f_heading">Contact Info</div>

            <ul className="info">
              <li>
                <i className="fa-solid fa-envelope"></i>
                <span>
                  <a href="mailto:enquiry@prabhupooja.com">
                    enquiry@prabhupooja.com
                  </a>
                </span>
              </li>

              <li>
                <i className="fa-solid fa-phone"></i>
                <span>
                  <a href="tel:+917225016699">+91 7225016699</a>
                </span>
              </li>
            </ul>

            <ul className="social_icon" style={{ marginTop: "30px" }}>
              <li>
                <Link to="https://www.facebook.com/prabhupooja.official">
                  <FaFacebook />
                </Link>
              </li>

              <li>
                <Link to="https://www.instagram.com/prabhupooja.official/">
                  <FaInstagram />
                </Link>
              </li>

              <li>
                <Link to="https://www.youtube.com/@PrabhuPoojaa">
                  <FaYoutube />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 PrabhuPooja. All rights reserved.</p>
          <ul>
            {/* <li>
              <a href="/sitemap.html" target="_blank" rel="noopener noreferrer">
                Sitemap
              </a>
            </li> */}
            {/* <li>
              <a href="/privacypolicy">Privacy Policy</a>
            </li> */}
            {/* <li>
              <a href="/venderterms">Vendor Terms</a>
            </li> */}
            {/* <li>
              <a href="/refund&cancle">Refund & Cancellation Policy</a>
            </li> */}
            {/* <li>
              <a href="/paymentpolicy">Payment Policy</a>
            </li> */}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

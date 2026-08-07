import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import teamimg from "./Assets/teamimg.jpg";
import "../styles/ourteam.css";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import NewLoader from "./NewLoader/NewLoader";

import teamimg1 from "../Components/Assets/profileimg1.png";

function Ourteam() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
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

  return (
    <>
      <div className="our_team_section">
        <div className="container">
          <h1>Our Team</h1>
          <p>
            At Prabhu Pooja, our dedicated teams work together to deliver the
            best spiritual services and customer experience. Our teams include
            Client Coordination, Artisan, Packaging and Handling, Dispatch, Web
            Designing & Development, SEO & Content Creation, Accounts, and
            Support Staff. Each team is committed to ensuring seamless service,
            from high-quality spiritual products to expert-guided rituals,
            providing a divine and fulfilling experience for our valued
            customers.
          </p>
          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="our-team">
                <div className="picture">
                  <img className="img-fluid" src={teamimg1} />
                </div>
                <div className="team-content">
                  <h3 className="name">Nikhil Bopche</h3>
                  <h4 className="title">Digital Marketing Manager</h4>

                </div>
                <ul className="social">
                  <li>
                    <FaFacebookF className="icon-team" />
                  </li>
                  <li>
                    <GrInstagram className="icon-team" />
                  </li>
                  <li>
                    <FaLinkedinIn className="icon-team" />
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="our-team">
                <div className="picture">
                  <img
                    className="img-fluid"
                    src={teamimg1}
                  />
                </div>
                <div className="team-content">
                  <h3 className="name">Rishikesh</h3>
                  <h4 className="title">Full Stack Developer</h4>
                </div>
                <ul className="social">
                  <li>
                    <FaFacebookF className="icon-team" />
                  </li>
                  <li>
                    <GrInstagram className="icon-team" />
                  </li>
                  <li>
                    <FaLinkedinIn className="icon-team" />
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="our-team">
                <div className="picture">
                  <img
                    className="img-fluid"
                    src={teamimg1}
                  />
                </div>
                <div className="team-content">
                  <h3 className="name">Kiran</h3>
                  <h4 className="title">Front-End Developer</h4>
                </div>
                <ul className="social">
                  <li>
                    <FaFacebookF className="icon-team" />
                  </li>
                  <li>
                    <GrInstagram className="icon-team" />
                  </li>
                  <li>
                    <FaLinkedinIn className="icon-team" />
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="our-team">
                <div className="picture">
                  <img
                    className="img-fluid"
                    src={teamimg1}
                  />
                </div>
                <div className="team-content">
                  <h3 className="name">Meera Sharma</h3>
                  <h4 className="title">Web Developer</h4>
                </div>
                <ul className="social">
                  <li>
                    <FaFacebookF className="icon-team" />
                  </li>
                  <li>
                    <GrInstagram className="icon-team" />
                  </li>
                  <li>
                    <FaLinkedinIn className="icon-team" />
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Ourteam;

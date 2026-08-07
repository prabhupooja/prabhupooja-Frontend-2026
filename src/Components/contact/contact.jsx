import React from "react";
import { Link } from "react-router-dom";
import "../../styles/enquiry.css";

const Enquiryform = () => {
  return (
    <>
      <div className="sub_header3">
        <div className="container">
          <div className="subheader_inner">
            <div className="subheader_text">
              <h1>Contact Us</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item active">Contact Us</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="pb-5">
        <div className="container">
          <h1 className="contact-title mb-4">CONTACT US</h1>
          <div className="row">
            <div className="col-sm-6">
              <form action="">
                <div className="form-group">
                  <label htmlFor="inputname">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputemail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="Email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputphone">Phone No.</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    placeholder="phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputenquiry">How Can We Help you</label>
                  <textarea name="" id="" className="input"></textarea>
                </div>

                <Link>
                  <button className="btn submit-button">Submit</button>
                </Link>
              </form>
            </div>

            <div className="col-sm-6 address">
              <p>
                <strong>Address</strong>    203 Mangal City, Vijay Nagar, Indore,
                Madhya Pradesh, India 452010
              </p>
              <p>
                <strong>Email</strong>    enquiry@prabhupooja.com
              </p>
              <p>
                <strong>Phone</strong>    8120545454
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Enquiryform;

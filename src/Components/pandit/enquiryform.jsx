import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import "../../styles/enquiry.css";
import Swal from "sweetalert2";
import api from "../Axios/api";
import NewLoader from "../NewLoader/NewLoader";

const Enquiryform = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [reason, setReason] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const reasons = [
  "Issue with Prasad delivery or quality",
  "Concern about temple services or rituals",
  "Query regarding Pandit or booking",
  "Astrology consultation feedback or issue",
  "Problem with purchased product or order",
  "Yoga session concern or scheduling issue",
  "Questions about Muhurat or timing",
  "Other reason not listed above",
];


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <>
        <div>
          <NewLoader/>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (name.trim() === "") {
      alert("Name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (enquiry.trim() === "") {
      alert("Enquiry is required");
      return;
    }

    if (!address) {
      alert("Please enter a address");
      return;
    }

    if (!reason) {
      alert("Please select a reason");
      return;
    }

    // API request
    try {
      const response = await api.post(
        "/enquiry/create",
        {
          name,
          email,
          phone_no: phone,
          message: enquiry,
          reason,
          address,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: "Form submitted successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
        // Clear form fields
        setName("");
        setEmail("");
        setPhone("");
        setEnquiry("");
        setReason("");
        setAddress("");
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to submit the form. Please try again later.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <>
      <div className="sub_header3">
        <div className="container">
          <div className="subheader_inner_enquiry">
            <div className="subheader_text_enquiry">
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
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inputname">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputemail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputphone">Phone No.</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputphone">Address</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    placeholder="Enter Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inputreason">Reason</label>
                  <select
                    id="inputreason"
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  >
                    <option value="">Select a reason</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="inputenquiry">How We Can Help You</label>
                  <textarea
                    name=""
                    id=""
                    className="input"
                    value={enquiry}
                    onChange={(e) => setEnquiry(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn submit-button">
                  Submit
                </button>
              </form>
            </div>

            <div className="col-sm-6 address">
              <p>
                <strong>Email:</strong> enquiry@prabhupooja.com
              </p>
              <p>
                <strong>Phone:</strong> +91 7225016699
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Enquiryform;

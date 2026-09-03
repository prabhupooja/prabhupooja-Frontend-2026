import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/enquiry.css";
import Swal from "sweetalert2";
import api from "../Axios/api";
import NewLoader from "../NewLoader/NewLoader";
import { 
  FaPhoneVolume, 
  FaWhatsapp, 
  FaEnvelope, 
  FaLocationDot, 
  FaClock, 
  FaPaperPlane,
  FaShieldHalved,
  FaHeadset
} from "react-icons/fa6";

const Enquiryform = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [reason, setReason] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    "Online Pooja Booking & Sankalp Inquiry",
    "Temple VIP Darshan & Puja Arrangements",
    "Vedic Astrology Consultation Query",
    "Prasad Delivery Tracking & Details",
    "Pooja Samagri / E-Commerce Order Inquiry",
    "Pandit / Acharya Registration",
    "Custom Anushthan / Mahayagya Request",
    "Other Devotional Support",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <NewLoader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({ icon: "warning", title: "Name Required", text: "Please enter your full name." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({ icon: "warning", title: "Invalid Email", text: "Please enter a valid email address." });
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, "").slice(-10))) {
      Swal.fire({ icon: "warning", title: "Invalid Phone", text: "Please enter a valid 10-digit mobile number." });
      return;
    }

    if (!reason) {
      Swal.fire({ icon: "warning", title: "Select Reason", text: "Please choose a category for your enquiry." });
      return;
    }

    if (!enquiry.trim()) {
      Swal.fire({ icon: "warning", title: "Message Required", text: "Please describe your query or requirement." });
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(
        "/enquiry/create",
        {
          name,
          email,
          phone_no: phone,
          message: enquiry,
          reason,
          address: address || "Not Provided",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success || response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "🙏 Enquiry Submitted Successfully!",
          text: "Thank you for connecting with Prabhu Pooja. Our Devotee Care coordinator will contact you shortly.",
          confirmButtonColor: "#ea580c",
          confirmButtonText: "Jai Shree Ram",
        });
        setName("");
        setEmail("");
        setPhone("");
        setEnquiry("");
        setReason("");
        setAddress("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Error",
          text: response.data?.message || "Could not submit enquiry. Please try again.",
        });
      }
    } catch (error) {
      console.error("Enquiry submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "Failed to submit your enquiry. Please contact us directly on WhatsApp or Call.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact_page_wrapper">
      {/* Hero Header */}
      <div className="sub_header_contact_new">
        <div className="overlay_contact"></div>
        <div className="container">
          <div className="subheader_inner_contact">
            <div className="subheader_text_contact">
              <span className="hero_badge_contact">🕉️ 24/7 Devotee Care</span>
              <h1>Contact & Devotee Support</h1>
              <p>We are always here to assist your spiritual journey with reverent dedication.</p>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Brand Info</li>
                <li className="breadcrumb-item active">Contact Us</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="contact_main_section">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {/* Left: Contact Info Card */}
            <div className="col-lg-5">
              <div className="contact_info_box">
                <div className="info_header">
                  <span className="info_pill">🕉️ Prabhu Pooja Seva Kendra</span>
                  <h2>Get in Touch with Our Acharyas & Support</h2>
                  <p>
                    Have questions about Online Puja procedures, Muhurat dates, consecrated Prasad, or order delivery? Reach out directly.
                  </p>
                </div>

                <div className="contact_cards_list">
                  <div className="contact_card_item">
                    <div className="card_icon_circle phone"><FaPhoneVolume /></div>
                    <div>
                      <h4>Call Helpline</h4>
                      <p>+91 7225016699</p>
                      <span>Mon - Sun: 7:00 AM - 10:00 PM IST</span>
                    </div>
                  </div>

                  <div className="contact_card_item">
                    <div className="card_icon_circle whatsapp"><FaWhatsapp /></div>
                    <div>
                      <h4>WhatsApp Support</h4>
                      <p>+91 7225016699</p>
                      <a
                        href="https://wa.me/917225016699?text=Namaste,%20I%20need%20assistance%20regarding%20Prabhu%20Pooja%20services"
                        target="_blank"
                        rel="noreferrer"
                        className="wa_quick_link"
                      >
                        Chat with Devotee Care →
                      </a>
                    </div>
                  </div>

                  <div className="contact_card_item">
                    <div className="card_icon_circle email"><FaEnvelope /></div>
                    <div>
                      <h4>Email Support</h4>
                      <p>enquiry@prabhupooja.com</p>
                      <span>Responses within 2 to 4 hours</span>
                    </div>
                  </div>

                  <div className="contact_card_item">
                    <div className="card_icon_circle location"><FaLocationDot /></div>
                    <div>
                      <h4>Spiritual Headquarters</h4>
                      <p>Prabhu Pooja Seva Kendra, Holy City Ujjain & Indore, MP, India</p>
                    </div>
                  </div>
                </div>

                <div className="trust_badge_strip">
                  <div className="trust_pill">
                    <FaShieldHalved /> 100% Confidential
                  </div>
                  <div className="trust_pill">
                    <FaHeadset /> Dedicated Support
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Glassmorphic Contact Form */}
            <div className="col-lg-7">
              <div className="contact_form_card">
                <div className="form_heading">
                  <h3>Send Us a Message</h3>
                  <p>Fill in your details below and our team will get in touch immediately.</p>
                </div>

                <form onSubmit={handleSubmit} className="modern_contact_form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label>Your Full Name <span className="req">*</span></label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="e.g. Ramesh Chandra"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label>Email Address <span className="req">*</span></label>
                        <input
                          type="email"
                          className="form-control-modern"
                          placeholder="e.g. devotee@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label>Phone / WhatsApp No. <span className="req">*</span></label>
                        <input
                          type="tel"
                          className="form-control-modern"
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label>City / Address</label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="e.g. Indore, Madhya Pradesh"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group-modern">
                        <label>Service / Inquiry Category <span className="req">*</span></label>
                        <select
                          className="form-control-modern"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          required
                        >
                          <option value="">Select a Category</option>
                          {reasons.map((r, idx) => (
                            <option key={idx} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group-modern">
                        <label>How Can We Help You? (Message / Sankalp Wish) <span className="req">*</span></label>
                        <textarea
                          rows={4}
                          className="form-control-modern"
                          placeholder="Please describe your requirements, family sankalp wishes, preferred date or any questions..."
                          value={enquiry}
                          onChange={(e) => setEnquiry(e.target.value)}
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn_submit_contact"
                        disabled={submitting}
                      >
                        {submitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" /> Send Devotional Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enquiryform;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../styles/enquiry.css";
import Swal from "sweetalert2";
import api from "../Axios/api";
import NewLoader from "../NewLoader/NewLoader";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { 
  FaPhoneVolume, 
  FaWhatsapp, 
  FaEnvelope, 
  FaLocationDot, 
  FaPaperPlane,
  FaShieldHalved,
  FaHeadset,
  FaCheck,
  FaXmark
} from "react-icons/fa6";
import { GiSparkles } from "react-icons/gi";

const Enquiryform = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user1 } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [reason, setReason] = useState("");
  const [address, setAddress] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [panditId, setPanditId] = useState(null);
  const [panditName, setPanditName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    "Online Pooja Booking & Sankalp Inquiry",
    "Pandit / Acharya Booking",
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

    // 1. Auto-fill from Logged-in User
    if (user1) {
      if (user1.name) setName(user1.name);
      if (user1.email) setEmail(user1.email);
      if (user1.mobile || user1.phone) setPhone(user1.mobile || user1.phone);
    }

    // 2. Extract Service / Pooja / Pandit / Temple name from URL query or State
    const paramService =
      searchParams.get("service") ||
      searchParams.get("pooja") ||
      searchParams.get("pandit") ||
      searchParams.get("temple") ||
      location.state?.prefilledService ||
      "";

    const paramCategory =
      searchParams.get("category") ||
      searchParams.get("type") ||
      location.state?.prefilledCategory ||
      "";

    const paramReason =
      searchParams.get("reason") ||
      location.state?.prefilledReason ||
      "";

    if (paramService) {
      const cleanService = decodeURIComponent(paramService).trim();
      setServiceName(cleanService);

      // Auto select appropriate Reason category
      if (paramReason && reasons.includes(paramReason)) {
        setReason(paramReason);
      } else if (
        paramCategory === "pandit" ||
        cleanService.toLowerCase().includes("pandit") ||
        cleanService.toLowerCase().includes("acharya") ||
        cleanService.toLowerCase().includes("shastri")
      ) {
        setReason("Pandit / Acharya Booking");
      } else if (
        paramCategory === "temple" ||
        cleanService.toLowerCase().includes("temple") ||
        cleanService.toLowerCase().includes("mandir") ||
        cleanService.toLowerCase().includes("darshan")
      ) {
        setReason("Temple VIP Darshan & Puja Arrangements");
      } else if (
        paramCategory === "astro" ||
        cleanService.toLowerCase().includes("astrology") ||
        cleanService.toLowerCase().includes("kundli") ||
        cleanService.toLowerCase().includes("jyotish")
      ) {
        setReason("Vedic Astrology Consultation Query");
      } else if (
        paramCategory === "prasad" ||
        cleanService.toLowerCase().includes("prasad")
      ) {
        setReason("Prasad Delivery Tracking & Details");
      } else {
        setReason("Online Pooja Booking & Sankalp Inquiry");
      }

      // Pre-fill polite message template mentioning the item
      setEnquiry(
        `नमस्ते प्रभु पूजा टीम, मैं "${cleanService}" के संबंध में जानकारी व बुकिंग प्रक्रिया जानना चाहता/चाहती हूँ। कृपया उपलब्ध मुहूर्त व अन्य विवरण साझा करें।`
      );
    } else if (paramReason && reasons.includes(paramReason)) {
      setReason(paramReason);
    }

    // 3. Extract Pandit details if navigated from Pandit page
    const pId =
      searchParams.get("panditId") ||
      searchParams.get("pandit_id") ||
      location.state?.panditId ||
      location.state?.pandit_id ||
      location.state?.pandit?.id ||
      null;

    const pName =
      searchParams.get("panditName") ||
      searchParams.get("pandit_name") ||
      location.state?.panditName ||
      location.state?.pandit_name ||
      location.state?.pandit?.name ||
      null;

    if (pId) setPanditId(pId);
    if (pName) setPanditName(pName);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchParams, location.state, user1]);

  if (loading) {
    return <NewLoader />;
  }

  const handleClearService = () => {
    setServiceName("");
    setEnquiry("");
  };

  const handleReset = () => {
    if (!user1) {
      setName("");
      setEmail("");
      setPhone("");
    }
    setReason("");
    setAddress("");
    setServiceName("");
    setPanditId(null);
    setPanditName(null);
    setEnquiry("");
  };

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

    const phoneClean = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile/WhatsApp Number",
        text: "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).",
      });
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
      const fullMessage = serviceName
        ? `[Inquiry For: ${serviceName}]\n\n${enquiry}`
        : enquiry;

      const response = await api.post(
        "/enquiry/create",
        {
          name,
          email,
          phone_no: phone,
          message: fullMessage,
          reason,
          address: address || "Not Provided",
          pandit_id: panditId ? Number(panditId) : null,
          pandit_name: panditName ? (panditName.startsWith("Pt.") ? panditName : `Pt. ${panditName}`) : (serviceName && (serviceName.toLowerCase().includes("pandit") || serviceName.toLowerCase().includes("acharya")) ? serviceName : null),
          user_id: user1?.id ? Number(user1.id) : null,
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
          text: `Thank you ${name}. Our Devotee Care coordinator will contact you shortly regarding ${serviceName || "your enquiry"}.`,
          confirmButtonColor: "#ea580c",
          confirmButtonText: "Jai Shree Ram",
        });
        if (!user1) {
          setName("");
          setEmail("");
          setPhone("");
        }
        setEnquiry("");
        setReason("");
        setAddress("");
        setServiceName("");
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
              <span className="hero_badge_contact">🕉️ 24/7 Devotee Care & Booking</span>
              <h1>Contact & Devotee Support</h1>
              <p>We are always here to assist your spiritual journey, Vedic pujas, and Temple darshan arrangements.</p>
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
                    Have questions about Online Puja procedures, Muhurat dates, consecrated Prasad, or Pandit bookings? Reach out directly.
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
                        href={`https://wa.me/917225016699?text=${encodeURIComponent(
                          serviceName
                            ? `Namaste, I need assistance regarding ${serviceName} on Prabhu Pooja.`
                            : "Namaste, I need assistance regarding Prabhu Pooja services."
                        )}`}
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

            {/* Right: Contact & Booking Form */}
            <div className="col-lg-7">
              <div className="contact_form_card">
                <div className="form_heading">
                  <h3>
                    {serviceName ? "Complete Your Booking Enquiry" : "Send Us a Message"}
                  </h3>
                  <p>
                    {serviceName
                      ? `Fill in your details below to book or inquire about ${serviceName}.`
                      : "Fill in your details below and our Devotee Care team will get in touch immediately."}
                  </p>
                </div>

                {/* AUTO PRE-FILLED BANNER */}
                {serviceName && (
                  <div className="prefilled_service_banner">
                    <div className="banner_left">
                      <span className="banner_badge"><GiSparkles /> Selected Service</span>
                      <h4 className="banner_title">🚩 {serviceName}</h4>
                    </div>
                    <button
                      type="button"
                      className="banner_clear_btn"
                      onClick={handleClearService}
                      title="Clear selected service"
                    >
                      <FaXmark /> Clear
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="modern_contact_form">
                  <div className="row g-3">
                    {/* Devotee Name */}
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

                    {/* Email */}
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

                    {/* Phone */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label>Phone / WhatsApp No. <span className="req">*</span></label>
                        <input
                          type="tel"
                          className="form-control-modern"
                          placeholder="e.g. 9876543210 (10 Digits)"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          required
                        />
                      </div>
                    </div>

                    {/* City / Address */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label>City / Location</label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="e.g. Indore, Madhya Pradesh"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Selected Service Input (Optional / Editable) */}
                    <div className="col-12">
                      <div className="form-group-modern">
                        <label>Pooja / Pandit / Service Name</label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="e.g. Maha Rudrabhishek Pooja, Pandit Ji Booking"
                          value={serviceName}
                          onChange={(e) => setServiceName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Category Dropdown */}
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

                    {/* Message */}
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

                    {/* Submit Button */}
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
                            <FaPaperPlane className="me-2" />
                            {serviceName ? `Submit Booking Enquiry for ${serviceName}` : "Send Devotional Message"}
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

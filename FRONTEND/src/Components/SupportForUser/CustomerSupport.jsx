import React, { useState, useEffect } from "react";
import "./CustomerSupport.css";
import {
  FaHeadset,
  FaEnvelope,
  FaPhoneAlt,
  FaClipboardList,
  FaArrowLeft,
  FaCheckCircle,
  FaComments,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import Swal from "sweetalert2";
import { Oval } from "react-loader-spinner";

const CustomerSupport = () => {
  const navigate = useNavigate();
  const { user1 } = useAuthStore();
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(user1?.email || "");
  const [phone, setPhone] = useState(user1?.mobile || "");
  const [successMessage, setSuccessMessage] = useState("");
  const { userTicketCreate } = useUserStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user1) {
      if (user1.email) setEmail(user1.email);
      if (user1.mobile) setPhone(user1.mobile);
    }
  }, [user1]);

  const handlePhoneChange = (e) => {
    // Strictly numeric only, maximum 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile Number",
        text: "Please enter a valid 10-digit mobile number (e.g., 9876543210).",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    if (!issueType) {
      Swal.fire({
        icon: "warning",
        title: "Select Issue Category",
        text: "Please select an issue type so we can direct your request to the right department.",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await userTicketCreate({
        issue_type: issueType,
        description: description,
        user_id: user1?.id,
        email: email,
        phone: phone,
      });

      if (response?.success || response?.status === 200 || response?.status === 201) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Ticket Submitted Successfully! 🙏",
          text: "Your support request has been logged. Our Devotee Care team will contact you shortly.",
          confirmButtonColor: "#ea580c",
          confirmButtonText: "View My Tickets",
        }).then(() => {
          navigate("/support/view");
        });
        setSuccessMessage("Your support ticket has been created! We’ll reach out shortly.");
        setIssueType("");
        setDescription("");
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Submission Issue",
          text: response?.message || "Could not submit ticket. Please try again.",
          confirmButtonColor: "#ea580c",
        });
      }
    } catch (err) {
      setLoading(false);
      console.error("Support ticket error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while submitting your ticket. Please try again!",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="support-wrapper">
      <div className="support-card-box">
        {/* Back Link */}
        <div className="support-top-nav">
          <Link to="/support" className="back-link-btn">
            <FaArrowLeft /> Support Home
          </Link>
          <Link to="/support/view" className="view-tickets-quick-link">
            My Tickets →
          </Link>
        </div>

        <div className="support-header">
          <div className="support-icon-circle">
            <FaHeadset className="support-icon" />
          </div>
          <h2>24/7 Devotee Care & Support</h2>
          <p>We are here to assist with your Pooja Sankalp, Temple Darshan, or Store Orders.</p>
        </div>

        <form className="support-form" onSubmit={handleSubmit}>
          <div className="support-form-grid">
            <div className="input-group">
              <label className="input-label">Devotee Email <span className="req">*</span></label>
              <div className="field-inner-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">10-Digit Mobile Number <span className="req">*</span></label>
              <div className="field-inner-wrap">
                <FaPhoneAlt className="input-icon" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  required
                  onChange={handlePhoneChange}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits numeric mobile number"
                />
              </div>
              {phone && phone.length !== 10 && (
                <span className="field-hint-error">Must be 10 digits ({phone.length}/10 entered)</span>
              )}
            </div>
          </div>

          <div className="input-group full-width">
            <label className="input-label">Issue Category <span className="req">*</span></label>
            <div className="field-inner-wrap">
              <FaClipboardList className="input-icon" />
              <select
                value={issueType}
                required
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="">-- Select Issue Type --</option>
                <option value="Online Pooja & Sankalp">🛕 Online Pooja & Sankalp Issue</option>
                <option value="Product & Store Order">📦 Product & Store Delivery Issue</option>
                <option value="Temple Darshan Booking">🏛️ Temple Darshan / VIP Pass</option>
                <option value="Pandit Chat & Call">💬 Pandit Consultation / Call Issue</option>
                <option value="Wallet & Payment">💳 Wallet Recharge / Payment Problem</option>
                <option value="Account & Login">🔐 Account & Verification</option>
                <option value="Other Assistance">✨ Other Inquiries</option>
              </select>
            </div>
          </div>

          <div className="input-group full-width">
            <label className="input-label">Describe Your Query in Detail <span className="req">*</span></label>
            <textarea
              rows="5"
              placeholder="Please provide details (Booking ID, Order ID, Date, or specific problem) so our team can resolve it immediately..."
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <div className="btn-loader-wrap">
                <Oval color="white" height={20} width={20} />
                <span>Submitting Your Ticket...</span>
              </div>
            ) : (
              "Submit Support Ticket 🙏"
            )}
          </button>

          {successMessage && <p className="success-banner">{successMessage}</p>}
        </form>

        <div className="support-footer-trust">
          <div className="trust-item">
            <FaShieldAlt className="trust-icon" />
            <span>100% Dedicated Devotee Support</span>
          </div>
          <div className="trust-item">
            <FaComments className="trust-icon" />
            <span>Average Resolution: &lt; 2 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;


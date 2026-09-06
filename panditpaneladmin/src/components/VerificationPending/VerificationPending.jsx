import React, { useState } from "react";
import "./verificationpending.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import logo from "../../assets/LOGO-NEW1.png";
import {
  FaClock,
  FaCheckCircle,
  FaShieldAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaSignOutAlt,
  FaSyncAlt,
  FaFileAlt,
  FaMapMarkerAlt,
  FaUniversity,
  FaPrayingHands,
} from "react-icons/fa";
import Swal from "sweetalert2";

function VerificationPending() {
  const { pandit, logout, panditGet } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await panditGet();
      const updated = res?.data || pandit;
      const isNowVerified =
        updated?.verified === 1 ||
        updated?.verified === "1" ||
        updated?.verified === true ||
        updated?.status === "approved" ||
        updated?.is_verified === 1;

      if (isNowVerified) {
        Swal.fire({
          icon: "success",
          title: "Account Verified! 🎉",
          text: "Your Acharya profile is now fully approved. Welcome to your dashboard!",
          confirmButtonColor: "#ea580c",
        }).then(() => {
          navigate("/home");
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Verification In Progress ⏳",
          text: "Your documents are still being reviewed by our Vedic board. Review typically takes 2 to 6 hours.",
          confirmButtonColor: "#ea580c",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Sign Out",
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const isRejected =
    pandit?.status === "rejected" ||
    pandit?.rejected === 1 ||
    pandit?.rejected === "1";

  return (
    <div className="verify-pending-wrapper">
      <div className="verify-pending-container">
        {/* Top Logo & Header */}
        <div className="vp-header-brand">
          <img src={logo} alt="Prabhu Pooja" className="vp-brand-logo" />
          <div className="vp-brand-badge">
            <span>Vedic Pandit & Purohit Board</span>
          </div>
        </div>

        {/* Central Notice Card */}
        <div className="vp-main-card">
          <div className={`vp-status-icon-ring ${isRejected ? "rejected" : ""}`}>
            {isRejected ? (
              <span style={{ fontSize: "32px" }}>⚠️</span>
            ) : (
              <FaClock className="vp-clock-icon" />
            )}
          </div>

          <div className={`vp-badge-pill ${isRejected ? "rejected" : ""}`}>
            <span className="pulsing-dot"></span>
            <span>
              Application Status: {isRejected ? "Action Required / Verification Rejected" : "Under Review"}
            </span>
          </div>

          <h2 className="vp-title">
            Namaste {pandit?.name ? `Pt. ${pandit.name} ${pandit?.lastname || ""}` : "Acharya Ji"} 🙏
          </h2>

          {isRejected ? (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #f87171",
                borderRadius: "12px",
                padding: "16px 20px",
                margin: "16px 0 24px",
                textAlign: "left",
              }}
            >
              <h4 style={{ color: "#991b1b", margin: "0 0 6px", fontWeight: 700 }}>
                Verification Feedback from Board:
              </h4>
              <p style={{ color: "#7f1d1d", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                {pandit?.rejection_reason ||
                  pandit?.reason ||
                  "Some uploaded documents did not meet verification criteria. Please contact Acharya board or re-upload your valid Gurukul/Identity certificate."}
              </p>
            </div>
          ) : (
            <p className="vp-description">
              Your registration application and credentials have been received and are currently under verification by the Prabhu Pooja Vedic Quality Board.
            </p>
          )}

          {/* Verification Steps Timeline */}
          <div className="vp-timeline-box">
            <div className="vp-timeline-step completed">
              <div className="step-icon-circle"><FaCheckCircle /></div>
              <div className="step-info">
                <h4>1. Application Submitted</h4>
                <p>Personal & temple credentials registered</p>
              </div>
            </div>

            <div className="vp-timeline-step active">
              <div className="step-icon-circle"><FaClock /></div>
              <div className="step-info">
                <h4>2. Identity & Gurukul Verification</h4>
                <p>Admin board is checking certificates & identity docs</p>
              </div>
            </div>

            <div className="vp-timeline-step pending">
              <div className="step-icon-circle"><FaShieldAlt /></div>
              <div className="step-info">
                <h4>3. Acharya Board Approval</h4>
                <p>Issuance of official Verified Acharya seal</p>
              </div>
            </div>

            <div className="vp-timeline-step pending">
              <div className="step-icon-circle"><FaPrayingHands /></div>
              <div className="step-info">
                <h4>4. Live Devotee Consultations</h4>
                <p>Dashboard access for calls, chats & puja bookings</p>
              </div>
            </div>
          </div>

          {/* Submitted Application Snapshot */}
          <div className="vp-snapshot-card">
            <h3 className="snapshot-title">
              <FaFileAlt style={{ color: "#ea580c" }} /> Application Details
            </h3>

            <div className="snapshot-grid">
              <div className="snap-item">
                <span className="snap-label">Mobile Number</span>
                <span className="snap-val">{pandit?.mobile || "Registered Mobile"}</span>
              </div>
              <div className="snap-item">
                <span className="snap-label">Email Address</span>
                <span className="snap-val">{pandit?.email || "Registered Email"}</span>
              </div>
              <div className="snap-item">
                <span className="snap-label">Temple / Tirtha Kshetra</span>
                <span className="snap-val">
                  <FaUniversity style={{ marginRight: "4px", color: "#f59e0b" }} />
                  {pandit?.temple || "Vedic Tirtha Kshetra"}
                </span>
              </div>
              <div className="snap-item">
                <span className="snap-label">Location Base</span>
                <span className="snap-val">
                  <FaMapMarkerAlt style={{ marginRight: "4px", color: "#ea580c" }} />
                  {pandit?.city ? `${pandit.city}, ${pandit.state || "India"}` : "India"}
                </span>
              </div>
            </div>

            <div className="snap-docs-row">
              <span className="doc-pill">
                Aadhaar: {pandit?.aadharCard ? "Uploaded ✅" : "Submitted"}
              </span>
              <span className="doc-pill">
                Gurukul Degree: {pandit?.gurukulCertificate ? "Uploaded ✅" : "Submitted"}
              </span>
              <span className="doc-pill">
                PAN Card: {pandit?.panCard ? "Uploaded ✅" : "Submitted"}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="vp-actions-row">
            <button
              className="vp-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "spin-icon" : ""} />
              {refreshing ? "Checking Status..." : "Check Status"}
            </button>

            <a
              href="https://wa.me/917225016699?text=Namaste,%20I%20have%20submitted%20my%20Pandit%20registration%20on%20Prabhu%20Pooja%20and%20requesting%20verification%20assistance"
              target="_blank"
              rel="noreferrer noopener"
              className="vp-whatsapp-btn"
            >
              <FaWhatsapp /> Contact Admin on WhatsApp
            </a>

            <button className="vp-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="vp-support-footer">
          <span>Need immediate assistance? Call Acharya Support at: </span>
          <a href="tel:+917225016699">
            <FaPhoneAlt /> +91 72250 16699
          </a>
        </div>
      </div>
    </div>
  );
}

export default VerificationPending;

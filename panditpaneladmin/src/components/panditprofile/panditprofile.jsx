import React, { useState, useEffect } from "react";
import "./panditprofile.css";
import { FaEdit, FaPhoneAlt, FaVideo, FaPrayingHands } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import Swal from "sweetalert2";
import AadharCard from "../../assets/Aadhaarcard.png";
import panCard from "../../assets/pancard.webp";

function PanditProfile() {
  const { panditGet, pandit, logout, deletePandit } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("Pandittoken");

  useEffect(() => {
    userFetch();
  }, []);

  const userFetch = async () => {
    if (!token) {
      navigate("/");
    } else {
      await panditGet();
    }
  };

  const images = [
    pandit?.gurukulCertificate || AadharCard,
    pandit?.panCard || panCard,
    pandit?.aadharCard || AadharCard,
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff7a00",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Logout",
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete your profile? This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePandit(pandit?.id);
          logout();
          Swal.fire("Deleted!", "Your profile has been deleted.", "success").then(() => {
            navigate("/");
          });
        } catch (error) {
          Swal.fire("Error", "Failed to delete profile. Please try again.", "error");
          console.error("Delete Error:", error);
        }
      }
    });
  };

  const handleeditform = () => {
    navigate("/editprofileform");
  };

  const openImage = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const chatRate = pandit?.chat_price || pandit?.chatPrice || "15";
  const voiceRate = pandit?.voice_price || pandit?.voicePrice || "20";
  const videoRate = pandit?.video_price || pandit?.videoPrice || "25";
  const pujaRate = pandit?.price || "501";

  return (
    <div className="pandit-profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile_img">
          <img
            src={pandit?.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
            alt="Pandit Profile"
            className="profile-image"
          />
        </div>
        <div className="profile_info">
          <h2 className="profile-name">
            {pandit ? `Pt. ${pandit.name} ${pandit.lastname || ""}` : "Pandit Ji"}
          </h2>
          <p className="profile-detail">
            <strong>Mobile:</strong> {pandit?.mobile || "N/A"}
          </p>
          <p className="profile-detail">
            <strong>Wallet Balance:</strong> ₹{pandit?.wallet !== undefined ? Number(pandit.wallet).toLocaleString() : 0}
          </p>
          <p className="profile-detail">
            <strong>Email:</strong> {pandit?.email || "N/A"}
          </p>
          <p className="profile-detail">
            <strong>Experience:</strong> {pandit?.experience || "5+"} Years
          </p>
          <p className="profile-detail">
            <strong>Location:</strong> {pandit?.city ? `${pandit.city}, ${pandit.state || "India"}` : "India"}
          </p>
        </div>
      </div>

      {/* 💰 Talk-Time Rates Card */}
      <div style={{ background: "#ffffff", borderRadius: "14px", padding: "20px 24px", border: "1px solid #fed7aa", boxShadow: "0 4px 15px rgba(255,122,0,0.06)", marginBottom: "24px" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "1.15rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>💰 Active Consultation Rates (Set by You)</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "10px", border: "1px solid #bfdbfe", textAlign: "center" }}>
            <span style={{ color: "#3b82f6", fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <IoChatbox /> Chat Rate
            </span>
            <p style={{ margin: "4px 0 0 0", fontSize: "1.35rem", fontWeight: "900", color: "#1e3a8a" }}>₹{chatRate} <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>/ min</span></p>
          </div>

          <div style={{ background: "#ecfdf5", padding: "14px", borderRadius: "10px", border: "1px solid #a7f3d0", textAlign: "center" }}>
            <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <FaPhoneAlt /> Voice Call Rate
            </span>
            <p style={{ margin: "4px 0 0 0", fontSize: "1.35rem", fontWeight: "900", color: "#065f46" }}>₹{voiceRate} <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>/ min</span></p>
          </div>

          <div style={{ background: "#fff7ed", padding: "14px", borderRadius: "10px", border: "1px solid #fed7aa", textAlign: "center" }}>
            <span style={{ color: "#ea580c", fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <FaVideo /> Video Call Rate
            </span>
            <p style={{ margin: "4px 0 0 0", fontSize: "1.35rem", fontWeight: "900", color: "#9a3412" }}>₹{videoRate} <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>/ min</span></p>
          </div>

          <div style={{ background: "#fdf4ff", padding: "14px", borderRadius: "10px", border: "1px solid #f5d0fe", textAlign: "center" }}>
            <span style={{ color: "#a855f7", fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <FaPrayingHands /> Puja Base Rate
            </span>
            <p style={{ margin: "4px 0 0 0", fontSize: "1.35rem", fontWeight: "900", color: "#701a75" }}>₹{pujaRate}</p>
          </div>
        </div>
      </div>

      {/* Details & Documents */}
      <div className="documents-section">
        <div className="profile_detail_section">
          <p className="profile-detail">
            <strong>Qualification:</strong> {pandit?.qualification || "Veda Acharya"}
          </p>
          <p className="profile-detail">
            <strong>Language:</strong> {pandit?.language || "Hindi, Sanskrit, English"}
          </p>
          <p className="profile-detail">
            <strong>Gotra:</strong> {pandit?.gotra || "Kashyap"}
          </p>
          <p className="profile-detail">
            <strong>Temple Association:</strong> {pandit?.temple || "Vedic Sanatan Mandir"}
          </p>
          <p className="profile-detail">
            <strong>Specialization / Skills:</strong> {pandit?.skills || "Vedic Rituals, Rudrabhishek, Kundli"}
          </p>
        </div>
        <div className="document-images">
          {images.map((imgSrc, index) => (
            <div key={index} onClick={() => openImage(imgSrc)} className="doc-card-preview">
              <img src={imgSrc} alt={`document-${index}`} />
              <span className="doc-caption">{index === 0 ? "Certificate" : index === 1 ? "PAN Card" : "Aadhaar Card"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-btn" onClick={handleeditform}>
          <FaEdit className="profiledit_icon" /> Edit Profile & Rates
        </button>
        <button className="delete-btn" onClick={handleDeleteAccount}>
          <RiDeleteBin5Line className="profiledit_icon" /> Delete Account
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <TbLogout className="profiledit_icon" /> Logout
        </button>
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedImage} alt="Document Preview" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default PanditProfile;

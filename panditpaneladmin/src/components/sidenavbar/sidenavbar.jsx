import React, { useState, useEffect } from "react";
import "./sidenavbar.css";
import api from "../Axios/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPrayingHands,
  FaPhoneAlt,
  FaUserEdit,
  FaSignOutAlt,
  FaVideo,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import useAuthStore from "../Store/AuthStore/AuthStore";
import useSokectStore from "../Store/Sokect/SokectStore";
import Swal from "sweetalert2";

const Sidenavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pandit, logout } = useAuthStore();
  const { connectPandit, disconnectPandit } = useSokectStore();

  const panditData = JSON.parse(localStorage.getItem("panditUser") || "{}");
  const panditId = pandit?.id || panditData?.id || localStorage.getItem("pandit_id") || 1;

  const [isOnline, setIsOnline] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Socket connection on mount
  useEffect(() => {
    if (panditId) {
      connectPandit(panditId);
    }
    return () => {
      disconnectPandit();
    };
  }, [panditId]);

  // Initial status fetch
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/pandit/status/${panditId}`);
        if (isMounted && res.data?.success && res.data?.is_online !== undefined) {
          setIsOnline(Boolean(res.data.is_online));
        }
      } catch (err) {
        // Fallback or ignore non-critical route warning
      }
    };
    if (panditId) {
      fetchStatus();
    }
    return () => {
      isMounted = false;
    };
  }, [panditId]);

  // Toggle handler
  const handleToggleOnline = async () => {
    try {
      setToggleLoading(true);
      const newStatus = !isOnline;
      const res = await api.post(`/pandit/toggleOnline`, {
        pandit_id: panditId,
        is_online: newStatus,
      });

      if (res.data?.success) {
        setIsOnline(Boolean(res.data.is_online));
      } else {
        setIsOnline(newStatus);
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: newStatus ? "success" : "info",
        title: newStatus ? "You are now ONLINE" : "You are now OFFLINE",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error("Toggle error:", err);
      // Optimistic update so UI doesn't freeze
      setIsOnline(!isOnline);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
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

  return (
    <>
      {/* 📱 Mobile Top Sticky App Bar (Visible on mobile/tablet <= 768px) */}
      <div className="pandit_mobile_header">
        <button
          className="btn_mobile_menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="mobile_brand_title">
          <span className="mb_tag">PRABHU POOJA</span>
          <h4>Pandit Portal</h4>
        </div>

        <div className="mobile_header_right">
          <span className={`mobile_live_dot ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "● Live" : "○ Offline"}
          </span>
          <img
            src={
              pandit?.profileImage ||
              panditData?.profileImage ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80"
            }
            alt="Pandit"
            className="mobile_avatar_thumb"
            onClick={() => navigate("/panditprofile")}
          />
        </div>
      </div>

      {/* 🌫️ Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar_mobile_backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 🗂️ Pandit Sidebar (Fixed on Desktop, Slide-Out Drawer on Mobile) */}
      <div className={`pandit_sidebar ${mobileOpen ? "mobile_open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar_brand">
          <div className="brand_text_wrap">
            <span className="brand_tag">PRABHU POOJA</span>
            <h3>Pandit Portal</h3>
          </div>
          {mobileOpen && (
            <button className="btn_close_drawer" onClick={() => setMobileOpen(false)}>
              <FaTimes />
            </button>
          )}
        </div>

        {/* Pandit Profile Card */}
        <div className="sidebar_profile">
          <div className="avatar_box">
            <img
              src={
                pandit?.profileImage ||
                panditData?.profileImage ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120"
              }
              alt="Pandit"
            />
            <span className={`live_indicator ${isOnline ? "online" : "offline"}`}></span>
          </div>
          <h4>{pandit?.name ? `Pt. ${pandit.name} ${pandit?.lastname || ""}` : "Pandit Ji"}</h4>
          <span className="role_text">Vedic Astrologer & Purohit</span>
        </div>

        {/* Online / Offline Toggle Card */}
        <div className="online_toggle_card">
          <div className="toggle_text_wrap">
            <span className="status_label">Live Status</span>
            <span className={`status_val ${isOnline ? "green" : "gray"}`}>
              {isOnline ? "● Online" : "○ Offline"}
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isOnline}
              disabled={toggleLoading}
              onChange={handleToggleOnline}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Nav Links */}
        <ul className="sidebar_nav_links">
          <li className={location.pathname === "/home" ? "active" : ""}>
            <Link to="/home" onClick={() => setMobileOpen(false)}>
              <FaHome /> <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === "/chatrequest" ? "active" : ""}>
            <Link to="/chatrequest" onClick={() => setMobileOpen(false)}>
              <IoChatbox /> <span>Chat Requests</span>
            </Link>
          </li>
          <li className={location.pathname === "/callrequest" ? "active" : ""}>
            <Link to="/callrequest" onClick={() => setMobileOpen(false)}>
              <FaPhoneAlt /> <span>Call Requests</span>
            </Link>
          </li>
          <li className={location.pathname === "/videocallrequest" ? "active" : ""}>
            <Link to="/videocallrequest" onClick={() => setMobileOpen(false)}>
              <FaVideo /> <span>Video Call</span>
            </Link>
          </li>
          <li
            className={
              location.pathname === "/assignedbookings" || location.pathname === "/assigned-pujas"
                ? "active"
                : ""
            }
          >
            <Link to="/assignedbookings" onClick={() => setMobileOpen(false)}>
              <FaPrayingHands /> <span>Assigned Pujas</span>
            </Link>
          </li>
          <li
            className={
              location.pathname === "/panditprofile" || location.pathname === "/profile"
                ? "active"
                : ""
            }
          >
            <Link to="/panditprofile" onClick={() => setMobileOpen(false)}>
              <FaUserEdit /> <span>Profile & KYC</span>
            </Link>
          </li>
        </ul>

        {/* Logout Action */}
        <div className="sidebar_logout_wrap">
          <button className="btn_sidebar_logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidenavbar;

import React, { useState, useEffect } from "react";
import "./sidenavbar.css";
import api from "../Axios/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaPrayingHands, FaPhoneAlt, FaUserEdit, FaSignOutAlt, FaVideo } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import useAuthStore from "../Store/AuthStore/AuthStore";
import useSokectStore from "../Store/Sokect/SokectStore";
import Swal from "sweetalert2";

const Sidenavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pandit, logout, panditGet } = useAuthStore();
  const { connectPandit, disconnectPandit } = useSokectStore();

  const panditData = JSON.parse(localStorage.getItem("panditUser") || "{}");
  const panditId = pandit?.id || panditData?.id || localStorage.getItem("pandit_id") || 1;

  const [isOnline, setIsOnline] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    panditGet();
  }, []);

  // Socket connection on mount
  useEffect(() => {
    if (panditId) {
      connectPandit(panditId);
    }
    return () => {
      disconnectPandit();
    };
  }, [panditId, connectPandit, disconnectPandit]);

  // Initial status fetch
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/pandit/status/${panditId}`);
        if (res.data?.success && res.data?.is_online !== undefined) {
          setIsOnline(Boolean(res.data.is_online));
        }
      } catch (err) {
        console.warn("Status fetch warning:", err?.message || err);
      }
    };
    if (panditId) {
      fetchStatus();
    }
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
    <div className="pandit_sidebar">
      {/* Brand Header */}
      <div className="sidebar_brand">
        <span className="brand_tag">PRABHU POOJA</span>
        <h3>Pandit Portal</h3>
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
          <Link to="/home">
            <FaHome /> <span>Dashboard</span>
          </Link>
        </li>
        <li className={location.pathname === "/chatrequest" ? "active" : ""}>
          <Link to="/chatrequest">
            <IoChatbox /> <span>Chat Requests</span>
          </Link>
        </li>
        <li className={location.pathname === "/callrequest" ? "active" : ""}>
          <Link to="/callrequest">
            <FaPhoneAlt /> <span>Call Requests</span>
          </Link>
        </li>
        <li className={location.pathname === "/videocallrequest" ? "active" : ""}>
          <Link to="/videocallrequest">
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
          <Link to="/assignedbookings">
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
          <Link to="/panditprofile">
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
  );
};

export default Sidenavbar;

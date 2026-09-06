import React, { useState, useEffect, useRef } from "react";
import "../styles/editprofile.css";
import profileimg from "./Assets/profile-img.png";
import useAuthStore from "../Store/UserStore/userAuthStore";
import useUserStore from "../Store/UserStore/userStore";
import useOnlinePujaStore from "../Store/PoojaStore/OnlinePoojaStore";
import useProblemPoojaStore from "../Store/ProblemPoojaStore/ProblemPoojaStore";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { TailSpin, Oval } from "react-loader-spinner";
import Swal from "sweetalert2";
import api from "./Axios/api";
import moment from "moment";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaWallet,
  FaShoppingCart,
  FaPrayingHands,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaArrowLeft,
  FaBoxOpen,
  FaTruck,
  FaRegCalendarAlt,
  FaHeadset,
  FaPlusCircle,
  FaComments,
  FaSyncAlt,
  FaCreditCard,
  FaTicketAlt,
} from "react-icons/fa";
import { MdLogout, MdTempleHindu, MdOutlineSupportAgent } from "react-icons/md";
import { IoRestaurantOutline, IoChatbox } from "react-icons/io5";
import { TbYoga } from "react-icons/tb";
import { BsCart } from "react-icons/bs";

const parseImages = (imgs) => {
  if (!imgs) return [];
  if (Array.isArray(imgs)) return imgs.filter(Boolean);
  if (typeof imgs === "string") {
    try {
      const parsed = JSON.parse(imgs);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (typeof parsed === "string") return [parsed];
    } catch (e) {
      if (imgs.includes(",")) {
        return imgs.split(",").map((s) => s.trim()).filter(Boolean);
      }
      return [imgs.trim()].filter(Boolean);
    }
  }
  return [];
};

const parseQuantities = (qty, count = 1) => {
  if (!qty) return Array(count).fill(1);
  if (Array.isArray(qty)) return qty;
  if (typeof qty === "number") return [qty];
  if (typeof qty === "string") {
    try {
      const parsed = JSON.parse(qty);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "number") return [parsed];
    } catch (e) {
      if (qty.includes(",")) {
        return qty.split(",").map((s) => Number(s.trim()) || 1);
      }
      const num = Number(qty);
      return isNaN(num) ? [1] : [num];
    }
  }
  return Array(count).fill(1);
};

function Editprofile() {
  const {
    userGet,
    user1,
    userUploadProfile,
    isLoading,
    updateUserData,
    login,
    userOTP,
    logout,
  } = useAuthStore();

  const {
    getUserCityByPincode,
    userFetchProduct,
    productCount,
    userfetchTempleBookings,
    templeCount,
    userfetchPrasadBooking,
    prasadCount,
    userfetchYogaBooking,
    yogaCount,
    getAllTiketsByUserId,
    userTicketCreate,
  } = useUserStore();

  const { getUserPujaBookings } = useOnlinePujaStore();
  const { getBookings } = useProblemPoojaStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileImg, setProfileImg] = useState(profileimg);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailTimer, setEmailTimer] = useState(60);
  const otpRefs = useRef([]);

  const [productOrdersList, setProductOrdersList] = useState([]);
  const [poojaBookingsList, setPoojaBookingsList] = useState([]);
  const [prasadBookingsList, setPrasadBookingsList] = useState([]);
  const [templeBookingsList, setTempleBookingsList] = useState([]);
  const [yogaBookingsList, setYogaBookingsList] = useState([]);
  const [chatRequestsList, setChatRequestsList] = useState([]);
  const [supportTicketsList, setSupportTicketsList] = useState([]);
  const [poojaCount, setPoojaCount] = useState(0);

  const [customRechargeAmount, setCustomRechargeAmount] = useState(500);
  const [walletRecharging, setWalletRecharging] = useState(false);

  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState(false);
  const [selectedTicketDetail, setSelectedTicketDetail] = useState(null);
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [ticketIssueType, setTicketIssueType] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (user1) {
      setName(user1.name || "");
      setLastName(user1.lastname || "");
      setMobile(user1.mobile || "");
      setEmail(user1.email || "");
      setNewEmailInput(user1.email || "");
      setTicketPhone(user1.mobile || "");
      setTicketEmail(user1.email || "");
      setCity(user1.city || "");
      setCountry(user1.country || "India");
      setAddress(user1.address || "");
      setState(user1.state || "");
      setPostalCode(user1.postalCode || "");
      setGender(user1.gender || "Male");
      setLoading(false);

      if (user1.id) {
        fetchAllDashboardData(user1.id);
      }
    } else {
      userGet().finally(() => setLoading(false));
    }
  }, [user1]);

  const fetchAllDashboardData = async (userId) => {
    try {
      userFetchProduct(userId)
        .then((res) => {
          if (res?.success) {
            const raw = Array.isArray(res.data?.orders)
              ? res.data.orders
              : Object.values(res.data?.orders || {});
            const valid = raw.filter((o) => o && (o.orderId || o.order_id || o.totalPrice));
            setProductOrdersList(valid);
          } else {
            setProductOrdersList([]);
          }
        })
        .catch(() => setProductOrdersList([]));

      userfetchTempleBookings(userId)
        .then((res) => {
          const raw = res?.data?.data || res?.data?.bookings || [];
          const valid = (Array.isArray(raw) ? raw : []).filter((t) => t && (t.id || t.temple_name));
          setTempleBookingsList(valid);
        })
        .catch(() => setTempleBookingsList([]));

      userfetchPrasadBooking(userId)
        .then((res) => {
          const raw = res?.data?.data || [];
          const valid = (Array.isArray(raw) ? raw : []).filter((p) => p && (p.id || p.prasad_name || p.booking_id));
          setPrasadBookingsList(valid);
        })
        .catch(() => setPrasadBookingsList([]));

      userfetchYogaBooking(userId)
        .then((res) => {
          const raw = res?.data?.data || [];
          const valid = (Array.isArray(raw) ? raw : []).filter((y) => y && (y.id || y.session_name));
          setYogaBookingsList(valid);
        })
        .catch(() => setYogaBookingsList([]));

      getUserPujaBookings(userId)
        .then((res1) => {
          const pujas1 = res1?.data?.data || [];
          getBookings(userId)
            .then((res2) => {
              const pujas2 = res2?.data?.data || [];
              const combined = [...pujas1, ...pujas2];
              const valid = combined.filter((p) => p && (p.id || p.pooja_name || p.puja_name || p.problem_title));
              setPoojaBookingsList(valid);
              setPoojaCount(valid.length);
            })
            .catch(() => {
              const valid = (Array.isArray(pujas1) ? pujas1 : []).filter((p) => p && (p.id || p.pooja_name || p.puja_name));
              setPoojaBookingsList(valid);
              setPoojaCount(valid.length);
            });
        })
        .catch(() => {
          setPoojaBookingsList([]);
          setPoojaCount(0);
        });

      api
        .get(`/request/showforuser/${userId}/chat`)
        .then((res) => {
          if (res?.data?.data && Array.isArray(res.data.data)) {
            const valid = res.data.data.filter((c) => c && (c.id || c.request_id || c.name));
            setChatRequestsList(valid);
          } else {
            setChatRequestsList([]);
          }
        })
        .catch(() => setChatRequestsList([]));

      getAllTiketsByUserId(userId)
        .then((res) => {
          if (res?.data?.success && Array.isArray(res.data.data)) {
            const valid = res.data.data.filter((t) => t && (t.id || t.ticket_id || t.issue_type));
            setSupportTicketsList(valid);
          } else {
            setSupportTicketsList([]);
          }
        })
        .catch(() => setSupportTicketsList([]));
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    }
  };

  useEffect(() => {
    let interval = null;
    if (emailOtpSent && emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [emailOtpSent, emailTimer]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage({ uri: URL.createObjectURL(file), file });
    }
  };

  useEffect(() => {
    if (selectedImage) handleImageUpload();
  }, [selectedImage]);

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    const data = new FormData();
    data.append("profileImage", selectedImage.file);

    setImageLoading(true);
    try {
      const response = await userUploadProfile(user1?.id, data);
      if (response && (response.status === 200 || response.data?.success)) {
        Swal.fire({
          icon: "success",
          title: "Profile Photo Updated! 🙏",
          text: "Your profile photo has been refreshed successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        await userGet();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload your photo. Please try an image under 5MB.",
      });
    } finally {
      setImageLoading(false);
      setSelectedImage(null);
    }
  };

  const handleFetchUserCity = async (pin) => {
    if (pin.length === 6) {
      try {
        const cityData = await getUserCityByPincode(pin);
        if (cityData?.district && cityData?.state) {
          setCity(cityData.district);
          setState(cityData.state);
        }
      } catch (err) {
        console.error("Pincode lookup error:", err);
      }
    }
  };

  const handleSendEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmailInput)) {
      Swal.fire("Invalid Email", "Please enter a valid email address", "warning");
      return;
    }
    setEmailOtpLoading(true);
    try {
      const res = await login({ email: newEmailInput });
      if (res && res.status === 200) {
        setEmailOtpSent(true);
        setEmailTimer(60);
        Swal.fire({
          icon: "info",
          title: "Verification Code Sent",
          text: `A 6-digit verification OTP has been sent to ${newEmailInput}.`,
          confirmButtonColor: "#ea580c",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not send verification code. Try again.", "error");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const otpCode = emailOtp.join("");
    if (otpCode.length !== 6) {
      Swal.fire("Incomplete OTP", "Please enter the complete 6-digit OTP", "warning");
      return;
    }

    setEmailOtpLoading(true);
    try {
      const res = await userOTP({ email: newEmailInput, otp: otpCode });
      if (res && res.status === 200) {
        setEmail(newEmailInput);
        setIsEditingEmail(false);
        setEmailOtpSent(false);
        setEmailOtp(["", "", "", "", "", ""]);
        Swal.fire({
          icon: "success",
          title: "Email Verified! ✅",
          text: "Your new email address is verified. Remember to save changes below.",
          confirmButtonColor: "#ea580c",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Invalid OTP", "The verification code is incorrect or expired.", "error");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newArr = [...emailOtp];
    newArr[index] = value.slice(-1);
    setEmailOtp(newArr);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire("Required", "Please enter your first name", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        lastname,
        gender,
        email,
        city,
        country,
        address,
        state,
        postalCode,
      };

      const response = await updateUserData(user1?.id, payload);
      if (response && (response.status === 200 || response.data?.success)) {
        Swal.fire({
          icon: "success",
          title: "Profile & Address Saved! 🙏",
          text: "Your personal details and delivery address have been updated.",
          confirmButtonColor: "#ea580c",
        });
        await userGet();
      }
    } catch (error) {
      console.error("Save profile error:", error);
      Swal.fire("Error", "Failed to save profile details. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleInitiateWalletRecharge = async (amount) => {
    if (!user1?.id) return;
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10) {
      Swal.fire("Invalid Amount", "Minimum recharge amount is ₹10", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    setWalletRecharging(true);

    try {
      const order = await api.post(
        "/payment/create-payment",
        {
          amount: numAmount,
          currency: "INR",
          user_id: user1.id,
          puja: "Astrology",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const razorpayKey =
        order.data?.key_id ||
        order.data?.data?.key_id ||
        process.env.REACT_APP_RAZORPAY_KEY_ID ||
        "rzp_test_J3QKwQbU1OGf1Y";

      const options = {
        key: razorpayKey,
        amount: order.data.data.amount,
        currency: "INR",
        name: "Prabhu Pooja Devotee Wallet",
        description: `Wallet Recharge of ₹${numAmount}`,
        order_id: order.data.data.id,
        handler: async function (response) {
          try {
            await api.post(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            Swal.fire({
              icon: "success",
              title: "Recharge Successful! 🎉",
              text: `₹${numAmount} added to your Pooja Wallet.`,
              confirmButtonColor: "#ea580c",
            });
            await userGet();
          } catch (error) {
            console.error("Verification error:", error);
            Swal.fire("Verification Failed", "Payment could not be verified.", "error");
          }
        },
        prefill: {
          email: user1.email,
          contact: user1.mobile,
          name: user1.name,
        },
        theme: { color: "#ea580c" },
        method: { upi: true, qr: true },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Wallet recharge error:", err);
      Swal.fire("Error", "Could not start payment gateway. Please try again.", "error");
    } finally {
      setWalletRecharging(false);
    }
  };

  const handleCreateSupportTicketInline = async (e) => {
    e.preventDefault();
    const cleanPhone = ticketPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      Swal.fire("Invalid Mobile", "Please enter a valid 10-digit mobile number", "warning");
      return;
    }
    if (!ticketIssueType) {
      Swal.fire("Category Required", "Please select an issue category", "warning");
      return;
    }

    setSubmittingTicket(true);
    try {
      const res = await userTicketCreate({
        issue_type: ticketIssueType,
        description: ticketDescription,
        user_id: user1.id,
        email: ticketEmail,
        phone: cleanPhone,
      });

      if (res?.success || res?.status === 200 || res?.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Ticket Raised Successfully! 🙏",
          text: "Our devotee care team will review your query within 2 hours.",
          confirmButtonColor: "#ea580c",
        });
        setTicketDescription("");
        setTicketIssueType("");
        setShowRaiseTicketModal(false);
        getAllTiketsByUserId(user1.id).then((r) => {
          if (r?.data?.success && Array.isArray(r.data.data)) {
            setSupportTicketsList(r.data.data);
          }
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not submit ticket. Please try again.", "error");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to sign out from Prabhu Pooja?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Logout",
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  if (loading) {
    return (
      <div className="devotee-dashboard-loading">
        <TailSpin height="50" width="50" color="#ea580c" />
        <p>Loading your sacred profile...</p>
      </div>
    );
  }

  const userAvatarSrc = user1?.image || user1?.profileImage || user1?.profile_image || profileimg;

  return (
    <div className="devotee-dashboard-page">
      <div className="container">
        <div className="dashboard-hero-banner">
          <div className="hero-avatar-area">
            <div className="hero-avatar-wrap">
              <img src={userAvatarSrc} alt="Devotee" className="hero-avatar-img" />
              <label htmlFor="userProfileUpload" className="hero-avatar-upload-btn" title="Change Avatar">
                <FaCamera />
                <input
                  type="file"
                  id="userProfileUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              {imageLoading && (
                <div className="avatar-loading-spinner">
                  <Oval color="#fff" height={24} width={24} />
                </div>
              )}
            </div>

            <div className="hero-user-details">
              <h2>
                Namaste {user1?.name ? `${user1.name} ${user1?.lastname || ""}` : "Devotee"} 🙏
              </h2>
              <p className="hero-mobile">
                <FaPhoneAlt className="hero-mini-icon" /> {user1?.mobile || "Registered Devotee"}
                {user1?.email && (
                  <>
                    <span>•</span>
                    <span className="hero-email-badge">{user1.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="hero-wallet-card" onClick={() => setActiveTab("wallet")} style={{ cursor: "pointer" }}>
            <div className="hero-wallet-left">
              <span className="hw-label">Pooja Wallet Balance</span>
              <span className="hw-balance">₹ {Number(user1?.balance || 0).toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="hw-recharge-btn"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("wallet");
              }}
            >
              + Recharge
            </button>
          </div>
        </div>

        <div className="dashboard-grid-layout">
          <div className="dashboard-sidebar-nav">
            <div className="sidebar-nav-list">
              <button
                type="button"
                className={`nav-tab-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser className="nav-tab-icon" /> Personal Information
              </button>

              <button
                type="button"
                className={`nav-tab-item ${activeTab.startsWith("orders") ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingCart className="nav-tab-icon" /> My Orders & Bookings
              </button>

              <button
                type="button"
                className={`nav-tab-item ${activeTab === "chats" ? "active" : ""}`}
                onClick={() => setActiveTab("chats")}
              >
                <IoChatbox className="nav-tab-icon" /> Chat Consultations
              </button>

              <button
                type="button"
                className={`nav-tab-item ${activeTab === "wallet" ? "active" : ""}`}
                onClick={() => setActiveTab("wallet")}
              >
                <FaWallet className="nav-tab-icon" /> Wallet & Recharge
              </button>

              <button
                type="button"
                className={`nav-tab-item ${activeTab === "support" ? "active" : ""}`}
                onClick={() => setActiveTab("support")}
              >
                <MdOutlineSupportAgent className="nav-tab-icon" /> 24/7 Devotee Care
              </button>

              <button
                type="button"
                className="nav-tab-item logout-tab-btn"
                onClick={handleLogout}
              >
                <MdLogout className="nav-tab-icon" /> Logout Account
              </button>
            </div>
          </div>

          <div className="dashboard-main-panel">
            {activeTab === "profile" && (
              <div className="panel-content-card">
                <div className="panel-header">
                  <h3>
                    <FaUser className="panel-title-icon" /> Personal Profile Details
                  </h3>
                  <p>Keep your contact and address details up to date for consecrated Prasad delivery & Vedic Sankalp.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <div className="form-grid-2">
                    <div className="form-input-box">
                      <label>First Name <span className="req">*</span></label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter First Name"
                        className="custom-field"
                        required
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter Last Name"
                        className="custom-field"
                      />
                    </div>
                  </div>

                  <div className="form-input-box">
                    <label>Gender</label>
                    <div className="gender-radio-group">
                      {["Male", "Female", "Other"].map((g) => (
                        <label key={g} className="gender-radio-lbl">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={gender === g}
                            onChange={(e) => setGender(e.target.value)}
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-input-box">
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        value={mobile}
                        disabled
                        className="custom-field disabled-field"
                      />
                    </div>
                    <div className="form-input-box">
                      <label>
                        Email Address{" "}
                        <span className="verified-chip">
                          <FaCheckCircle /> Verified
                        </span>
                      </label>

                      {!isEditingEmail ? (
                        <div className="email-display-row">
                          <input
                            type="email"
                            value={email || "No email added"}
                            disabled
                            className="custom-field disabled-field"
                          />
                          <button
                            type="button"
                            className="change-email-btn"
                            onClick={() => {
                              setIsEditingEmail(true);
                              setNewEmailInput(email || "");
                            }}
                          >
                            Change Email
                          </button>
                        </div>
                      ) : (
                        <div className="email-otp-box">
                          <div className="new-email-input-wrap">
                            <input
                              type="email"
                              value={newEmailInput}
                              onChange={(e) => setNewEmailInput(e.target.value)}
                              placeholder="Enter New Email"
                              className="custom-field"
                              disabled={emailOtpSent}
                            />
                            {!emailOtpSent ? (
                              <button
                                type="button"
                                className="send-otp-btn"
                                onClick={handleSendEmailOtp}
                                disabled={emailOtpLoading}
                              >
                                {emailOtpLoading ? "Sending..." : "Send OTP"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="cancel-edit-email-btn"
                                onClick={() => {
                                  setIsEditingEmail(false);
                                  setEmailOtpSent(false);
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>

                          {emailOtpSent && (
                            <div className="otp-verification-section">
                              <p className="otp-instruct-text">
                                Enter 6-digit code sent to <strong>{newEmailInput}</strong>:
                              </p>
                              <div className="otp-digits-container">
                                {emailOtp.map((digit, idx) => (
                                  <input
                                    key={idx}
                                    ref={(el) => (otpRefs.current[idx] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="otp-digit-box"
                                    autoFocus={idx === 0}
                                  />
                                ))}
                              </div>

                              <div className="otp-action-row">
                                <button
                                  type="button"
                                  className="verify-otp-btn"
                                  onClick={handleVerifyEmailOtp}
                                  disabled={emailOtpLoading}
                                >
                                  {emailOtpLoading ? "Verifying..." : "Verify & Link Email"}
                                </button>
                                {emailTimer > 0 ? (
                                  <span className="otp-resend-timer">Resend OTP in {emailTimer}s</span>
                                ) : (
                                  <button
                                    type="button"
                                    className="resend-otp-btn"
                                    onClick={handleSendEmailOtp}
                                  >
                                    Resend Code
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-input-box">
                    <label>Full Delivery / Residential Address</label>
                    <textarea
                      rows="2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No, Landmark, Colony, Street"
                      className="custom-textarea"
                    />
                  </div>

                  <div className="form-grid-3">
                    <div className="form-input-box">
                      <label>Pincode</label>
                      <input
                        type="text"
                        maxLength="6"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          handleFetchUserCity(e.target.value);
                        }}
                        placeholder="6-digit PIN"
                        className="custom-field"
                      />
                    </div>
                    <div className="form-input-box">
                      <label>City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="custom-field"
                      />
                    </div>
                    <div className="form-input-box">
                      <label>State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="custom-field"
                      />
                    </div>
                  </div>

                  <div className="form-action-row">
                    <button type="submit" className="save-profile-btn" disabled={saving}>
                      {saving ? "Saving Changes..." : "Save Profile Details 🙏"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="panel-content-card">
                <div className="panel-header">
                  <h3>
                    <FaShoppingCart className="panel-title-icon" /> My Orders & Sacred Bookings
                  </h3>
                  <p>View your active Pooja rituals, Vedic products, Temple Darshan, Prasad and Yoga sessions.</p>
                </div>

                <div className="orders-dashboard-grid">
                  <div className="order-category-box" onClick={() => setActiveTab("orders_product")}>
                    <div className="oc-top">
                      <span className="oc-icon oc-cart"><BsCart /></span>
                      <span className="oc-count-pill">{productOrdersList.length} Orders</span>
                    </div>
                    <h4>Product Orders</h4>
                    <p>Track delivery of divine idols, gemstones, yantras & samagri.</p>
                    <button type="button" className="oc-link-btn">
                      View Product Orders <FaArrowRight />
                    </button>
                  </div>

                  <div className="order-category-box" onClick={() => setActiveTab("orders_pooja")}>
                    <div className="oc-top">
                      <span className="oc-icon oc-pooja"><FaPrayingHands /></span>
                      <span className="oc-count-pill">{poojaCount} Pujas</span>
                    </div>
                    <h4>Online & Vedic Poojas</h4>
                    <p>Live darshan recordings, sankalp details & certified pandit seva.</p>
                    <button type="button" className="oc-link-btn">
                      View Pooja Bookings <FaArrowRight />
                    </button>
                  </div>

                  <div className="order-category-box" onClick={() => setActiveTab("orders_prasad")}>
                    <div className="oc-top">
                      <span className="oc-icon oc-prasad"><IoRestaurantOutline /></span>
                      <span className="oc-count-pill">{prasadBookingsList.length} Prasads</span>
                    </div>
                    <h4>Prasad Seva</h4>
                    <p>Sacred sanctified prasad dispatched directly from ancient temples.</p>
                    <button type="button" className="oc-link-btn">
                      View Prasad Bookings <FaArrowRight />
                    </button>
                  </div>

                  <div className="order-category-box" onClick={() => setActiveTab("orders_temple")}>
                    <div className="oc-top">
                      <span className="oc-icon oc-temple"><MdTempleHindu /></span>
                      <span className="oc-count-pill">{templeBookingsList.length} Temples</span>
                    </div>
                    <h4>Temple Darshan & VIP Pass</h4>
                    <p>Reserved tickets & special entry at prominent pilgrimage centers.</p>
                    <button type="button" className="oc-link-btn">
                      View Temple Bookings <FaArrowRight />
                    </button>
                  </div>

                  <div className="order-category-box" onClick={() => setActiveTab("orders_yoga")}>
                    <div className="oc-top">
                      <span className="oc-icon oc-yoga"><TbYoga /></span>
                      <span className="oc-count-pill">{yogaBookingsList.length} Sessions</span>
                    </div>
                    <h4>Yoga & Meditation</h4>
                    <p>Vedic wellness classes and spiritual rejuvenation sessions.</p>
                    <button type="button" className="oc-link-btn">
                      View Yoga Sessions <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders_product" && (
              <div className="panel-content-card">
                <div className="sub-panel-top-bar">
                  <button type="button" className="sub-back-btn" onClick={() => setActiveTab("orders")}>
                    <FaArrowLeft /> Back to All Bookings
                  </button>
                  <span className="sub-counter-badge">{productOrdersList.length} Orders</span>
                </div>
                <div className="panel-header">
                  <h3>
                    <BsCart className="panel-title-icon" /> Product Orders & Holy Items
                  </h3>
                  <p>Real-time tracking and delivery updates for your purchased spiritual items.</p>
                </div>
                {productOrdersList.length === 0 ? (
                  <div className="dash-empty-state">
                    <FaBoxOpen size={48} color="#ea580c" />
                    <h4>No Product Orders Placed Yet</h4>
                    <p>Browse our divine store for energized yantras, idols, gemstones and pooja samagri.</p>
                    <Link to="/ecomerce" className="dash-empty-btn">Explore Pooja Store 🙏</Link>
                  </div>
                ) : (
                    <div className="dash-items-grid">
                    {productOrdersList.map((order, idx) => {
                      const imgs = parseImages(order.images);
                      const qtys = parseQuantities(order.quantity, imgs.length || 1);
                      
                      // Resolve live progress status
                      const rawStatus = (
                        order.order_progress_status ||
                        order.status ||
                        order.order_status ||
                        order.statusName ||
                        "Placed"
                      ).trim();
                      const lower = rawStatus.toLowerCase();
                      const isDelivered = lower.includes("deliver") || lower.includes("complete");
                      const isDispatched = lower.includes("dispatch") || lower.includes("transit") || lower.includes("ship");
                      const isProcessing = lower.includes("process") || lower.includes("pack");
                      const isCancelled = lower.includes("cancel") || lower.includes("error");

                      const badgeBg = isDelivered ? "#dcfce7" : isDispatched ? "#e0f2fe" : isProcessing ? "#fef3c7" : isCancelled ? "#fee2e2" : "#fef9c3";
                      const badgeColor = isDelivered ? "#15803d" : isDispatched ? "#0369a1" : isProcessing ? "#b45309" : isCancelled ? "#b91c1c" : "#a16207";
                      const badgeIcon = isDelivered ? "✅ " : isDispatched ? "🚚 " : isProcessing ? "⏳ " : isCancelled ? "❌ " : "📦 ";

                      return (
                        <div key={order.orderId || idx} className="dash-order-item-card">
                          <div className="do-header">
                            <span className="do-id">Order #{order.orderId}</span>
                            <span 
                              style={{
                                backgroundColor: badgeBg,
                                color: badgeColor,
                                padding: "4px 10px",
                                borderRadius: "9999px",
                                fontSize: "11.5px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.4px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                border: `1px solid ${badgeBg}`
                              }}
                            >
                              {badgeIcon}{rawStatus}
                            </span>
                          </div>
                          <div className="do-images-row">
                            {imgs.length > 0 ? (
                              imgs.map((img, i) => (
                                <div key={i} className="do-thumb-wrap">
                                  <img src={img} alt="Product" className="do-thumb-img" />
                                  <span className="do-qty-badge">×{qtys[i] || 1}</span>
                                </div>
                              ))
                            ) : (
                              <div className="do-no-img">No Image Available</div>
                            )}
                          </div>
                          <div className="do-footer">
                            <span className="do-price">₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}</span>
                            <Link to={`/track-order/${order.orderId}`} className="do-track-link">
                              <FaTruck /> Track Order
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders_pooja" && (
              <div className="panel-content-card">
                <div className="sub-panel-top-bar">
                  <button type="button" className="sub-back-btn" onClick={() => setActiveTab("orders")}>
                    <FaArrowLeft /> Back to All Bookings
                  </button>
                  <span className="sub-counter-badge">{poojaBookingsList.length} Pujas</span>
                </div>
                <div className="panel-header">
                  <h3>
                    <FaPrayingHands className="panel-title-icon" /> Online & Vedic Puja Bookings
                  </h3>
                  <p>Your scheduled Vedic Sankalp, Kaal Sarp Dosh, and Temple Online Pujas.</p>
                </div>
                {poojaBookingsList.length === 0 ? (
                  <div className="dash-empty-state">
                    <FaPrayingHands size={48} color="#ea580c" />
                    <h4>No Online Puja Bookings Yet</h4>
                    <p>Book live sanctified rituals performed by certified Vedic pandits in ancient tirthas.</p>
                    <Link to="/onlinepuja" className="dash-empty-btn">Explore Online Pujas 🙏</Link>
                  </div>
                ) : (
                  <div className="dash-items-grid">
                    {poojaBookingsList.map((puja, idx) => (
                      <div key={puja.id || idx} className="dash-booking-card">
                        <div className="db-top">
                          <h4>{puja.pooja_name || puja.puja_name || puja.problem_title || "Vedic Puja Seva"}</h4>
                          <span className="db-amount">₹{puja.price || puja.amount || "501"}</span>
                        </div>
                        <p className="db-meta">
                          <strong>Sankalp:</strong> {puja.sankalp_name || puja.devotee_name || user1?.name || "Devotee"} ({puja.gotra || "Kashyap"})
                        </p>
                        <p className="db-meta">
                          <FaRegCalendarAlt /> {puja.date || puja.booking_date || "Upcoming Auspicious Muhurat"}
                        </p>
                        <div className="db-status-row">
                          <span className="status-chip status-complete">Confirmed ✅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders_prasad" && (
              <div className="panel-content-card">
                <div className="sub-panel-top-bar">
                  <button type="button" className="sub-back-btn" onClick={() => setActiveTab("orders")}>
                    <FaArrowLeft /> Back to All Bookings
                  </button>
                  <span className="sub-counter-badge">{prasadBookingsList.length} Prasads</span>
                </div>
                <div className="panel-header">
                  <h3>
                    <IoRestaurantOutline className="panel-title-icon" /> Prasad Seva Bookings
                  </h3>
                  <p>Divine sanctified temple prasad dispatched directly to your doorstep.</p>
                </div>
                {prasadBookingsList.length === 0 ? (
                  <div className="dash-empty-state">
                    <IoRestaurantOutline size={48} color="#ea580c" />
                    <h4>No Prasad Bookings Yet</h4>
                    <p>Order consecrated prasad directly from Mahakaleshwar, Kashi Vishwanath, Ayodhya & more.</p>
                    <Link to="/prasaddelivery" className="dash-empty-btn">Order Temple Prasad 🙏</Link>
                  </div>
                ) : (
                  <div className="dash-items-grid">
                    {prasadBookingsList.map((prasad, idx) => (
                      <div key={prasad.id || idx} className="dash-booking-card">
                        <div className="db-top">
                          <h4>{prasad.prasad_name || "Sacred Temple Prasad"}</h4>
                          <span className="db-amount">₹{prasad.amount || "251"}</span>
                        </div>
                        <p className="db-meta"><strong>Sankalp:</strong> {prasad.sankalpa_name} ({prasad.sankalpa_gotra})</p>
                        <p className="db-meta"><FaRegCalendarAlt /> {prasad.booking_date ? new Date(prasad.booking_date).toLocaleDateString("en-IN") : "Recent"}</p>
                        <span className="status-chip status-complete">Dispatched 🚚</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders_temple" && (
              <div className="panel-content-card">
                <div className="sub-panel-top-bar">
                  <button type="button" className="sub-back-btn" onClick={() => setActiveTab("orders")}>
                    <FaArrowLeft /> Back to All Bookings
                  </button>
                  <span className="sub-counter-badge">{templeBookingsList.length} Temples</span>
                </div>
                <div className="panel-header">
                  <h3>
                    <MdTempleHindu className="panel-title-icon" /> Temple Darshan & VIP Pass
                  </h3>
                  <p>Reserved tickets & VIP access for holy shrines and pilgrimage centers.</p>
                </div>
                {templeBookingsList.length === 0 ? (
                  <div className="dash-empty-state">
                    <MdTempleHindu size={48} color="#ea580c" />
                    <h4>No Temple Darshan Bookings Yet</h4>
                    <p>Book VIP entry and fast-track Darshan passes for prominent ancient temples.</p>
                    <Link to="/temple" className="dash-empty-btn">View Holy Temples 🏛️</Link>
                  </div>
                ) : (
                  <div className="dash-items-grid">
                    {templeBookingsList.map((t, idx) => (
                      <div key={t.id || idx} className="dash-booking-card">
                        <h4>{t.temple_name || "Temple Darshan Pass"}</h4>
                        <p className="db-meta"><strong>Devotees:</strong> {t.devotees_count || 1} Person(s)</p>
                        <p className="db-meta"><FaRegCalendarAlt /> {t.darshan_date || "Confirmed Date"}</p>
                        <span className="status-chip status-complete">Confirmed Pass 🎟️</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders_yoga" && (
              <div className="panel-content-card">
                <div className="sub-panel-top-bar">
                  <button type="button" className="sub-back-btn" onClick={() => setActiveTab("orders")}>
                    <FaArrowLeft /> Back to All Bookings
                  </button>
                  <span className="sub-counter-badge">{yogaBookingsList.length} Sessions</span>
                </div>
                <div className="panel-header">
                  <h3>
                    <TbYoga className="panel-title-icon" /> Yoga & Meditation Sessions
                  </h3>
                  <p>Vedic yoga and pranayama sessions booked with certified yoga masters.</p>
                </div>
                {yogaBookingsList.length === 0 ? (
                  <div className="dash-empty-state">
                    <TbYoga size={48} color="#ea580c" />
                    <h4>No Yoga Sessions Booked Yet</h4>
                    <p>Experience spiritual rejuvenation, pranayama, and yogic healing.</p>
                    <Link to="/yoga" className="dash-empty-btn">Explore Yoga Sessions 🧘</Link>
                  </div>
                ) : (
                  <div className="dash-items-grid">
                    {yogaBookingsList.map((y, idx) => (
                      <div key={y.id || idx} className="dash-booking-card">
                        <h4>{y.session_name || "Vedic Yoga Session"}</h4>
                        <p className="db-meta"><FaRegCalendarAlt /> {y.session_date || "Scheduled"}</p>
                        <span className="status-chip status-complete">Active Session ✅</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "chats" && (
              <div className="panel-content-card">
                <div className="panel-header">
                  <h3>
                    <IoChatbox className="panel-title-icon" /> Pandit Chat & Astrology Consultations
                  </h3>
                  <p>Direct chat consultations with verified Vedic astrologers and purohits.</p>
                </div>
                {chatRequestsList.length === 0 ? (
                  <div className="dash-empty-state">
                    <IoChatbox size={48} color="#ea580c" />
                    <h4>No Chat History Available</h4>
                    <p>Connect with experienced astrologers for Kundali matching, career, health, and marriage advice.</p>
                    <Link to="/astrology" className="dash-empty-btn">Consult Astrologer Online 🕉️</Link>
                  </div>
                ) : (
                  <div className="dash-chats-list">
                    {chatRequestsList.map((chat) => (
                      <div key={chat.id} className="dash-chat-item-card">
                        <div className="dci-avatar">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                            alt="Pandit"
                            className="dci-pandit-img"
                          />
                        </div>
                        <div className="dci-info">
                          <h4>Pt. {chat.name} {chat.lastname || ""}</h4>
                          <p className="dci-meta">
                            <span>Experience: {chat.experience || "5"} Years</span> • <span>Rate: ₹{chat.price || "15"}/min</span>
                          </p>
                          <span className="dci-time">
                            <FaRegCalendarAlt style={{ marginRight: "4px" }} />
                            {moment(chat.updated_at).format("DD MMM YYYY, hh:mm A")}
                          </span>
                        </div>
                        <div className="dci-action">
                          <button
                            type="button"
                            className="dci-open-chat-btn"
                            onClick={() =>
                              navigate("/chatshistoryuser", {
                                state: {
                                  requestId: chat.request_id,
                                  name: chat.name,
                                  date: chat.updated_at,
                                },
                              })
                            }
                          >
                            <FaComments /> Open Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="panel-content-card">
                <div className="panel-header">
                  <h3>
                    <FaWallet className="panel-title-icon" /> Pooja Wallet & Instant Recharge
                  </h3>
                  <p>Recharge your wallet instantly to consult astrologers, perform pujas, and order prasad seamlessly.</p>
                </div>
                <div className="wallet-tab-card">
                  <div className="wt-balance-hero">
                    <div className="wt-balance-left">
                      <span className="wt-label">Available Balance</span>
                      <h2 className="wt-amount">₹ {Number(user1?.balance || 0).toFixed(2)}</h2>
                    </div>
                    <span className="wt-safe-badge"><FaShieldAlt /> 100% Secure Payments</span>
                  </div>
                  <div className="wt-recharge-section">
                    <h4 className="wt-section-title">Select Recharge Amount:</h4>
                    <div className="wt-quick-chips">
                      {[100, 250, 500, 1000, 2100, 5100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className={`wt-chip ${Number(customRechargeAmount) === amt ? "active" : ""}`}
                          onClick={() => setCustomRechargeAmount(amt)}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <div className="wt-custom-input-box">
                      <label>Or Enter Custom Amount (₹):</label>
                      <input
                        type="number"
                        min="10"
                        value={customRechargeAmount}
                        onChange={(e) => setCustomRechargeAmount(e.target.value)}
                        className="custom-field"
                        placeholder="e.g. 500"
                      />
                    </div>
                    <button
                      type="button"
                      className="wt-pay-btn"
                      disabled={walletRecharging}
                      onClick={() => handleInitiateWalletRecharge(customRechargeAmount)}
                    >
                      {walletRecharging ? (
                        <span>Processing Payment...</span>
                      ) : (
                        <span>
                          <FaCreditCard style={{ marginRight: "8px" }} />
                          Recharge ₹{customRechargeAmount} via UPI / Card / NetBanking 🙏
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="panel-content-card">
                {selectedTicketDetail ? (
                  /* In-Place Ticket Detail View */
                  <div className="in-dash-ticket-detail">
                    <div className="sub-panel-top-bar">
                      <button
                        type="button"
                        className="sub-back-btn"
                        onClick={() => setSelectedTicketDetail(null)}
                      >
                        <FaArrowLeft /> Back to Support Tickets
                      </button>
                      <span className={`status-chip status-${(selectedTicketDetail.status || "pending").toLowerCase().includes("resolved") ? "complete" : (selectedTicketDetail.status || "pending").toLowerCase().includes("progress") ? "shipped" : "pending"}`}>
                        {selectedTicketDetail.status || "Pending"}
                      </span>
                    </div>

                    <div className="ticket-detail-hero">
                      <div className="tdh-header">
                        <FaTicketAlt className="tdh-icon" />
                        <div>
                          <h3>Support Ticket #{selectedTicketDetail.ticket_id}</h3>
                          <p className="tdh-category">{selectedTicketDetail.issue_type}</p>
                        </div>
                      </div>

                      <div className="tdh-meta-grid">
                        <div className="tdh-meta-item">
                          <span>Submitted On</span>
                          <strong>
                            {selectedTicketDetail.submitted_date
                              ? new Date(selectedTicketDetail.submitted_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                              : "Recent"}
                          </strong>
                        </div>
                        <div className="tdh-meta-item">
                          <span>Resolved Date</span>
                          <strong>
                            {selectedTicketDetail.response_date
                              ? new Date(selectedTicketDetail.response_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                              : "Under Review (Within 2 Hours)"}
                          </strong>
                        </div>
                        <div className="tdh-meta-item">
                          <span>Registered Mobile</span>
                          <strong>{selectedTicketDetail.phone || user1?.mobile || "Registered Devotee"}</strong>
                        </div>
                        <div className="tdh-meta-item">
                          <span>Registered Email</span>
                          <strong>{selectedTicketDetail.email || user1?.email || "N/A"}</strong>
                        </div>
                      </div>

                      <div className="ticket-msg-box devotee-query-box">
                        <h4><FaHeadset /> Your Submitted Query / Issue Details</h4>
                        <p>{selectedTicketDetail.description || "No description provided."}</p>
                      </div>

                      <div className="ticket-msg-box admin-response-box">
                        <h4><FaCheckCircle /> Devotee Care Resolution & Update</h4>
                        <p>
                          {selectedTicketDetail.response ||
                            "🙏 Namaste Devotee! Our spiritual support team is actively reviewing your query. You will receive an update here shortly."}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Support Tickets Hub & List */
                  <>
                    <div className="support-tab-header-row">
                      <div className="panel-header" style={{ marginBottom: 0 }}>
                        <h3>
                          <MdOutlineSupportAgent className="panel-title-icon" /> 24/7 Devotee Care & Support
                        </h3>
                        <p>Track resolution of your support tickets or raise a new request directly.</p>
                      </div>
                      <button
                        type="button"
                        className="raise-ticket-tab-btn"
                        onClick={() => setShowRaiseTicketModal(!showRaiseTicketModal)}
                      >
                        <FaPlusCircle /> {showRaiseTicketModal ? "Close Form" : "Raise New Ticket"}
                      </button>
                    </div>

                    {showRaiseTicketModal && (
                      <div className="inline-ticket-form-card">
                        <div className="itf-header">
                          <h4><FaHeadset /> Raise New Support Ticket</h4>
                          <button type="button" className="close-itf-btn" onClick={() => setShowRaiseTicketModal(false)}>
                            ✕ Close
                          </button>
                        </div>
                        <form onSubmit={handleCreateSupportTicketInline} className="itf-form">
                          <div className="form-grid-2">
                            <div className="form-input-box">
                              <label>Email Address <span className="req">*</span></label>
                              <input
                                type="email"
                                value={ticketEmail}
                                onChange={(e) => setTicketEmail(e.target.value)}
                                required
                                className="custom-field"
                              />
                            </div>
                            <div className="form-input-box">
                              <label>10-Digit Mobile Number <span className="req">*</span></label>
                              <input
                                type="tel"
                                maxLength="10"
                                value={ticketPhone}
                                onChange={(e) => setTicketPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                placeholder="e.g. 9876543210"
                                required
                                className="custom-field"
                              />
                              {ticketPhone && ticketPhone.length !== 10 && (
                                <span className="field-hint-error">Must be 10 digits ({ticketPhone.length}/10)</span>
                              )}
                            </div>
                          </div>
                          <div className="form-input-box">
                            <label>Issue Category <span className="req">*</span></label>
                            <select
                              value={ticketIssueType}
                              onChange={(e) => setTicketIssueType(e.target.value)}
                              required
                              className="custom-field"
                            >
                              <option value="">-- Select Issue Category --</option>
                              <option value="Online Pooja & Sankalp">🛕 Online Pooja & Sankalp</option>
                              <option value="Product & Store Order">📦 Product & Store Delivery</option>
                              <option value="Temple Darshan Booking">🏛️ Temple Darshan / Pass</option>
                              <option value="Pandit Chat & Call">💬 Pandit Consultation / Call</option>
                              <option value="Wallet & Payment">💳 Wallet Recharge / Payment</option>
                              <option value="Account & Login">🔐 Account & Verification</option>
                              <option value="Other Assistance">✨ Other Inquiries</option>
                            </select>
                          </div>
                          <div className="form-input-box">
                            <label>Describe Issue in Detail <span className="req">*</span></label>
                            <textarea
                              rows="3"
                              value={ticketDescription}
                              onChange={(e) => setTicketDescription(e.target.value)}
                              placeholder="Provide Booking ID, order info or issue details..."
                              required
                              className="custom-textarea"
                            />
                          </div>
                          <button type="submit" disabled={submittingTicket} className="submit-ticket-dash-btn">
                            {submittingTicket ? "Submitting Ticket..." : "Submit Ticket 🙏"}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Support KPI Stats Row */}
                    {supportTicketsList.length > 0 && (
                      <div className="support-dash-kpi-grid">
                        <div className="sdk-card">
                          <span className="sdk-num">{supportTicketsList.length}</span>
                          <span className="sdk-lbl">Total Tickets</span>
                        </div>
                        <div className="sdk-card">
                          <span className="sdk-num" style={{ color: "#d97706" }}>
                            {supportTicketsList.filter((t) => (t.status || "").toLowerCase().includes("pending")).length}
                          </span>
                          <span className="sdk-lbl">Pending Review</span>
                        </div>
                        <div className="sdk-card">
                          <span className="sdk-num" style={{ color: "#2563eb" }}>
                            {supportTicketsList.filter((t) => (t.status || "").toLowerCase().includes("progress")).length}
                          </span>
                          <span className="sdk-lbl">In Progress</span>
                        </div>
                        <div className="sdk-card">
                          <span className="sdk-num" style={{ color: "#16a34a" }}>
                            {supportTicketsList.filter((t) => (t.status || "").toLowerCase().includes("resolved")).length}
                          </span>
                          <span className="sdk-lbl">Resolved</span>
                        </div>
                      </div>
                    )}

                    {/* Filter Chips & Search Bar */}
                    {supportTicketsList.length > 0 && (
                      <div className="support-filter-search-row">
                        <div className="support-filter-chips">
                          {["all", "pending", "in progress", "resolved"].map((st) => (
                            <button
                              key={st}
                              type="button"
                              className={`sf-chip ${ticketStatusFilter === st ? "active" : ""}`}
                              onClick={() => setTicketStatusFilter(st)}
                            >
                              {st === "all" ? `All (${supportTicketsList.length})` : `${st.charAt(0).toUpperCase() + st.slice(1)} (${supportTicketsList.filter((t) => (t.status || "").toLowerCase().includes(st)).length})`}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Search by Ticket ID or Topic..."
                          value={ticketSearchQuery}
                          onChange={(e) => setTicketSearchQuery(e.target.value)}
                          className="support-search-field"
                        />
                      </div>
                    )}

                    {supportTicketsList.length === 0 ? (
                      <div className="dash-empty-state">
                        <FaTicketAlt size={48} color="#ea580c" />
                        <h4>No Support Tickets Found</h4>
                        <p>Have a question or facing an issue? Raise a ticket and our team will resolve it quickly.</p>
                        <button type="button" className="dash-empty-btn" onClick={() => setShowRaiseTicketModal(true)}>
                          <FaPlusCircle /> Create Support Ticket 🙏
                        </button>
                      </div>
                    ) : (
                      <div className="dash-tickets-table-wrap">
                        <table className="dash-tickets-table">
                          <thead>
                            <tr>
                              <th>Ticket ID</th>
                              <th>Category</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {supportTicketsList
                              .filter((ticket) => {
                                const matchFilter =
                                  ticketStatusFilter === "all" ||
                                  (ticket.status || "").toLowerCase().includes(ticketStatusFilter);
                                const q = ticketSearchQuery.toLowerCase();
                                const matchSearch =
                                  !q ||
                                  (ticket.ticket_id && ticket.ticket_id.toLowerCase().includes(q)) ||
                                  (ticket.issue_type && ticket.issue_type.toLowerCase().includes(q));
                                return matchFilter && matchSearch;
                              })
                              .map((ticket, idx) => {
                                const statusClass = (ticket.status || "pending").toLowerCase();
                                return (
                                  <tr key={ticket.id || idx}>
                                    <td><span className="dt-id">#{ticket.ticket_id}</span></td>
                                    <td><strong>{ticket.issue_type}</strong></td>
                                    <td>
                                      <span className={`status-chip status-${statusClass.includes("resolved") ? "complete" : statusClass.includes("progress") ? "shipped" : "pending"}`}>
                                        {ticket.status || "Pending"}
                                      </span>
                                    </td>
                                    <td>{ticket.submitted_date ? new Date(ticket.submitted_date).toLocaleDateString("en-IN") : "Recent"}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="dt-view-link-btn"
                                        onClick={() => setSelectedTicketDetail(ticket)}
                                      >
                                        View Details →
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editprofile;

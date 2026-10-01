import React, { useState, useEffect } from "react";
import "./Signup.css";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaExclamationCircle, FaShieldAlt } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";

const spiritualSignupSlides = [
  {
    image: require("../Assets/login_illustrationsImg.png"),
    tag: "प्रभु पूजा • Sign Up",
    title: "Join Our Spiritual Community",
    description: "Book verified Pandits, order sacred Temple Prasadams, and access personalized Astrology services.",
  },
  {
    image: require("../Assets/loginImage.png"),
    tag: "पवित्र प्रसाद • Divine Grace",
    title: "Temple Prasad At Your Home",
    description: "Order certified Prasadams directly from sacred shrines and holy Jyotirlingas with complete purity.",
  },
  {
    image: require("../Assets/littlekrishnafront.jpg"),
    tag: "वैदिक अनुष्ठान • Vedic Rituals",
    title: "Authentic Puja & Hawan Services",
    description: "Personalized online and offline pujas performed strictly in accordance with Vedic scriptures.",
  },
  {
    image: require("../Assets/ramji1.jpg"),
    tag: "ज्योतिष परामर्श • Astrology",
    title: "Expert Guidance for Life & Career",
    description: "Receive insightful Kundli matching, horoscope predictions, and remedial guidance from Acharyas.",
  },
  {
    image: require("../Assets/adhiyogi1.jpg"),
    tag: "आध्यात्मिक यात्रा • Spiritual Path",
    title: "Transform Your Devotional Journey",
    description: "Empowering millions of devotees worldwide to preserve and celebrate our eternal Sanatan culture.",
  },
];

const Signup = ({ closeSingClose, onOpenLogin }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const { register, sendRegistrationOtp, userGet } = useAuthStore();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState("");

  // 🖼️ Dynamic Image Slideshow
  const [currentSlide, setCurrentSlide] = useState(() =>
    Math.floor(Math.random() * spiritualSignupSlides.length)
  );

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spiritualSignupSlides.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeSingClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSingClose]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL ||
      process.env.REACT_APP_BASE_URL ||
      "";
    const currentPath = window.location.pathname;
    window.location.href = `${backendUrl}/auth/google?state=${encodeURIComponent(
      currentPath
    )}`;
  };

  const validateMobile = (number) => {
    return /^[6-9]\d{9}$/.test(number.trim());
  };

  const validateEmailFormat = (emailVal) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim());
  };

  // 1. Send Email Verification OTP
  const handleSendEmailOtp = async () => {
    setErrorMessage("");
    setSuccessInfo("");

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setErrorMessage("Please enter your email address first.");
      return;
    }

    if (!validateEmailFormat(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoadingOtp(true);
    try {
      const res = await sendRegistrationOtp({
        email: cleanEmail,
        name: cleanName || "User",
      });

      if (res?.data?.success || res?.status === 200) {
        setOtpSent(true);
        setTimer(60);
        setSuccessInfo(`Verification OTP sent to ${cleanEmail}`);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Unable to connect to server. Please check your internet connection."
          : error?.message) ||
        "Failed to send verification OTP. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoadingOtp(false);
    }
  };

  // 2. Submit Registration & Auto-Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessInfo("");

    const cleanName = name.trim();
    const cleanLastname = lastname.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();
    const cleanOtp = otp.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your First Name.");
      return;
    }

    if (!cleanLastname) {
      setErrorMessage("Please enter your Last Name.");
      return;
    }

    if (!cleanMobile || !validateMobile(cleanMobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!cleanEmail || !validateEmailFormat(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!otpSent) {
      setErrorMessage("Please verify your email address before continuing.");
      return;
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      setErrorMessage("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    const payload = {
      name: cleanName,
      lastname: cleanLastname,
      mobile: cleanMobile,
      email: cleanEmail,
      role: "0",
      otp: cleanOtp,
    };

    try {
      setFormLoading(true);
      const response = await register(payload);

      if (
        response?.data?.success ||
        response?.status === 200 ||
        response?.status === 201
      ) {
        try {
          await userGet?.();
        } catch (fetchErr) {
          console.warn("User state refresh notice:", fetchErr);
        }

        Swal.fire({
          title: "Registration Successful!",
          text: "Welcome to Prabhu Pooja! You are now logged in.",
          icon: "success",
          confirmButtonColor: "#cd5702",
          confirmButtonText: "Explore Now",
          timer: 2500,
          timerProgressBar: true,
        }).then(() => {
          closeSingClose?.();
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Cannot connect to server. Please check your internet or server status."
          : error?.message) ||
        "Registration failed. Please verify the OTP and try again.";
      setErrorMessage(message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div
      className="signup-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSingClose?.();
      }}
    >
      <div className="signup-modal-card">
        <button
          className="signup-close-btn"
          onClick={closeSingClose}
          aria-label="Close modal"
        >
          <IoClose />
        </button>

        <div className="signup-modal-layout">
          {/* Left Hero Dynamic Slideshow */}
          <div className="signup-modal-left">
            {spiritualSignupSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`signup-slide-bg ${
                  idx === currentSlide ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}

            <div className="signup-left-overlay">
              <div className="signup-left-content">
                <span className="signup-brand-tag">
                  {spiritualSignupSlides[currentSlide].tag}
                </span>
                <h2>{spiritualSignupSlides[currentSlide].title}</h2>
                <p>{spiritualSignupSlides[currentSlide].description}</p>
                
                <div className="signup-features-list">
                  <div className="signup-feature-pill">
                    <FaCheckCircle className="pill-icon" /> Fast & Simple Email Verification
                  </div>
                  <div className="signup-feature-pill">
                    <FaShieldAlt className="pill-icon" /> 100% Verified Authentic Services
                  </div>
                </div>

                {/* Slide Dots */}
                <div className="signup-slide-dots">
                  {spiritualSignupSlides.map((_, idx) => (
                    <span
                      key={idx}
                      className={`signup-dot ${
                        idx === currentSlide ? "active" : ""
                      }`}
                      onClick={() => setCurrentSlide(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="signup-modal-right">
            <div className="signup-form-wrapper">
              <div className="signup-header-section">
                <img
                  src={require("../Assets/logo-Prabhupooja.png")}
                  alt="PrabhuPooja Logo"
                  className="signup-brand-logo"
                />
                <h3 className="signup-heading">Create an Account</h3>
                <p className="signup-subheading">
                  Sign up with verified email & basic details
                </p>
              </div>

              {errorMessage && (
                <div className="signup-alert-error">
                  <FaExclamationCircle className="alert-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successInfo && (
                <div className="signup-alert-success">
                  <FaCheckCircle className="alert-icon" />
                  <span>{successInfo}</span>
                </div>
              )}

              <form className="signup-form-grid" onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="signup-input-field">
                  <label htmlFor="first-name">First Name *</label>
                  <input
                    id="first-name"
                    type="text"
                    placeholder="e.g. Sonu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="signup-input-field">
                  <label htmlFor="last-name">Last Name *</label>
                  <input
                    id="last-name"
                    type="text"
                    placeholder="e.g. Kushwaha"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="signup-input-field field-full-width">
                  <label htmlFor="signup-mobile">Mobile Number *</label>
                  <input
                    id="signup-mobile"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    required
                  />
                </div>

                {/* Email Address + Verify Button */}
                <div className="signup-input-field field-full-width">
                  <div className="signup-label-row">
                    <label htmlFor="signup-email">Email Address *</label>
                    {otpSent && (
                      <span className="signup-verified-badge">
                        <FaCheckCircle /> OTP Sent
                      </span>
                    )}
                  </div>
                  <div className="signup-email-row">
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={`signup-send-otp-btn ${
                        otpSent ? "btn-resend-mode" : ""
                      }`}
                      onClick={handleSendEmailOtp}
                      disabled={loadingOtp || timer > 0}
                    >
                      {loadingOtp ? (
                        <span className="btn-inline-loader"></span>
                      ) : timer > 0 ? (
                        `Resend (${timer}s)`
                      ) : otpSent ? (
                        "Resend OTP"
                      ) : (
                        "Verify Email"
                      )}
                    </button>
                  </div>
                </div>

                {/* OTP Input Field */}
                {otpSent && (
                  <div className="signup-input-field field-full-width signup-otp-reveal">
                    <label htmlFor="signup-otp">Enter 6-Digit Email OTP *</label>
                    <div className="signup-otp-input-wrap">
                      <input
                        id="signup-otp"
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={otp}
                        autoFocus
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className="signup-otp-code-input"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="signup-primary-btn"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="btn-loading-state">
                      <span className="btn-spinner"></span> Creating Account...
                    </span>
                  ) : otpSent ? (
                    "Register & Auto-Login"
                  ) : (
                    "Continue & Register"
                  )}
                </button>
              </form>

              <div className="signup-switch-action">
                <span>Already have an account? </span>
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={onOpenLogin}
                >
                  Login now
                </button>
              </div>

              <div className="signup-divider">
                <span>OR</span>
              </div>

              <div className="signup-social-section">
                <button
                  type="button"
                  className="signup-google-btn"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google Logo"
                    className="google-icon"
                  />
                  <span>
                    {googleLoading ? "Connecting..." : "Continue with Google"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

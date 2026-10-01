import React, { useState, useEffect, useRef } from "react";
import "./NewLogin.css";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";

const spiritualSlides = [
  {
    image: require("../Assets/login_illustrationsImg.png"),
    tag: "प्रभु पूजा • PrabhuPooja",
    title: "Divine Blessings & Spiritual Journey",
    description: "Experience authentic Pujas, Prasad Delivery, Astrological consultations, and sacred Vedic rituals at your doorstep.",
  },
  {
    image: require("../Assets/loginImage.png"),
    tag: "पवित्र प्रसाद • Sacred Prasad",
    title: "Pure Temple Prasad Delivery",
    description: "Receive consecrated Maha Prasad from 12 Jyotirlingas and revered shrines delivered with divine sanctity.",
  },
  {
    image: require("../Assets/littlekrishnafront.jpg"),
    tag: "वैदिक पूजा • Vedic Rituals",
    title: "Verified Vedic Pandits & Acharyas",
    description: "Book experienced Pandits for Griha Pravesh, Hawan, Rudrabhishek, and special ceremonies.",
  },
  {
    image: require("../Assets/ramji1.jpg"),
    tag: "ज्योतिष मार्गदर्शन • Astrology",
    title: "Accurate Kundli & Vedic Guidance",
    description: "Get personalized horoscope consultations and spiritual guidance from certified Vedic Astrologers.",
  },
  {
    image: require("../Assets/adhiyogi1.jpg"),
    tag: "आध्यात्मिक समुदाय • Devotee Network",
    title: "Trusted by 100,000+ Devotees",
    description: "Connecting devotees across the globe with eternal Sanatan traditions and authentic Vedic rituals.",
  },
];

const NewLogin = ({ onCloseLogin, onOpenSignup }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const { login, isLoading, setIsLoading, userOTP } = useAuthStore();
  const [resendTimer, setResendTimer] = useState(30);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);

  // 🖼️ Dynamic Image Slideshow
  const [currentSlide, setCurrentSlide] = useState(() =>
    Math.floor(Math.random() * spiritualSlides.length)
  );

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spiritualSlides.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseLogin?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCloseLogin]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timerInterval = null;
    if (otpSent && resendTimer > 0) {
      timerInterval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [otpSent, resendTimer]);

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

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;

    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMessage("");

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const validateInput = () => {
    const cleanInput = input.trim();
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanInput) {
      setInputError("Please enter your 10-digit Mobile Number or Email.");
      return false;
    }

    if (/^\d+$/.test(cleanInput)) {
      if (cleanInput.length !== 10) {
        setInputError("Mobile number must be exactly 10 digits.");
        return false;
      }
      if (!mobileRegex.test(cleanInput)) {
        setInputError("Please enter a valid 10-digit mobile number starting with 6-9.");
        return false;
      }
    } else if (!emailRegex.test(cleanInput)) {
      setInputError("Please enter a valid email address.");
      return false;
    }

    setInputError("");
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const response = await login({ input: input.trim() });
      if (response && response.data) {
        setOtpSent(true);
        setResendTimer(30);
        setSuccessMessage(
          response.data.message || `OTP sent successfully to ${input.trim()}`
        );
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (error) {
      console.error("Login send OTP failed:", error);
      const msg =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Unable to connect to server. Please check your internet connection."
          : error?.message) ||
        "Failed to send OTP. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const enteredOtp = otp.join("").trim();
    if (enteredOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await userOTP({
        input: input.trim(),
        otp: enteredOtp,
      });

      if (response?.data?.success || response?.status === 200) {
        setSuccessMessage("Login successful! Welcome back.");
        setTimeout(() => {
          onCloseLogin?.();
          window.dispatchEvent(new Event("loginStatusChanged"));
        }, 600);
      } else {
        throw new Error(response?.data?.message || "Invalid OTP code.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const msg =
        error?.response?.data?.message ||
        "Invalid OTP. Please check the code and try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInput = () => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div
      className="login-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseLogin?.();
      }}
    >
      <div className="login-modal-card">
        {/* Close Modal Button */}
        <button
          className="login-close-btn"
          onClick={onCloseLogin}
          aria-label="Close modal"
        >
          <IoClose />
        </button>

        <div className="login-modal-layout">
          {/* Left Hero Dynamic Slideshow */}
          <div className="login-modal-left">
            {spiritualSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`login-slide-bg ${
                  idx === currentSlide ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}

            <div className="login-left-overlay">
              <div className="login-left-content">
                <span className="login-brand-tag">
                  {spiritualSlides[currentSlide].tag}
                </span>
                <h2>{spiritualSlides[currentSlide].title}</h2>
                <p>{spiritualSlides[currentSlide].description}</p>
                
                <div className="login-features-list">
                  <div className="feature-pill">
                    <FaCheckCircle className="pill-icon" /> 100% Verified Vedic Pandits
                  </div>
                  <div className="feature-pill">
                    <FaCheckCircle className="pill-icon" /> Pure Temple Prasadam
                  </div>
                  <div className="feature-pill">
                    <FaCheckCircle className="pill-icon" /> Secure & Hassle-free
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="login-slide-dots">
                  {spiritualSlides.map((_, idx) => (
                    <span
                      key={idx}
                      className={`login-dot ${idx === currentSlide ? "active" : ""}`}
                      onClick={() => setCurrentSlide(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Form */}
          <div className="login-modal-right">
            <div className="login-form-wrapper">
              <div className="login-header-section">
                <img
                  src={require("../Assets/logo-Prabhupooja.png")}
                  alt="PrabhuPooja Logo"
                  className="login-brand-logo"
                />
                <h3 className="login-heading">Welcome to PrabhuPooja</h3>
                <p className="login-subheading">
                  {!otpSent
                    ? "Enter your Mobile Number or Email to continue"
                    : "Enter the 6-digit verification code"}
                </p>
              </div>

              {/* Alert Messages */}
              {errorMessage && (
                <div className="login-alert login-alert-error">
                  <FaExclamationCircle className="alert-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="login-alert login-alert-success">
                  <FaCheckCircle className="alert-icon" />
                  <span>{successMessage}</span>
                </div>
              )}

              {!otpSent ? (
                /* Step 1: Mobile / Email Input */
                <form onSubmit={handleSendOtp} className="login-form">
                  <div className="login-input-group">
                    <label htmlFor="user-input">Mobile Number or Email</label>
                    <div className="input-field-container">
                      <input
                        type="text"
                        id="user-input"
                        autoComplete="username"
                        autoFocus
                        placeholder="e.g. 9876543210 or name@example.com"
                        value={input}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d+$/.test(val)) {
                            setInput(val.slice(0, 10));
                          } else {
                            setInput(val);
                          }
                          if (inputError) setInputError("");
                        }}
                        onBlur={validateInput}
                        className={inputError ? "input-has-error" : ""}
                      />
                    </div>
                    {inputError && (
                      <span className="field-error-text">{inputError}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="login-primary-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading-state">
                        <span className="btn-spinner"></span> Sending OTP...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleVerifyOtp} className="login-form">
                  <div className="otp-sent-info">
                    <span>
                      OTP sent to: <strong>{input}</strong>
                    </span>
                    <button
                      type="button"
                      className="edit-number-btn"
                      onClick={handleEditInput}
                    >
                      <FaEdit /> Edit
                    </button>
                  </div>

                  <div className="login-input-group">
                    <label>Enter 6-Digit OTP</label>
                    <div className="login-otp-grid" onPaste={handlePaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className={`login-otp-box ${digit ? "filled" : ""}`}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="login-resend-wrapper">
                    {resendTimer > 0 ? (
                      <span className="timer-text">
                        Resend OTP in <strong>{resendTimer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="resend-action-btn"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                      >
                        Didn't receive code? <strong>Resend OTP</strong>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="login-primary-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading-state">
                        <span className="btn-spinner"></span> Verifying...
                      </span>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>
                </form>
              )}

              {/* Bottom Switch to Sign Up */}
              <div className="login-switch-action">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={onOpenSignup}
                >
                  Sign up now
                </button>
              </div>

              {/* Social Login Separator */}
              <div className="login-divider">
                <span>OR</span>
              </div>

              {/* Google One-Click Login */}
              <div className="login-social-section">
                <button
                  type="button"
                  className="login-google-btn"
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

export default NewLogin;

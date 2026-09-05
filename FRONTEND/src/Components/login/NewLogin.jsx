import React, { useState, useEffect, useRef } from "react";
import "./NewLogin.css";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";

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
      "http://localhost:3002";
    const currentPath = window.location.pathname;
    window.location.href = `${backendUrl}/auth/google?state=${encodeURIComponent(
      currentPath
    )}`;
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    // Allow single numeric digit
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
      setInputError("Please enter your Mobile Number or Email.");
      return false;
    }

    if (!mobileRegex.test(cleanInput) && !emailRegex.test(cleanInput)) {
      setInputError("Please enter a valid 10-digit mobile number or email.");
      return false;
    }

    setInputError("");
    return true;
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const cleanInput = input.trim();
      const response = await login({ input: cleanInput });

      if (response?.status === 200 || response?.status === 201 || response?.data?.success) {
        setSuccessMessage(`OTP sent successfully to ${cleanInput}`);
        setOtpSent(true);
        setResendTimer(30);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setErrorMessage(
          response?.data?.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Login request failed:", error);
      const serverMsg =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Cannot connect to server. Please check your internet connection or server status."
          : error?.message) ||
        "Login failed. Please try again later.";
      setErrorMessage(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();
    setErrorMessage("");
    setSuccessMessage("");
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await userOTP({ otp: otpCode, input: input.trim() });
      if (response?.status === 200 || response?.data?.success || response?.data?.auth) {
        setSuccessMessage("Login verified successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Invalid OTP. Please check the code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseLogin?.();
      }}
    >
      <div className="login-modal-card">
        {/* Close Button */}
        <button
          className="login-close-btn"
          onClick={onCloseLogin}
          aria-label="Close modal"
        >
          <IoClose />
        </button>

        <div className="login-modal-layout">
          {/* Left Decorative Illustration */}
          <div className="login-modal-left">
            <div className="login-left-overlay">
              <div className="login-left-content">
                <span className="login-brand-tag">प्रभु पूजा • PrabhuPooja</span>
                <h2>Divine Blessings & Spiritual Journey</h2>
                <p>
                  Experience authentic Pujas, Prasad Delivery, Astrological consultations, and sacred Vedic rituals at your doorstep.
                </p>
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
                          setInput(e.target.value);
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
                /* Step 2: 6-Digit OTP Verification */
                <form onSubmit={handleVerifyOtp} className="login-form">
                  <div className="otp-sent-info">
                    <span>
                      Code sent to <strong>{input}</strong>
                    </span>
                    <button
                      type="button"
                      className="edit-number-btn"
                      onClick={() => {
                        setOtpSent(false);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                    >
                      <FaEdit /> Change
                    </button>
                  </div>

                  <div className="login-otp-grid" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        id={`login-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className={`login-otp-box ${digit ? "filled" : ""}`}
                        autoComplete="one-time-code"
                      />
                    ))}
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
                        Didn’t receive OTP? <strong>Resend</strong>
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

              {/* Signup Link */}
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

              {/* Divider */}
              <div className="login-divider">
                <span>OR</span>
              </div>

              {/* Google OAuth Login */}
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

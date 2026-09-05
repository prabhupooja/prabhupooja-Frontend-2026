import React, { useState, useEffect } from "react";
import "./Signup.css";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";

const Signup = ({ closeSingClose, onOpenLogin }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { register } = useAuthStore();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      "http://localhost:3002";
    const currentPath = window.location.pathname;
    window.location.href = `${backendUrl}/auth/google?state=${encodeURIComponent(
      currentPath
    )}`;
  };

  const validateMobile = (number) => {
    return /^[6-9]\d{9}$/.test(number.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanName = name.trim();
    const cleanLastname = lastname.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();

    if (!cleanName || !cleanLastname || !cleanEmail || !cleanMobile) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!validateMobile(cleanMobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("lastname", cleanLastname);
    formData.append("mobile", cleanMobile);
    formData.append("email", cleanEmail);
    formData.append("role", "0");

    try {
      setFormLoading(true);
      const response = await register(formData);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        Swal.fire({
          title: "Registration Successful!",
          text: "Your account has been created. Please log in to continue.",
          icon: "success",
          confirmButtonColor: "#cd5702",
          confirmButtonText: "Go to Login",
        }).then(() => {
          onOpenLogin();
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error?.message === "Network Error"
          ? "Cannot connect to server. Please check your internet or server status."
          : error?.message) ||
        "Registration failed. Please try again later.";
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
          {/* Left Hero Banner */}
          <div className="signup-modal-left">
            <div className="signup-left-overlay">
              <div className="signup-left-content">
                <span className="signup-brand-tag">प्रभु पूजा • Sign Up</span>
                <h2>Join Our Spiritual Community</h2>
                <p>
                  Book verified Pandits, order sacred Temple Prasadams, and access personalized Astrology services.
                </p>
                <div className="signup-features-list">
                  <div className="signup-feature-pill">
                    <FaCheckCircle className="pill-icon" /> Fast & Simple Registration
                  </div>
                  <div className="signup-feature-pill">
                    <FaCheckCircle className="pill-icon" /> Verified Authentic Services
                  </div>
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
                  Sign up with your basic details to get started
                </p>
              </div>

              {errorMessage && (
                <div className="signup-alert-error">
                  <FaExclamationCircle className="alert-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="signup-form-grid" onSubmit={handleSubmit}>
                <div className="signup-input-field">
                  <label htmlFor="first-name">First Name *</label>
                  <input
                    id="first-name"
                    type="text"
                    placeholder="Enter first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="signup-input-field">
                  <label htmlFor="last-name">Last Name *</label>
                  <input
                    id="last-name"
                    type="text"
                    placeholder="Enter last name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </div>

                <div className="signup-input-field field-full-width">
                  <label htmlFor="signup-email">Email Address *</label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="signup-input-field field-full-width">
                  <label htmlFor="signup-mobile">Mobile Number *</label>
                  <input
                    id="signup-mobile"
                    type="tel"
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="signup-primary-btn"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="btn-loading-state">
                      <span className="btn-spinner"></span> Creating Account...
                    </span>
                  ) : (
                    "Create Account"
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

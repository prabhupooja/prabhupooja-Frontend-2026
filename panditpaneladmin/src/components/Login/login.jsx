import React, { useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import { Oval } from "react-loader-spinner";
import logo from "../../assets/LOGO-NEW1.png";
import { FaPhoneAlt, FaUserCheck, FaShieldAlt } from "react-icons/fa";

function Login() {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, setIsLoading } = useAuthStore();

  const validateInput = () => {
    const isNumeric = /^\d+$/.test(input);
    if (isNumeric) {
      if (!/^[6-9]\d{9}$/.test(input)) {
        setInputError("Please enter a valid 10-digit mobile number");
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        setInputError("Please enter a valid email address or 10-digit mobile number");
        return false;
      }
    }
    setInputError("");
    return true;
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d+$/.test(val)) {
      setInput(val.slice(0, 10));
    } else {
      setInput(val);
    }
    if (inputError) setInputError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!validateInput()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({ input });

      if (!response || !response.data) {
        throw new Error("Invalid response format");
      }

      if (response.data.success === false) {
        setErrorMessage(
          response.data.message ||
            "Account not found. Please register as a Pandit first."
        );
        return;
      }

      // Check if user is registered as a regular devotee/user instead of pandit
      if (
        response.data.role &&
        response.data.role !== "pandit" &&
        response.data.role !== "astrologer"
      ) {
        setErrorMessage(
          "This account is registered as a Devotee user, not an Acharya/Pandit. Please register with a Pandit account."
        );
        return;
      }

      navigate("/otp", { state: { inputOtp: input } });
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message ||
            "This email/mobile is not registered. Please register as a Pandit."
        );
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Login failed. Please verify your credentials or register.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pandit-login-wrapper">
      <div className="pandit-login-bg-overlay"></div>
      
      <div className="pandit-login-card">
        <div className="pandit-login-header">
          <div className="pandit-logo-container">
            <img src={logo} alt="Prabhu Pooja" className="pandit-brand-logo" />
          </div>
          <div className="pandit-vedic-symbol">🕉️</div>
          <h2 className="pandit-login-title">Pandit & Acharya Portal</h2>
          <p className="pandit-login-subtitle">
            Sign in to manage your Pujas, Consultations & Devotee Requests
          </p>
        </div>

        <form onSubmit={handleSubmit} className="pandit-login-form">
          <div className="input-field-group">
            <label htmlFor="mobile">Registered Mobile or Email</label>
            <div className="input-with-icon">
              <span className="field-icon">
                <FaPhoneAlt />
              </span>
              <input
                type="text"
                id="mobile"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile or email"
                autoComplete="off"
                required
              />
            </div>
            {inputError && <p className="field-error-msg">{inputError}</p>}
          </div>

          <button type="submit" className="pandit-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner-container">
                <Oval color="white" height={20} width={20} />
                <span> Sending OTP...</span>
              </div>
            ) : (
              "Send Verification OTP 🙏"
            )}
          </button>

          {errorMessage && <p className="global-error-msg">{errorMessage}</p>}
        </form>

        <div className="pandit-login-footer">
          <div className="footer-register-prompt">
            <span>New Acharya / Pandit? </span>
            <Link to="/register" className="register-now-link">
              Register as Pandit 🙏
            </Link>
          </div>

          <div className="security-badge">
            <FaShieldAlt className="shield-icon" />
            <span>100% Verified Vedic Astrologers & Acharyas Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

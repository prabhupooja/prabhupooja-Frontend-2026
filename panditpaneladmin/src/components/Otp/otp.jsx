import React, { useEffect, useRef, useState } from "react";
import "./otp.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import { Oval } from "react-loader-spinner";
import logo from "../../assets/LOGO-NEW1.png";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";

function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const inputTarget = location.state?.inputOTP || location.state?.inputOtp || "";
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { userOTP, isLoading, login, Loading, panditGet, logout } = useAuthStore();
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [canResend]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    let newOtpValues = [...otp];
    newOtpValues[index] = value;
    setOtp(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
      return;
    }
    try {
      const res = await userOTP({ otp: enteredOtp });
      if (res && res.data && res.data.success === false) {
        setErrorMessage(res.data.message || "Invalid OTP entered.");
        return;
      }

      // Verify that this token belongs to an actual registered Pandit
      const pProfile = await panditGet();
      if (!pProfile && !localStorage.getItem("panditUser")) {
        logout();
        setErrorMessage(
          "This account is not registered as an Acharya/Pandit. Please register as a Pandit first."
        );
        return;
      }

      navigate("/home");
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Invalid OTP or account not recognized as Pandit."
      );
    }
  };

  const resendOtp = async () => {
    if (!inputTarget) {
      return setErrorMessage("Session expired. Please back to login.");
    }
    try {
      const response = await login({ input: inputTarget });
      if (response && response.status === 200) {
        setTimer(60);
        setCanResend(false);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  const handleResendOtp = () => {
    setCanResend(false);
    resendOtp();
  };

  return (
    <div className="pandit-otp-wrapper">
      <div className="pandit-otp-bg-overlay"></div>

      <div className="pandit-otp-card">
        <div className="pandit-otp-header">
          <img src={logo} alt="Prabhu Pooja" className="pandit-otp-logo" />
          <div className="otp-om-symbol">🕉️</div>
          <h2 className="pandit-otp-title">Enter Verification Code</h2>
          <p className="pandit-otp-subtitle">
            We have sent a 6-digit OTP to{" "}
            <strong>{inputTarget || "your registered number"}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="pandit-otp-form">
          <div className="otp-digits-row">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                autoFocus={index === 0}
                placeholder="•"
                className="otp-digit-box"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          {errorMessage && <p className="otp-error-banner">{errorMessage}</p>}

          <button type="submit" className="otp-verify-btn" disabled={Loading}>
            {Loading ? (
              <div className="spinner-container">
                <Oval color="white" height={20} width={20} />
                <span> Verifying Code...</span>
              </div>
            ) : (
              "Verify & Access Dashboard 🙏"
            )}
          </button>

          <div className="otp-resend-area">
            {timer > 0 ? (
              <p className="otp-timer-text">Resend OTP in <span>{timer}s</span></p>
            ) : (
              canResend && (
                <button
                  type="button"
                  className="resend-action-btn"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend OTP"}
                </button>
              )
            )}
          </div>

          <div className="otp-footer-links">
            <Link to="/" className="back-login-link">
              <FaArrowLeft /> Change Mobile / Email
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Otp;

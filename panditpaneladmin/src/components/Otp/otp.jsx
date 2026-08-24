import React, { useEffect, useRef, useState } from "react";
import "./otp.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import { Oval } from 'react-loader-spinner';

function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const inputTarget = location.state?.inputOTP || location.state?.inputOtp || "";
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { userOTP, isLoading, login, Loading } = useAuthStore();
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    let newOtpValues = [...otp];
    newOtpValues[index] = value;
    setOtp(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join(""); // Rename variable to avoid conflict
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
      return;
    }
    try {
      await userOTP({ otp: enteredOtp }); // Use enteredOtp instead of otp
      navigate("/home");
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    }
  };

  const resendOtp = async () => {
    if (!inputTarget) {
      return setErrorMessage("Something went wrong, try after some time");
    }
    try {
      const response = await login({ input: inputTarget });
      if (response && response.status === 200) {
        setTimer(60);
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
    <div className="otp-container">
      <div className="otp-box">
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
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
                className="otp-input"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          {errorMessage && <p className="errorOtp">{errorMessage}</p>}

          <button type="submit" className="otp-btn">
            {Loading ? (
              <div className="spinner-container">
                <Oval color="white" height={24} width={24} />
                <span> Please Wait...</span>
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>

          <p className="otp-timer">
            {timer > 0 ? `Resend OTP in ${timer}s` : ""}
          </p>

          {canResend && (
            <span className="resend-otp" onClick={handleResendOtp}>
              {isLoading ? (
                <div className="spinner-container">
                  <Oval color="white" height={24} width={24} />
                  <span> Please Wait...</span>
                </div>
              ) : (
                "Resend OTP"
              )}
            </span>
          )}
        </form>
      </div>
    </div>
  );
}

export default Otp;

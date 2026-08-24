import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import logoImg from "../Assets/logo_Prabhupooja-removebg.png";

const Otp = ({ closeOtpPopup, inputOTP }) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const { userOTP, isLoading, login, Loading } = useAuthStore();

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

    let newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (otp.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
      return;
    }
    try {
      await userOTP({ otp });
      closeOtpPopup();
      window.location.reload();
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    }
  };

  const resendOtp = async () => {
    if (!inputOTP) {
      return setErrorMessage("something went worng, try after some time");
    }
    try {
      const response = await login({ input: inputOTP });
      if (response.status === 200) {
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
    <div className="overlaypop">
      <div className="loginPopup">
        <div className="addUser">
          <div className="closeBtn" onClick={closeOtpPopup}>
            <span className="ic--baseline-close" title="close"></span>
          </div>
          <div className="loginLogoImg">
            <img src={logoImg} alt="logo" />
          </div>
          <h3>Enter the OTP below</h3>
          <form className="addUserForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>We sent a 6-digit OTP to {inputOTP}</label>
              <div className="inputGroupOtp">
                <div className="otp-input-container">
                  {otpValues.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      maxLength="1"
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="otp-box"
                    />
                  ))}
                </div>
                {errorMessage && <p className="errorOtp">{errorMessage}</p>}
                <button type="submit" className="btn btn-primary">
                  {Loading ? "Please Wait..." : "Verify OTP"}
                </button>
                <p className="otp-timer">
                  {timer > 0 ? `Resend OTP in ${timer}s` : ""}
                </p>
                {canResend && (
                  <span className="resend-otp" onClick={handleResendOtp}>
                    {isLoading ? "Please Wait..." : "Resend OTP"}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Otp;

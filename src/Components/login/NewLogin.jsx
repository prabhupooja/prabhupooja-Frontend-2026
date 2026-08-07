import React, { useState } from "react";
import "./NewLogin.css";
import { IoClose } from "react-icons/io5";
import useAuthStore from "../../Store/UserStore/userAuthStore";

const NewLogin = ({ onCloseLogin, onOpenSignup }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const { login, isLoading, setIsLoading, userOTP } = useAuthStore();
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [validOtp, setValidOtp] = useState([  
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const currentPath = window.location.pathname;
    window.location.href = `https://prabhupooja-backend.onrender.com/auth/google?state=${encodeURIComponent(currentPath)}`;
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Prevent non-numeric input
    if (/[^0-9]/.test(value)) return;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
    validateOtp(index, value);
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateOtp = (index, value) => {
    setValidOtp((prevValidOtp) => {
      const newValidOtp = [...prevValidOtp];
      newValidOtp[index] = value !== "";
      return newValidOtp;
    });
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text");
    if (pastedData && pastedData.length === otp.length) {
      setOtp(pastedData.split(""));
      setValidOtp(pastedData.split("").map((digit) => digit !== ""));
      setTimeout(() => {
        const nextInput = document.getElementById(
          `otp-input-${otp.length - 1}`
        );
        if (nextInput) nextInput.focus();
      }, 0);
    }
  };

  const validateInput = () => {
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobileRegex.test(input) && !emailRegex.test(input)) {
      setInputError(
        "Please enter a valid 10-digit mobile number or email address"
      );
    } else {
      setInputError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setResendTimer(30);

    validateInput();

    try {
      const response = await login({ input });
      if (response.status === 200) {
        setMessage(`OTP Sent to ${input}`);
        setOtpSent(true);
        setErrorMessage("");
        const timerInterval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (response.status === 404) {
        setErrorMessage(
          response?.data?.message || "OTP Sending Error, Please Try Again."
        );
      } else {
        setErrorMessage("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Login failed. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
      setIsLoading(false);

      return;
    }
    try {
      const response = await userOTP({ otp: otpCode });
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      setMessage("");
      setIsLoading(false);

      setErrorMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    }
  };

  return (
    <div className="overlay">
      <div className="popupContainer">
        <button className="closeBtn" onClick={onCloseLogin}>
          <IoClose />
        </button>

        <div className="loginPopupContent">
          <div className="popupLeft"></div>

          <div className="popupRight">
            <div className="popupCard">
              <img
                src={require("../Assets/logo-Prabhupooja.png")}
                alt="Logo"
                className="signup-logo"
              />
              <p className="Loginsubtitle">Login into your account</p>

              <div className="inputGroup">
                <input
                  type="text"
                  id="input"
                  autoComplete="off"
                  placeholder="Enter your Mobile Number or Email"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onBlur={validateInput}
                />
              </div>

              {inputError && (
                <p className="login-error-message">{inputError}</p>
              )}
              {errorMessage && (
                <p className="login-error-message">{errorMessage}</p>
              )}

              {message && (
                <p className="login-error-message" style={{ color: "green" }}>
                  {message}
                </p>
              )}

              {!otpSent ? (
                <button
                  className="loginButton"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <div>
                  <div className="otpFields">
                    {otp.map((digit, index) => (
                      <input
                        id={`otp-input-${index}`}
                        key={index}
                        type="text"
                        value={digit}
                        maxLength="1"
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className={`otpInput ${
                          validOtp[index]
                            ? "valid"
                            : digit === ""
                            ? "normal"
                            : "invalid"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="resend-otp">
                    {resendTimer > 0 ? (
                      <span style={{ color: "gray" }}>
                        OTP sent. Please wait {resendTimer} second
                        {resendTimer > 1 ? "s" : ""}.
                      </span>
                    ) : (
                      <span onClick={handleSubmit}>
                        Didn’t receive the OTP? <strong>Resend</strong>
                      </span>
                    )}
                  </div>
                  <button className="loginButton" onClick={handleVerifyOtp}>
                    {isLoading ? "Verifying OTP..." : " Verify OTP"}
                  </button>
                </div>
              )}

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <span>
                  Don't have an account?{" "}
                  <button
                    style={{
                      color: "#3f51b5",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={onOpenSignup}
                  >
                    Signup now
                  </button>
                </span>
              </div>

              <div className="divider">OR</div>

              <div className="signupButtonCointainer">
                <div>
                  {googleLoading ? (
                    <button className="googleLoginbtn" disabled>
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                      />
                      Please Wait...
                    </button>
                  ) : (
                    <button
                      className="googleLoginbtn"
                      onClick={handleGoogleLogin}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                      />
                      Continue with Google
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;

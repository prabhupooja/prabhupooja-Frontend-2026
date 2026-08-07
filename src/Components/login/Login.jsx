import React, { useState } from "react";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import logoImg from "../Assets/logo_Prabhupooja-removebg.png";

const Login = ({ onCloseLogin, onOpenOtp, onOpenSignup, setLoginInput }) => {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, isLoading, setIsLoading } = useAuthStore();

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
    validateInput();
    if (inputError) {
      setIsLoading(false);
      return;
    }
    if (!input) {
      setInputError(
        "Please enter a valid 10-digit mobile number or email address"
      );
      setIsLoading(false);
    } else {
      try {
        const response = await login({ input });

        setLoginInput(input);

        if (!response || !response.data) {
          throw new Error("Invalid response format");
        }
        onOpenOtp();
        // console.log("Login success:", response);
      } catch (error) {
        console.error("Login failed:", error);

        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Login failed. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = "https://prabhupooja-backend.onrender.com/auth/google";
  };

  return (
    <>
      <div className="overlaypop">
        <div className="loginPopup">
          <div className="addUser">
            <div className="closeBtn" onClick={onCloseLogin}>
              <span className="ic--baseline-close" title="close"></span>
            </div>
            <div className="loginLogoImg">
              <img src={logoImg} alt="logo" />
            </div>
            <h3>Welcome Back !</h3>
            <form className="addUserForm" onSubmit={handleSubmit}>
              <div className="inputGroup">
                <label htmlFor="input">Mobile Number or Email</label>
                <div className="inputGroup1">
                  <input
                    type="text"
                    id="input"
                    autoComplete="off"
                    placeholder="Enter your Mobile Number or Email"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onBlur={validateInput}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary login-button"
                  >
                    {isLoading ? "Sending..." : "Send Otp"}
                  </button>
                  {/* <span onClick={onOpenOtp}>open</span> */}
                </div>
                {inputError && <p className="error">{inputError}</p>}
                {errorMessage && <p className="error">{errorMessage}</p>}
              </div>

              <div className="login">
                <p className="loginAccountNot">Don't have an Account? <Link
                  className="btn btn-success singnupBTn"
                  onClick={onOpenSignup}
                >
                  Sign Up
                </Link></p>
                {/* <Link to="http://localhost:3001/"><p>pandit login</p></Link> */}
                
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
                {/* <button type="submit" className="btn btn-success" onClick={handlePanditLogin}>Pandit Login</button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

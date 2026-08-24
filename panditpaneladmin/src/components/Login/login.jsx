import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
// Importing a simple spinner component if using react-loader-spinner
import { Oval } from 'react-loader-spinner';

function Login() {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, setIsLoading } = useAuthStore();

  const validateInput = () => {
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobileRegex.test(input) && !emailRegex.test(input)) {
      setInputError(
        "Please enter a valid 10-digit mobile number or email address"
      );
      return false;
    } else {
      setInputError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateInput()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({ input });

      if (!response || !response.data) {
        throw new Error("Invalid response format");
      }

      navigate("/otp", { state: { inputOtp: input } });
      console.log("Login success:", response);
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
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Pandit Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="mobile">Mobile Number or Email</label>
            <input
              type="text"
              id="mobile"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your Number or Email"
              required
            />
            {inputError && <p className="error">{inputError}</p>}
          </div>

          <button type="submit" className="login-btn">
            {isLoading ? (
              <div className="spinner-container">
                <Oval color="white" height={24} width={24} />
                <span> Sending OTP...</span>
              </div>
            ) : (
              "Send OTP"
            )}
          </button>

          {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;

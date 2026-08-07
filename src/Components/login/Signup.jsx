import React, { useState } from "react";
import "./Signup.css";
import { IoClose } from "react-icons/io5";
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

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = "https://prabhupooja-backend.onrender.com/auth/google";
  };

  const validateMobile = (number) => {
    return number.length === 10 && /^\d+$/.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !lastname || !email || !mobile) {
      return Swal.fire({
        title: "Missing Info",
        text: "Please fill in all required fields.",
        icon: "warning",
      });
    }

    if (!validateMobile(mobile)) {
      return Swal.fire({
        title: "Invalid Mobile Number",
        text: "Mobile number must be exactly 10 digits.",
        icon: "warning",
      });
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("role", "0"); 

    try {
      setFormLoading(true);
      const response = await register(formData);

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Registration successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
        onOpenLogin();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again later.";
      setErrorMessage(message);

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-container">
        <button className="closeBtn" onClick={closeSingClose}>
          <IoClose />
        </button>

        <div className="signup-form-container">
          <img
            src={require("../Assets/logo-Prabhupooja.png")}
            alt="Logo"
            className="signup-logo"
          />
          <p className="Loginsubtitle">Sign up into your account</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Mobile No."
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />

            <button type="submit" disabled={formLoading}>
              {formLoading ? "Please Wait..." : "Sign up"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <span>Already have an account? </span>
            <button
              style={{
                color: "#3f51b5",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={onOpenLogin}
            >
              Login now
            </button>
          </div>

          <div className="divider">OR</div>

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
              <button className="googleLoginbtn" onClick={handleGoogleLogin}>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                />
                Continue with Google
              </button>
            )}
          </div>
        </div>

        <div className="signup-illustration"></div>
      </div>
    </div>
  );
};

export default Signup;

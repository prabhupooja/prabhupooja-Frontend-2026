import React, { useState } from "react";
import "../../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";

const Signup = ({ closeSingClose, onOpenLogin }) => {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("0");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastnameError, setLastNameError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  // const [isLoginPopup, setIsLoginPopup] = useState(false)
  const [forLoading, setForLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
  

  // const openPopup = () => setIsLoginPopup(true);

  const navigate = useNavigate();

  const { register } = useAuthStore();

  const validateName = () => {
    if (name.trim() === "") {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
  };

  const validateLastName = () => {
    if (name.trim() === "") {
      setLastNameError("Lastname is required");
    } else {
      setLastNameError("");
    }
  };

  const validateNumber = () => {
    const regex = /^\d{10}$/;
    if (!regex.test(mobile)) {
      setNumberError("Please enter a valid 10-digit mobile number");
    } else {
      setNumberError("");
    }
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    document.getElementById("profileImage").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validations
    validateName();
    validateLastName();
    validateNumber();
    validateEmail();

    const hasErrors = nameError || numberError || emailError;

    if (hasErrors) {
      return; 
    }

    setForLoading(true); 

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("role", role);

    if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      const response = await register(formData);

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Registration Success",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Server Error, Retry After Some Time.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
      });

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setErrorMessage("Registration failed. Please try again later.");
      }
    } finally {
      setForLoading(false); 
    }
  };


  
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3002"}/auth/google`;
  };

  return (
    <>
      <div className="overlaypop">
        <div className="loginPopup">
          <div className="loginPopup1">
            <div className="addUser">
              <div className="closeBtn" onClick={closeSingClose}>
                <span className="ic--baseline-close" title="close"></span>
              </div>
              <h3>Create Your Account</h3>
              <form className="addUserForm" onSubmit={handleSubmit}>
                <div
                  onClick={handleImageClick}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        marginTop: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        fontSize: "18px",
                        color: "#888",
                      }}
                    >
                      Profile Picture
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                {/* Other Form Fields */}
                <div className="inputGroup">
                  <div className="singnupForm">
                    <div className="singnupFormInputes">
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        id="name"
                        autoComplete="off"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={validateName}
                      />
                      {nameError && <p className="error">{nameError}</p>}
                    </div>

                    <div className="singnupFormInputes">
                      <label htmlFor="name">Last Name:</label>
                      <input
                        type="text"
                        id="name"
                        autoComplete="off"
                        placeholder="Enter your lastname"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={validateLastName}
                      />
                      {nameError && <p className="error">{lastnameError}</p>}
                    </div>
                  </div>
                  <div className="singnupForm">
                    <div className="singnupFormInputes">
                      <label htmlFor="number">Number:</label>
                      <input
                        type="text"
                        id="number"
                        autoComplete="off"
                        placeholder="Enter your Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        onBlur={validateNumber}
                      />
                      {numberError && <p className="error">{numberError}</p>}
                    </div>
                    <div className="singnupFormInputes">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        autoComplete="off"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                      />
                      {emailError && <p className="error">{emailError}</p>}
                    </div>
                  </div>

                  <div className="singnupForm">
                    <div className="singnupFormInputes">
                      {/* <label htmlFor="role">Role:</label> */}
                      {/* <select
                        id="role"
                        style={{ padding: "10px" }}
                        className="role_select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="0">User</option>
                        <option value="1">Pandit</option>
                      </select> */}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success">
                    {forLoading ? "Waiting..." : "Sign Up"}
                  </button>
                </div>
              </form>
              <div className="login">
                <p className=" loginBtninsing-p loginAccountNot">Already have an Account? <Link onClick={onOpenLogin} className="btn btn-primary loginBtninsing">
                  Login
                </Link></p>
                
              </div>

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
              {/* <ToastContainer /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

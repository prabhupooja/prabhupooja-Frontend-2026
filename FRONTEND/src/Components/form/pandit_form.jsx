import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/panditform.css";
import profilepic from "../Assets/profile-pic.png";

const Pandit_form = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gotra, setGotra] = useState("");
  const [qualification, setQualification] = useState("");
  const [temple, setTemple] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [verified, setVerified] = useState("");
  const [gurukulCertificate, setGurukulCertificate] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPancard] = useState(null);
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("gotra", gotra);
    formData.append("qualification", qualification);
    formData.append("temple", temple);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("verified", verified);
    formData.append("language", language);
    formData.append("skills", skills);
    formData.append("gender", gender);
    if (gurukulCertificate)
      formData.append("gurukulCertificate", gurukulCertificate);
    if (aadharCard) formData.append("aadharCard", aadharCard);
    if (panCard) formData.append("panCard", panCard);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:3002/api/v1"}/pandit/CreatePandit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      // console.log("Pandit registration success:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again later.");
      }
    }
  };

  const handlesuccesspage = () => {
    navigate("/registrationsuccess");
  };

  const handlerejectedpage = () => {
    navigate("/rejectedpage");
  };

  return (
    <div className="addUser">
      <h3>Personal Information</h3>
      <form
        className="addUserFormpandit"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="inputGroup">
          <div className="row">
            <div className="col-12 option_fill col-md-12 text-center">
              <div className="form-group">
                <label
                  htmlFor="profileInput"
                  className="profileImageLabelpandit"
                >
                  <img
                    src={profilepic}
                    alt="user"
                    className="profileImageDefault"
                    width="100"
                    height="100"
                  />
                  <input
                    type="file"
                    className="inputfile"
                    name="profile"
                    id="profileInput"
                    // accept=".pdf,.jpeg,.png"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                  />
                  <h1
                    style={{ marginTop: "10px" }}
                    className="panditform_heading"
                  >
                    Profile Picture
                  </h1>
                </label>
              </div>
            </div>

            <div className="col-sm-6">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="Number">Number:</label>
              <input
                type="number"
                autoComplete="off"
                placeholder="Enter your Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                autoComplete="off"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="City">Gotra:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your gotra"
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="City">Acedemic qualification:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <label for="documents">Gurukul Certificate:</label>
              <input
                type="file"
                name="documents"
                id="documents"
                accept=".pdf,.jpeg,.png"
                onChange={(e) => setGurukulCertificate(e.target.files[0])}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="City">Temple:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your Temple"
                value={temple}
                onChange={(e) => setTemple(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <label for="documents">Aadhar Card:</label>
              <input
                type="file"
                name="documents"
                id="documents"
                accept=".pdf,.png,.jpeg"
                onChange={(e) => setAadharCard(e.target.files[0])}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label for="documents">Pan Card:</label>
              <input
                type="file"
                name="documents"
                id="documents"
                accept=".pdf,.png,.jpeg"
                onChange={(e) => setPancard(e.target.files[0])}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="City">language:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="City">Skills:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="City">City:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="state">State:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter your Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="gender">Gender:</label>
          <select
            style={{ padding: "10px" }}
            className="role_select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div className="login">
            <button
              type="submit"
              className="btn btn-success"
              onClick={handlerejectedpage}
            >
              Submit
            </button>
          </div>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Pandit_form;

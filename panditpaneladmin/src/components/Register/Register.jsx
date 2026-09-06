import React, { useState } from "react";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import api from "../Axios/api";
import logo from "../../assets/LOGO-NEW1.png";
import profileDefault from "../../assets/profileimg.jpg";
import Swal from "sweetalert2";
import { Oval } from "react-loader-spinner";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaUniversity,
  FaMapMarkerAlt,
  FaCamera,
  FaFileUpload,
  FaCheckCircle,
  FaShieldAlt,
  FaPrayingHands,
  FaPlus,
  FaTrashAlt,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCR)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const POPULAR_SACRED_CITIES = {
  "Uttar Pradesh": [
    "Varanasi (Kashi)",
    "Ayodhya",
    "Mathura",
    "Vrindavan",
    "Prayagraj",
    "Haridwar Region",
    "Lucknow",
    "Gorakhpur",
    "Naimisharanya",
    "Kanpur",
    "Noida / Greater Noida",
  ],
  "Madhya Pradesh": [
    "Ujjain (Mahakal Kshetra)",
    "Omkareshwar",
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Chitrakoot",
    "Maihar",
    "Gwalior",
    "Rewa",
  ],
  "Uttarakhand": [
    "Haridwar",
    "Rishikesh",
    "Dehradun",
    "Kedarnath / Rudraprayag",
    "Badrinath / Chamoli",
    "Uttarkashi",
    "Nainital",
  ],
  "Maharashtra": [
    "Nashik (Trimbakeshwar)",
    "Shirdi",
    "Pandharpur",
    "Kolhapur",
    "Mumbai",
    "Pune",
    "Nagpur",
    "Aurangabad (Chhatrapati Sambhajinagar)",
  ],
  "Gujarat": [
    "Dwarka",
    "Somnath / Veraval",
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Junagadh",
    "Ambaji",
  ],
  "Bihar": [
    "Gaya (Pind Daan Kshetra)",
    "Patna",
    "Muzaffarpur",
    "Darbhanga",
    "Bhagalpur",
    "Bodh Gaya",
    "Sitamarhi",
  ],
  "Rajasthan": [
    "Pushkar",
    "Jaipur",
    "Khatu Shyam / Sikar",
    "Salasar",
    "Udaipur",
    "Jodhpur",
    "Kota",
    "Nathdwara",
  ],
  "Odisha": [
    "Puri (Jagannath Dham)",
    "Bhubaneswar (Ekamra Kshetra)",
    "Cuttack",
    "Rourkela",
    "Sambalpur",
  ],
  "Tamil Nadu": [
    "Rameshwaram",
    "Madurai (Meenakshi)",
    "Kanchipuram",
    "Thanjavur",
    "Tiruchirappalli",
    "Chennai",
    "Coimbatore",
  ],
  "Andhra Pradesh": [
    "Tirupati (Balaji Kshetra)",
    "Srisailam",
    "Vijayawada",
    "Visakhapatnam",
    "Ahobilam",
  ],
  "Karnataka": [
    "Udupi",
    "Gokarna",
    "Murudeshwar",
    "Sringeri",
    "Bengaluru",
    "Mysuru",
  ],
  "Delhi (NCR)": [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "East Delhi",
  ],
  "West Bengal": [
    "Kolkata (Kalighat / Dakshineswar)",
    "Mayapur / Nabadwip",
    "Tarapith",
    "Siliguri",
  ],
  "Jharkhand": [
    "Deoghar (Baidyanath Dham)",
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Basukinath",
  ],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  "Haryana": ["Kurukshetra", "Gurugram", "Faridabad", "Panipat", "Karnal"],
  "Himachal Pradesh": ["Kangra (Jwalamukhi)", "Shimla", "Kullu / Manali", "Mandi"],
  "Telangana": ["Hyderabad", "Bhadrachalam", "Yadagirigutta", "Warangal"],
  "Kerala": ["Sabarimala", "Guruvayur", "Thiruvananthapuram", "Kochi"],
  "Assam": ["Guwahati (Kamakhya Dham)", "Dibrugarh", "Silchar"],
};

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    mobile: "",
    email: "",
    gotra: "",
    qualification: "",
    temple: "",
    city: "",
    state: "Uttar Pradesh",
    country: "India",
    language: "Hindi, Sanskrit",
    skills: "Vedic Puja, Rudrabhishek, Mahamrityunjay, Kaal Sarp Dosh, Vastu Shanti",
    experience: "5 Years",
    gender: "Male",
    price: 501,
    chat_price: 15,
    voice_price: 20,
    video_price: 25,
  });

  const [citySelectType, setCitySelectType] = useState("Varanasi (Kashi)");
  const [customCity, setCustomCity] = useState("");

  const [files, setFiles] = useState({
    profileImage: null,
    gurukulCertificate: null,
    aadharCard: null,
    panCard: null,
  });

  // Additional dynamic documents
  const [additionalDocs, setAdditionalDocs] = useState([]);

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMobileChange = (e) => {
    const cleanDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile: cleanDigits }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setFormData((prev) => ({ ...prev, state: newState }));
    const availableCities = POPULAR_SACRED_CITIES[newState] || [];
    if (availableCities.length > 0) {
      setCitySelectType(availableCities[0]);
      setFormData((prev) => ({ ...prev, city: availableCities[0] }));
    } else {
      setCitySelectType("other");
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleCitySelectChange = (e) => {
    const val = e.target.value;
    setCitySelectType(val);
    if (val === "other") {
      setFormData((prev) => ({ ...prev, city: customCity }));
    } else {
      setFormData((prev) => ({ ...prev, city: val }));
    }
  };

  const handleCustomCityChange = (e) => {
    const val = e.target.value;
    setCustomCity(val);
    setFormData((prev) => ({ ...prev, city: val }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));

      if (name === "profileImage") {
        setPreviewImage(URL.createObjectURL(file));
      }
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    if (fieldName === "profileImage") {
      setPreviewImage(null);
    }
  };

  // Additional documents handlers
  const handleAddExtraDoc = () => {
    setAdditionalDocs((prev) => [
      ...prev,
      { id: Date.now(), title: "", file: null },
    ]);
  };

  const handleExtraDocTitleChange = (id, title) => {
    setAdditionalDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title } : d))
    );
  };

  const handleExtraDocFileChange = (id, file) => {
    setAdditionalDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, file } : d))
    );
  };

  const handleRemoveExtraDoc = (id) => {
    setAdditionalDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire("Required", "Please enter your first name / Acharya title", "warning");
      return false;
    }
    const cleanMob = (formData.mobile || "").replace(/\D/g, "");
    if (!cleanMob || !/^[6-9]\d{9}$/.test(cleanMob)) {
      Swal.fire("Invalid Mobile", "Please enter a valid 10-digit Indian mobile number", "warning");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address", "warning");
      return false;
    }
    const finalCity = citySelectType === "other" ? customCity.trim() : formData.city.trim();
    if (!finalCity || !formData.state.trim()) {
      Swal.fire("Required", "Please select or type your city and state", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (files.profileImage) data.append("profileImage", files.profileImage);
      if (files.gurukulCertificate) data.append("gurukulCertificate", files.gurukulCertificate);
      if (files.aadharCard) data.append("aadharCard", files.aadharCard);
      if (files.panCard) data.append("panCard", files.panCard);

      // Append extra documents
      additionalDocs.forEach((doc, idx) => {
        if (doc.file) {
          data.append(`additionalDoc_${idx}`, doc.file);
          data.append(`additionalDocTitle_${idx}`, doc.title || `Certificate_${idx + 1}`);
        }
      });

      let response;
      try {
        response = await api.post("/pandit/CreatePandit", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (postErr) {
        if (postErr.response?.status === 404) {
          response = await api.post("/pandit/register", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          throw postErr;
        }
      }

      if (response && (response.status === 200 || response.status === 201 || response.data?.success)) {
        Swal.fire({
          icon: "success",
          title: "Registration Submitted! 🙏",
          text: "Your Pandit onboarding request along with verification documents has been submitted. Our Vedic board will review your credentials for approval.",
          confirmButtonColor: "#ea580c",
          confirmButtonText: "Proceed to Login",
        }).then(() => {
          navigate("/");
        });
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Pandit registration error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Registration could not be completed. Please check your details.";
      setErrorMessage(msg);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: msg,
        confirmButtonColor: "#ea580c",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableCities = POPULAR_SACRED_CITIES[formData.state] || [];

  return (
    <div className="pandit-register-wrapper">
      <div className="register-bg-glow"></div>

      <div className="pandit-register-container">
        {/* Header */}
        <div className="register-card-header">
          <Link to="/" className="register-brand-link">
            <img src={logo} alt="Prabhu Pooja" className="register-logo" />
          </Link>
          <div className="header-om-badge">🕉️</div>
          <h2 className="register-main-title">Vedic Pandit & Acharya Onboarding</h2>
          <p className="register-main-subtitle">
            Join India's Most Revered Spiritual Platform. Perform Pujas, Guide Devotees & Expand Your Seva.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-actual-form">
          {/* Section 1: Profile Photo & Basic Identity */}
          <div className="form-section-card">
            <h3 className="section-heading">
              <FaUser className="sec-icon" /> 1. Personal & Profile Information
            </h3>

            <div className="avatar-upload-row">
              <div className="avatar-picker-wrap">
                <img
                  src={previewImage || profileDefault}
                  alt="Profile Preview"
                  className="avatar-preview-circle"
                />
                <label htmlFor="profileImageInput" className="camera-badge-btn" title="Upload Live Profile Photo">
                  <FaCamera />
                  <input
                    type="file"
                    id="profileImageInput"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              <div className="avatar-picker-text">
                <div className="avatar-title-row">
                  <h4>Acharya Profile Photo <span className="req">*</span></h4>
                  {previewImage && (
                    <button
                      type="button"
                      className="remove-avatar-btn"
                      onClick={() => removeFile("profileImage")}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p>Upload a clear devotional photo in traditional attire. This is shown to devotees booking your pujas.</p>
                {files.profileImage && (
                  <span className="file-ready-tag">
                    <FaCheckCircle /> {files.profileImage.name} (Ready to upload)
                  </span>
                )}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group-item">
                <label>First Name / Title <span className="req">*</span></label>
                <div className="input-icon-box">
                  <FaUser className="field-svg" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Acharya Ramesh"
                    required
                  />
                </div>
              </div>

              <div className="form-group-item">
                <label>Last Name / Surname</label>
                <div className="input-icon-box">
                  <FaUser className="field-svg" />
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="e.g. Shastri / Sharma / Joshi"
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group-item">
                <label>10-Digit Mobile Number <span className="req">*</span></label>
                <div className="input-icon-box">
                  <FaPhoneAlt className="field-svg" />
                  <input
                    type="tel"
                    name="mobile"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleMobileChange}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    required
                  />
                </div>
                {formData.mobile && formData.mobile.length !== 10 && (
                  <span className="field-error-hint">Must be 10 digits ({formData.mobile.length}/10)</span>
                )}
              </div>

              <div className="form-group-item">
                <label>Email Address <span className="req">*</span></label>
                <div className="input-icon-box">
                  <FaEnvelope className="field-svg" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="acharya@domain.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group-item">
                <label>Gotra</label>
                <input
                  type="text"
                  name="gotra"
                  className="clean-input"
                  value={formData.gotra}
                  onChange={handleInputChange}
                  placeholder="e.g. Kashyap, Vashistha, Bharadwaj, Sandilya"
                />
              </div>

              <div className="form-group-item">
                <label>Gender</label>
                <select
                  name="gender"
                  className="clean-input"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vedic Qualifications & Experience */}
          <div className="form-section-card">
            <h3 className="section-heading">
              <FaGraduationCap className="sec-icon" /> 2. Vedic Qualifications & Specializations
            </h3>

            <div className="form-row-2">
              <div className="form-group-item">
                <label>Academic & Vedic Qualification</label>
                <div className="input-icon-box">
                  <FaGraduationCap className="field-svg" />
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g. Acharya / Shastri (Sampurnanand Sanskrit University)"
                  />
                </div>
              </div>

              <div className="form-group-item">
                <label>Years of Experience</label>
                <select
                  name="experience"
                  className="clean-input"
                  value={formData.experience}
                  onChange={handleInputChange}
                >
                  <option value="2-5 Years">2 - 5 Years</option>
                  <option value="5-10 Years">5 - 10 Years</option>
                  <option value="10-15 Years">10 - 15 Years</option>
                  <option value="15+ Years">15+ Years (Senior Purohit)</option>
                  <option value="25+ Years">25+ Years (Maha Acharya)</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group-item">
                <label>Languages Known</label>
                <input
                  type="text"
                  name="language"
                  className="clean-input"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g. Sanskrit, Hindi, English, Gujarati, Marathi"
                />
              </div>

              <div className="form-group-item">
                <label>Associated Mandir / Tirtha Kshetra</label>
                <div className="input-icon-box">
                  <FaUniversity className="field-svg" />
                  <input
                    type="text"
                    name="temple"
                    value={formData.temple}
                    onChange={handleInputChange}
                    placeholder="e.g. Mahakaleshwar Ujjain, Kashi Vishwanath, Ayodhya"
                  />
                </div>
              </div>
            </div>

            <div className="form-group-item full-width">
              <label>Pooja Skills & Specializations</label>
              <textarea
                name="skills"
                rows="2"
                className="clean-textarea"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g. Rudrabhishek, Mahamrityunjay Jaap, Kaal Sarp Dosh Shanti, Vastu Shanti, Navgrah Shanti, Vivah Sanskar"
              />
            </div>
          </div>

          {/* Section 3: Location Details (State & City Selectors) */}
          <div className="form-section-card">
            <h3 className="section-heading">
              <FaMapMarkerAlt className="sec-icon" /> 3. Location & Temple Base
            </h3>

            <div className="form-row-3">
              <div className="form-group-item">
                <label>Country</label>
                <select
                  name="country"
                  className="clean-input"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="India">India 🇮🇳</option>
                  <option value="Nepal">Nepal 🇳🇵</option>
                  <option value="Mauritius">Mauritius 🇲🇺</option>
                  <option value="USA">United States 🇺🇸</option>
                  <option value="UK">United Kingdom 🇬🇧</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group-item">
                <label>State / Region <span className="req">*</span></label>
                <select
                  name="state"
                  className="clean-input"
                  value={formData.state}
                  onChange={handleStateChange}
                  required
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-item">
                <label>City / Sacred Tirtha <span className="req">*</span></label>
                <select
                  className="clean-input"
                  value={citySelectType}
                  onChange={handleCitySelectChange}
                  required
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="other">✏️ Other City (Type manually)</option>
                </select>
              </div>
            </div>

            {citySelectType === "other" && (
              <div className="form-group-item full-width custom-city-box">
                <label>Enter Custom City Name <span className="req">*</span></label>
                <div className="input-icon-box">
                  <FaMapMarkerAlt className="field-svg" />
                  <input
                    type="text"
                    value={customCity}
                    onChange={handleCustomCityChange}
                    placeholder="Enter your city / village name"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Document Verification */}
          <div className="form-section-card">
            <h3 className="section-heading">
              <FaShieldAlt className="sec-icon" /> 4. Verification Documents & Certificates
            </h3>
            <p className="section-intro-text">
              Uploaded credentials ensure fast-track admin verification and grant the "Verified Acharya" seal.
            </p>

            <div className="form-row-3">
              {/* Gurukul Certificate */}
              <div className="doc-upload-box">
                <span className="doc-type-title">
                  Gurukul / Sanskrit Degree <span className="req">*</span>
                </span>
                {files.gurukulCertificate ? (
                  <div className="doc-uploaded-preview">
                    <FaFilePdf className="doc-preview-icon" />
                    <span className="doc-file-name" title={files.gurukulCertificate.name}>
                      {files.gurukulCertificate.name}
                    </span>
                    <button
                      type="button"
                      className="doc-remove-btn"
                      onClick={() => removeFile("gurukulCertificate")}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ) : (
                  <label className="doc-file-label">
                    <FaFileUpload className="upload-icon" />
                    <span>Upload Certificate (PDF/IMG)</span>
                    <input
                      type="file"
                      name="gurukulCertificate"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              {/* Aadhaar Card */}
              <div className="doc-upload-box">
                <span className="doc-type-title">
                  Aadhaar Card <span className="req">*</span>
                </span>
                {files.aadharCard ? (
                  <div className="doc-uploaded-preview">
                    <FaFileImage className="doc-preview-icon" />
                    <span className="doc-file-name" title={files.aadharCard.name}>
                      {files.aadharCard.name}
                    </span>
                    <button
                      type="button"
                      className="doc-remove-btn"
                      onClick={() => removeFile("aadharCard")}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ) : (
                  <label className="doc-file-label">
                    <FaFileUpload className="upload-icon" />
                    <span>Upload Aadhaar (PDF/IMG)</span>
                    <input
                      type="file"
                      name="aadharCard"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              {/* PAN Card */}
              <div className="doc-upload-box">
                <span className="doc-type-title">
                  PAN Card <span className="req">*</span>
                </span>
                {files.panCard ? (
                  <div className="doc-uploaded-preview">
                    <FaFileImage className="doc-preview-icon" />
                    <span className="doc-file-name" title={files.panCard.name}>
                      {files.panCard.name}
                    </span>
                    <button
                      type="button"
                      className="doc-remove-btn"
                      onClick={() => removeFile("panCard")}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ) : (
                  <label className="doc-file-label">
                    <FaFileUpload className="upload-icon" />
                    <span>Upload PAN (PDF/IMG)</span>
                    <input
                      type="file"
                      name="panCard"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Additional Documents Dynamic List */}
            {additionalDocs.length > 0 && (
              <div className="additional-docs-list">
                <h4 className="extra-docs-heading">Additional Certificates & Awards:</h4>
                {additionalDocs.map((doc, idx) => (
                  <div key={doc.id} className="extra-doc-item-row">
                    <input
                      type="text"
                      className="extra-doc-title-input"
                      placeholder="e.g. Jyotish Ratna / Temple Seva Certificate"
                      value={doc.title}
                      onChange={(e) => handleExtraDocTitleChange(doc.id, e.target.value)}
                    />
                    <label className="extra-doc-upload-label">
                      <FaFileUpload />
                      <span>{doc.file ? doc.file.name : "Choose File"}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleExtraDocFileChange(doc.id, e.target.files[0]);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      type="button"
                      className="remove-extra-doc-btn"
                      onClick={() => handleRemoveExtraDoc(doc.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="add-more-docs-row">
              <button
                type="button"
                className="add-doc-btn"
                onClick={handleAddExtraDoc}
              >
                <FaPlus /> Add Additional Document / Tirtha Certificate
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="form-error-banner">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Submit Action */}
          <div className="register-submit-row">
            <button
              type="submit"
              className="register-big-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-container">
                  <Oval color="white" height={22} width={22} />
                  <span> Submitting Acharya Onboarding...</span>
                </div>
              ) : (
                <>
                  <FaPrayingHands style={{ marginRight: "8px" }} /> Complete Pandit Registration
                </>
              )}
            </button>

            <div className="back-to-login-link-box">
              <span>Already registered as a Pandit? </span>
              <Link to="/">Sign In Here</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;


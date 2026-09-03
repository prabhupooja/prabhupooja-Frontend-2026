import React, { useEffect, useState } from "react";
import "./editprofile.css";
import useAuthStore from "../Store/AuthStore/AuthStore";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { IoChatbox } from "react-icons/io5";
import { FaPhoneAlt, FaVideo, FaPrayingHands } from "react-icons/fa";
import api from "../Axios/api";

function EditProfileForm() {
  const { pandit, updatePandit, panditGet } = useAuthStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("Pandittoken");

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    country: "India",
    gotra: "",
    qualification: "",
    language: "",
    temple: "",
    skills: "",
    price: 501,
    chat_price: 15,
    voice_price: 20,
    video_price: 25,
    experience: "",
    gender: "Male",
    profileImage: null,
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resolvedId, setResolvedId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        let pData = pandit;
        if (!pData) {
          const res = await panditGet();
          pData = res?.data || res;
        }

        if (!pData) {
          const res = await api.get("/users/getPanditByToken", {
            headers: { Authorization: `Bearer ${token}` },
          });
          pData = res?.data?.data || res?.data;
        }

        if (pData) {
          setResolvedId(pData.id);
          setFormData({
            name: pData.name || "",
            lastname: pData.lastname || "",
            email: pData.email || "",
            mobile: pData.mobile || "",
            city: pData.city || "",
            state: pData.state || "",
            country: pData.country || "India",
            gotra: pData.gotra || "",
            qualification: pData.qualification || "",
            language: pData.language || "",
            temple: pData.temple || "",
            skills: pData.skills || "",
            price: pData.price || 501,
            chat_price: pData.chat_price || pData.chatPrice || 15,
            voice_price: pData.voice_price || pData.voicePrice || 20,
            video_price: pData.video_price || pData.videoPrice || 25,
            experience: pData.experience || "",
            gender: pData.gender || "Male",
            profileImage: pData.profileImage || null,
          });

          if (pData.profileImage) {
            setProfilePreview(pData.profileImage);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      Swal.fire("Validation Error", "First Name is required", "error");
      return;
    }

    setSaving(true);
    try {
      const targetId = resolvedId || pandit?.id || localStorage.getItem("pandit_id") || 1;
      let payload;
      if (formData.profileImage instanceof File) {
        payload = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            payload.append(key, formData[key]);
          }
        });
      } else {
        payload = { ...formData };
      }

      await updatePandit(targetId, payload);
      await panditGet();

      Swal.fire({
        icon: "success",
        title: "Profile & Rates Updated!",
        text: "Your consultation talk-time rates and profile details have been saved successfully.",
        confirmButtonColor: "#ff7a00",
      }).then(() => {
        navigate("/panditprofile");
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: error?.response?.data?.message || "Something went wrong while saving rates.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "50vh", marginLeft: "270px" }}>
        <TailSpin height="50" width="50" color="#ff7a00" />
        <p className="loading_text" style={{ marginTop: "15px", color: "#64748b", fontWeight: "600" }}>Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-form">
      <div className="edit-profile-box">
        <h2>Edit Profile & Set Talk-Time Rates</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="editpanditcontent">
            <label>
              First Name *
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
              Last Name
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
            </label>
            <label>
              Mobile Number *
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} disabled />
            </label>
          </div>

          {/* 💰 Custom Per-Minute Rates Section */}
          <div className="pricing_section_box">
            <h4 style={{ margin: "0 0 6px 0", color: "#c2410c", fontSize: "1.05rem", fontWeight: "800" }}>
              💰 Set Your Custom Consultation Charges (Per Minute Rates)
            </h4>
            <p className="pricing_subtitle">Aap yahan apni live chat, call aur video consultation ke alag-alag charges set kar sakte hain.</p>
            
            <div className="pricing_grid">
              <div className="price_card">
                <label>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#1d4ed8", fontWeight: "700", fontSize: "0.84rem" }}>
                    <IoChatbox /> Chat Rate (₹/min) *
                  </span>
                  <input
                    type="number"
                    name="chat_price"
                    value={formData.chat_price}
                    onChange={handleChange}
                    placeholder="15"
                    min="1"
                    required
                  />
                  <span className="price_hint">Charge per min for chat</span>
                </label>
              </div>

              <div className="price_card">
                <label>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#047857", fontWeight: "700", fontSize: "0.84rem" }}>
                    <FaPhoneAlt /> Voice Call (₹/min) *
                  </span>
                  <input
                    type="number"
                    name="voice_price"
                    value={formData.voice_price}
                    onChange={handleChange}
                    placeholder="20"
                    min="1"
                    required
                  />
                  <span className="price_hint">Charge per min for call</span>
                </label>
              </div>

              <div className="price_card">
                <label>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#c2410c", fontWeight: "700", fontSize: "0.84rem" }}>
                    <FaVideo /> Video Call (₹/min) *
                  </span>
                  <input
                    type="number"
                    name="video_price"
                    value={formData.video_price}
                    onChange={handleChange}
                    placeholder="25"
                    min="1"
                    required
                  />
                  <span className="price_hint">Charge per min for video</span>
                </label>
              </div>

              <div className="price_card">
                <label>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#701a75", fontWeight: "700", fontSize: "0.84rem" }}>
                    <FaPrayingHands /> Puja Fee (₹)
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="501"
                    min="51"
                  />
                  <span className="price_hint">Starting puja dakshina</span>
                </label>
              </div>
            </div>
          </div>

          <div className="editpanditcontent">
            <label>
              Email *
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />
            </label>
            <label>
              Gender
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label>
              Experience (Years)
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 8" />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Qualification
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. Acharya in Jyotish" />
            </label>
            <label>
              Languages Spoken
              <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="e.g. Hindi, Sanskrit" />
            </label>
            <label>
              Gotra
              <input type="text" name="gotra" value={formData.gotra} onChange={handleChange} placeholder="e.g. Kashyap" />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Temple Association
              <input type="text" name="temple" value={formData.temple} onChange={handleChange} placeholder="e.g. Mahakaleshwar Temple" />
            </label>
            <label>
              Skills / Specialization
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Rudrabhishek, Kundli" />
            </label>
            <label>
              City
              <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              State
              <input type="text" name="state" value={formData.state} onChange={handleChange} />
            </label>
            <label>
              Country
              <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </label>
            <label>
              Profile Photo
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {profilePreview && (
            <div style={{ marginTop: "10px", marginBottom: "15px" }}>
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="preview-img"
              />
            </div>
          )}

          <div className="form_action_buttons">
            <button type="submit" className="editpanditbtn" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Profile & Rates"}
            </button>
            <button type="button" className="btn_cancel_edit" onClick={() => navigate("/panditprofile")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;

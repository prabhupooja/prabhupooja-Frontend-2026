import React, { useEffect, useState } from "react";
import "./editprofile.css";
import useAuthStore from "../Store/AuthStore/AuthStore";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";

function EditProfileForm() {
  const { pandit, updatePandit } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    country: "",
    gotra: "",
    qualification: "",
    language: "",
    temple: "",
    skills: "",
    price: "",
    experience: "",
    gender: "Male",
    profileImage: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);
  // const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pandit) {
      setFormData({
        name: pandit?.name || "",
        lastname: pandit?.lastname || "",
        email: pandit?.email || "",
        mobile: pandit?.mobile || "",
        city: pandit?.city || "",
        state: pandit?.state || "",
        country: pandit?.country || "",
        gotra: pandit?.gotra || "",
        qualification: pandit?.qualification || "",
        language: pandit?.language || "",
        temple: pandit?.temple || "",
        skills: pandit?.skills || "",
        price: pandit?.price || "",
        experience: pandit?.experience || "",
        gender: pandit?.gender || "Male",
        profileImage: pandit?.profileImage || null,
      });

      if (pandit?.profileImage) {
        setProfilePreview(pandit.profileImage);
      }

      setLoading(false);
    }
  }, [pandit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({ ...formData, profileImage: file });
      console.log(file, "dfdfddf");
      setProfilePreview(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "First Name is required";
    if (!formData.lastname) newErrors.lastname = "Last Name is required";
    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = "Phone Number must be 10 digits";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.gotra) newErrors.gotra = "Gotra is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.qualification)
      newErrors.qualification = "Qualification is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.temple) newErrors.temple = "Temple name is required";
    if (!formData.skills) newErrors.skills = "Skills are required";
    if (!formData.price) newErrors.price = "Price is required";

    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill in all required fields correctly!",
        });
        return;
      }

      const updatedProfile = { ...formData };

      if (formData.profileImage instanceof File) {
        const imageData = new FormData();
        imageData.append("profileImage", formData.profileImage);

        // Upload logic here (API request to upload image)
      }

      console.log("Updated Profile:", updatedProfile);

      updatePandit(pandit?.id, updatedProfile);
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile details have been successfully updated.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: "Something went wrong while updating your profile.",
      });
    }
  };

  if (loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "5vh",
            marginTop: "50px",
          }}
        >
          <TailSpin height="50" width="50" color="orange" />
        </div>
        <p className="loading_text">Loading...</p>
      </>
    );
  }

  return (
    <div className="edit-profile-form">
      <div className="edit-profile-box">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="editpanditcontent">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </label>
            <label>
              Number:
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                disabled
              />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </label>
            <label>
              Gender:
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Experience:
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </label>
            <label>
              Qualification:
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Price:
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </label>
            <label>
              Language:
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Gotra:
              <input
                type="text"
                name="gotra"
                value={formData.gotra}
                onChange={handleChange}
              />
            </label>
            <label>
              Skills:
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="editpanditcontent">
            <label>
              Profile Image:
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {profilePreview && (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="preview-img"
              />
            )}
          </div>

          <button
            type="submit"
            className="editpanditbtn"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;

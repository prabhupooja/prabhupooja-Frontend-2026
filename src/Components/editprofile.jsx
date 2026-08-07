import React, { useState, useEffect } from "react";
import "../styles/editprofile.css";
import profileimg from "../Components/Assets/profile-img.png";
import useAuthStore from "../Store/UserStore/userAuthStore";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import useUserStore from "../Store/UserStore/userStore";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { MdDelete } from "react-icons/md";

function Editprofile() {
  const { userGet, user1, userUploadProfile, isLoading, updateUserData ,deleteUser} =
    useAuthStore();
  const { getUserCityByPincode } = useUserStore();
  const [profileImg, setProfileImg] = useState(profileimg);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("male");
  const [imageLoading, setImageLoading] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user1) {
      const {
        name,
        mobile,
        email,
        city,
        country,
        address,
        lastname,
        state,
        postalCode,
        gender,
      } = user1;

      setName(name || "");
      setMobile(mobile || "");
      setEmail(email || "");
      setCity(city || "");
      setCountry(country || "");
      setAddress(address || "");
      setLastName(lastname || "");
      setState(state || "");
      setPostalCode(postalCode || "");
      setGender(gender || "male");
      setLoading(false);
    }
  }, [user1]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "First Name is required";
    if (!lastname) newErrors.lastname = "Last Name is required";
    if (!address) newErrors.address = "Address is required";
    if (!country) newErrors.country = "Country is required";
    if (!state) newErrors.state = "State is required";
    if (!city) newErrors.city = "City is required";
    if (!postalCode) newErrors.postalCode = "Postal Code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (selectedImage) {
      handleImageUpload();
    }
  }, [selectedImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formData = {
        name,
        mobile,
        email,
        city,
        country,
        address,
        lastname,
        state,
        postalCode,
        gender,
      };

      const updateResponse = await updateUserData(user1?.id, formData);
      if (updateResponse.data.success) {
        await userGet();
        Swal.fire({
          title: "Success",
          text: "Profile updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          userGet();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: updateResponse.data.message || "Failed to update profile",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Unauthorized",
          text: "Session expired. Please log in again.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (error.response?.status === 400) {
        Swal.fire({
          title: "Bad Request",
          text: "There was an issue with the data you submitted.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (error.response?.status === 500) {
        Swal.fire({
          title: "Server Error",
          text: "Something went wrong on the server.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "An error occurred while updating your profile",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log(file, "Selected file");

    if (file) {
      setSelectedImage({
        uri: URL.createObjectURL(file),
        file: file,
      });
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage?.file) {
      console.error("No image selected.");
      return;
    }

    setImageLoading(true);
    const formData = new FormData();

    // console.log(selectedImage.file, "Selected File");

    formData.append("image", selectedImage.file);

    try {
      if (!user1?.id) throw new Error("User ID is missing");
      await userUploadProfile(user1.id, formData);
      userGet();
    } catch (error) {
      console.error("Error:", error.message || error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleFetchUserCity = async (postCode) => {
    const trimmedPostalCode = String(postCode).trim();
    try {
      const response = await getUserCityByPincode(trimmedPostalCode);
      // console.log(response?.places[0]["place name"], "kkkkkkkk");
      setCity(response?.places[0]["place name"]);
      setState(response?.places[0].state);
      setCountry(response?.country);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    setName("");
    setMobile("");
    navigate("/");
    window.location.reload();
    window.dispatchEvent(new Event("loginStatusChanged"));
  };


  const handleDeleteProfile = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this profile!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteUser(user1?.id);
          // console.log(response);
          if (response.data.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Your profile has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/"); // Redirect to home page
            });
          } else {
            Swal.fire("Error!", response?.message || "Failed to delete profile. Please try again.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong. Please try again later.", "error");
          console.error(error);
        }
      }
    });
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
    <>
      <div className="profile-container">
        <div className="sidebar">
          {/* <div className="editprofile_section">
                        <img
                            src={user1?.image || profileImg}
                            alt="profileimg"
                            className="profileimage"
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div> */}

          <div className="editprofile_section">
            <div className="userImage-section">
              <div className="userimage-container">
                <img
                  src={user1?.image || profileImg}
                  alt="profileimg"
                  className={`profileimage ${
                    imageLoading || isLoading ? "loading-overlay" : ""
                  }`}
                  onClick={() => document.getElementById("fileInput").click()}
                />
                {(imageLoading || isLoading) && (
                  <div className="loading-spinner">
                    <span className="line-md--loading-loop"></span>
                  </div>
                )}
              </div>
            </div>

            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <div className="editprofile_name_section">
            <h6>{user1?.name} {user1?.lastname}</h6>
          </div>
          <ul className="sidebar-menu">
            <li className="active">
              <CgProfile className="profile_icon" />
              Profile Information
            </li>
            <li className="logout" onClick={handleLogout}>
              <MdLogout className="logout_icon" /> Logout
            </li>
{/*             <li className="logout" onClick={handleDeleteProfile}>
            <MdDelete /> Delete Profile
            </li> */}
          </ul>
        </div>
        <div className="profile-content">
          <h2 className="profile-title">Personal Information</h2>
          <form className="profile-form">
            <div className="form_section">
              <div className="form-group-editprofile">
                <label>First Name</label>
                <input
                  type="text"
                  value={name}
                  className="input-field"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group-editprofile">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastname}
                  className="input-field"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <label>Gender</label>
            <div className="gender-options">
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleGenderChange}
                checked={gender === "Male"}
              />{" "}
              Male
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleGenderChange}
                checked={gender === "Female"}
              />{" "}
              Female
              <input
                type="radio"
                name="gender"
                value="Other"
                onChange={handleGenderChange}
                checked={gender === "Other"}
              />{" "}
              Other
            </div>

            <div className="form_section">
              <div className="form-group-editprofile">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                 onChange={(e)=>setMobile(e.target.value)}
                  className="input-field "
                />
              </div>
              <div className="form-group-editprofile">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  readOnly
                  className="input-field number"
                />
              </div>
            </div>

            <div className="form-group-editprofile">
              <label>Address</label>
              <textarea
                name="address"
                className="address-input-field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form_section">
              <div className="form-group-editprofile">
                <label>Pincode</label>
                <input
                  type="text"
                  placeholder="Enter your Pincode"
                  value={postalCode}
                  className="input-field"
                  onChange={(e) => {
                    setPostalCode(e.target.value);
                    if (e.target.value.length === 6) {
                      handleFetchUserCity(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="form-group-editprofile">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Enter your City"
                  value={city}
                  className="input-field"
                  onChange={(e) => setCity(e.target.value)}
                 
                />
              </div>
            </div>

            <div className="form_section">
              <div className="form-group-editprofile">
                <label>State</label>
                <input
                  type="text"
                  placeholder="Enter your State"
                  value={state}
                  className="input-field"
                  onChange={(e) => setState(e.target.value)}
                 
                />
              </div>
              <div className="form-group-editprofile">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="Enter your Country"
                  value={country}
                  className="input-field"
                  onChange={(e) => setCountry(e.target.value)}
               
                />
              </div>
            </div>

            <button type="submit" onClick={handleSubmit} className="save-btn">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Editprofile;

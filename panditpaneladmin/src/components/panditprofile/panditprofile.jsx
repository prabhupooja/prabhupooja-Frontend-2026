import React, { useState, useEffect } from "react";
import "./panditprofile.css";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import Swal from "sweetalert2";
import AadharCard from '../../assets/Aadhaarcard.png'
import panCard from '../../assets/pancard.webp'


function PanditProfile() {
  const { panditGet, pandit, logout, deletePandit } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const token=localStorage.getItem('Pandittoken');

  useEffect(() => {
    userFetch();
  }, []);

  const userFetch = async () => {
    if(!token){
      navigate('/')
    }else{
      await panditGet();
    } 
  }



  const images = [
    pandit?.gurukulCertificate || AadharCard,
    pandit?.panCard || panCard,
    pandit?.aadharCard || AadharCard,
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const handleDeleteAccount = async () => {
    Swal.fire(
      "Confirm Deletion",
      "Are you sure you want to delete your profile?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deletePandit(pandit?.id);
              await panditGet()
              Swal.fire("Success", "Your profile has been deleted.");
            } catch (error) {
              Swal.fire("Error", "Failed to delete profile. Please try again.");
              console.error("Delete Error:", error);
            }
          }
        }
      ]
    );
  };



  const handleeditform = () => {
    navigate("/editprofileform");
  };

  const openImage = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="pandit-profile-container">
      <div className="profile-card">
        <div className="profile_img">
          <img src={pandit?.profileImage} alt="Pandit Profile" className="profile-image" />
        </div>
        <div className="profile_info">
          <h2 className="profile-name">
            {pandit ? `${pandit.name} ${pandit.lastname}` : "Loading..."}
          </h2>
          <p className="profile-detail">
            <strong>Number:</strong> {pandit?.mobile || "N/A"}
          </p>
          <p className="profile-detail">
            <strong>Wallet Balance:</strong> {pandit?.wallet || "N/A"}
          </p>
          <p className="profile-detail">
            <strong>Email:</strong> {pandit?.email || "N/A"}
          </p>
          <p className="profile-detail">
            <strong>Gender:</strong> {pandit?.gender || "N/A"}
          </p>
          <p className="profile-detail">
            <strong>Experience:</strong> {pandit?.experience || "N/A"}
          </p>
        </div>

      </div>

      <div className="documents-section">
        <div className="profile_detail_section">
          <p className="profile-detail">
            <strong>Qualification:</strong> {pandit?.qualification}
          </p>
          <p className="profile-detail">
            <strong>Price:</strong> {pandit?.price}
          </p>
          <p className="profile-detail">
            <strong>Language:</strong> {pandit?.language}
          </p>
          <p className="profile-detail">
            <strong>Gotra:</strong> {pandit?.gotra}
          </p>
          <p className="profile-detail">
            <strong>Skills:</strong> {pandit?.skills}
          </p>
        </div>
        <div className="document-images">
          {images.map((imgSrc, index) => (
            <div
              key={index}
              onClick={() => openImage(imgSrc)}
            >
              <img
                src={imgSrc}
                alt={`document-${index}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-btn" onClick={handleeditform}>
          Edit
          <FaEdit className="profiledit_icon" />
        </button>
        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete
          <RiDeleteBin5Line className="profiledit_icon" />
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
          <TbLogout className="profiledit_icon" />
        </button>
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img
              src={selectedImage}
              alt="Document Preview"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PanditProfile;

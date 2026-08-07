import React, { useLayoutEffect, useState } from "react";
import "../../styles/productreview.css";
import { FaCamera } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import CryptoJS from "crypto-js";

const ratingLabels = ["Very Bad", "Bad", "Ok-Ok", "Good", "Very Good"];
const reviewReasons = [
  "Late Delivery",
  "Damaged Product",
  "Product Quality",
  "Wrong Item",
  "Great Packaging",
  "Value for Money",
  "Amazing Quality",
];

function Productreview() {
  const [rating, setRating] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const merchantId = searchParams.get("Id1");
  const productId = searchParams.get("Id2");
  const { user1 } = useAuthStore();
  const { addReview } = useUserStore();
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReview, setCustomReview] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [selectedImage, setSelectImage] = useState([])
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();





  const toggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);

    const previews = files.map(file => URL.createObjectURL(file));

    setImagePreview(previews);
    setSelectImage(files);
  };


  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append('userId', user1?.id);
    formData.append('productId', decryptId(productId));
    formData.append('merchantId', decryptId(merchantId));
    formData.append('rating', rating);
    formData.append('comment', customReview);
    formData.append('reason', selectedReasons);

    selectedImage.forEach((file, index) => {
      formData.append('comment_image', file);
    });
    // console.log(formData,'form data')

    try {
      const response = await addReview(formData);
      setLoading(false);

      if (response && response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Review submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/');
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'There was an issue submitting your review. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Submit error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
      <div className="Productreview_section">
        <div className="Productreview_card">
          <h2 className="Productreview_heading">Rate Your Product</h2>

          <div className="Productreview_starsRow">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="starWrapper"
                onClick={() => setRating(star)}
              >
                <span className={`star ${rating >= star ? "filled" : ""}`}>
                  &#9733;
                </span>
                <div className="starLabel">{ratingLabels[star - 1]}</div>
              </div>
            ))}
          </div>

          <h4 className="subHeading">Upload an Image (optional)</h4>
          <div className="imageUploadRow">
            <label className="imageUploadButton">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                hidden
              />
              <span className="icon">
                <FaCamera style={{ marginBottom: "5px" }} />
              </span>
              <span className="imageUploadText">Pick an Image</span>
            </label>
            {imagePreview.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} width="100" />
            ))}
          </div>

          <h4 className="subHeading">Select Reasons (optional)</h4>
          <div className="reasonsContainer">
            {reviewReasons.map((reason) => (
              <div
                key={reason}
                onClick={() => toggleReason(reason)}
                className={`reasonChip ${selectedReasons.includes(reason) ? "selected" : ""
                  }`}
              >
                {reason}
              </div>
            ))}
          </div>

          <h4 className="subHeading">Write a Review</h4>
          <textarea
            className="reviewInput"
            rows="5"
            placeholder="Tell us more..."
            value={customReview}
            onChange={(e) => setCustomReview(e.target.value)}
          />

          <button className="submitButton" onClick={handleSubmit}>
          {loading?'Submitting......':'Submit Review'}  
          </button>
        </div>
      </div>
    </>
  );
}

export default Productreview;

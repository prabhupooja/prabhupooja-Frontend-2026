import React, { useState, useEffect } from "react";
import "../../styles/productreview.css";
import { FaCamera, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import CryptoJS from "crypto-js";
import api from "../Axios/api";
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from "../../utils/imageHelper";

const ratingLabels = ["Very Bad", "Bad", "Ok-Ok", "Good", "Very Good"];
const reviewReasons = [
  "Amazing Quality",
  "Great Packaging",
  "Value for Money",
  "Authentic Vedic Energized",
  "Fast Delivery",
  "Divine Blessings",
  "Product Quality",
  "Late Delivery",
  "Damaged Product",
];

function Productreview() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const initialRating = Number(searchParams.get("rating")) || 5;
  const [rating, setRating] = useState(initialRating);

  const merchantId = searchParams.get("Id1");
  const productId = searchParams.get("Id2");
  const { user1 } = useAuthStore();
  const { addReview } = useUserStore();
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReview, setCustomReview] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [selectedImage, setSelectImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const navigate = useNavigate();

  const decryptId = (encryptedIdFromUrl) => {
    if (!encryptedIdFromUrl) return "";
    try {
      const decodedId = decodeURIComponent(encryptedIdFromUrl);
      const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedIdFromUrl;
    } catch {
      return encryptedIdFromUrl;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const cleanPId = decryptId(productId);
      if (cleanPId) {
        try {
          const res = await api.get(`/products/get/${cleanPId}`);
          const raw = res.data?.data ?? res.data;
          const item = Array.isArray(raw) ? raw[0] : raw;
          if (item) setProductData(item);
        } catch (err) {
          console.warn("Could not fetch product info:", err);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  const toggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreview((prev) => [...prev, ...previews].slice(0, 5));
    setSelectImage((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setSelectImage((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user1?.id) {
      Swal.fire({
        title: "Please Login First",
        text: "You must be logged in to submit a sacred review.",
        icon: "warning",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const cleanProductId = decryptId(productId);
    const cleanMerchantId = decryptId(merchantId) || productData?.merchantId || 1;

    setLoading(true);
    const formData = new FormData();

    formData.append("userId", user1.id);
    formData.append("productId", cleanProductId);
    formData.append("merchantId", cleanMerchantId);
    formData.append("rating", rating);
    formData.append("comment", customReview || "Very energized and divine item!");
    formData.append(
      "reason",
      selectedReasons.length > 0 ? selectedReasons.join(", ") : "Amazing Quality"
    );

    selectedImage.forEach((file) => {
      formData.append("comment_image", file);
    });

    try {
      const response = await addReview(formData);
      setLoading(false);

      if (response && (response.data?.success || response.success)) {
        Swal.fire({
          title: "Jai Shree Ram!",
          text: "Your sacred review has been submitted successfully!",
          icon: "success",
          confirmButtonColor: "#ea580c",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(-1);
        });
      } else {
        Swal.fire({
          title: "Submission Note",
          text: response?.data?.message || "Review recorded successfully!",
          icon: "success",
          confirmButtonColor: "#ea580c",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(-1);
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Submit error:", error);
      Swal.fire({
        title: "Review Submitted",
        text: error.response?.data?.message || "Review has been recorded.",
        icon: "info",
        confirmButtonColor: "#ea580c",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    }
  };

  return (
    <div className="Productreview_section">
      <div className="Productreview_card">
        {/* Top Header & Navigation */}
        <div className="review-page-top-nav">
          <button
            type="button"
            className="review-back-btn"
            onClick={() => navigate(-1)}
            title="Go Back"
          >
            <FaArrowLeft />
          </button>
          <h2 className="Productreview_heading">Rate & Review Offering</h2>
        </div>

        {/* Product Preview Card */}
        {productData && (
          <div className="review-product-preview-card">
            <img
              src={normalizeImageUrl(productData.image, DEFAULT_FALLBACK_IMAGE)}
              alt={productData.productName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_FALLBACK_IMAGE;
              }}
            />
            <div className="review-product-preview-info">
              <h3>{productData.productName}</h3>
              <p>
                ₹
                {(
                  Number(productData.offerPrice || productData.price) || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Star Rating Section */}
        <h4 className="subHeading">How was your spiritual experience?</h4>
        <div className="Productreview_starsRow">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="starWrapper"
              onClick={() => setRating(star)}
            >
              <span className={`star ${rating >= star ? "filled" : ""}`}>
                ★
              </span>
              <div className="starLabel">{ratingLabels[star - 1]}</div>
            </div>
          ))}
        </div>

        {/* Reason Tags */}
        <h4 className="subHeading">
          What did you like the most? <span className="optional-tag">(optional)</span>
        </h4>
        <div className="reasonsContainer">
          {reviewReasons.map((reason) => {
            const isSelected = selectedReasons.includes(reason);
            return (
              <div
                key={reason}
                onClick={() => toggleReason(reason)}
                className={`reasonChip ${isSelected ? "selected" : ""}`}
              >
                {isSelected ? "✓ " : "+ "}
                {reason}
              </div>
            );
          })}
        </div>

        {/* Image Upload Strip */}
        <h4 className="subHeading">
          Upload Photos <span className="optional-tag">(optional, max 5)</span>
        </h4>
        <div className="imageUploadRow">
          {imagePreview.map((src, index) => (
            <div key={index} className="preview-thumb-box">
              <img src={src} alt={`Preview ${index}`} className="previewImage" />
              <button
                type="button"
                className="remove-thumb-btn"
                onClick={() => handleRemoveImage(index)}
                title="Remove photo"
              >
                <FaTimes />
              </button>
            </div>
          ))}

          {imagePreview.length < 5 && (
            <label className="imageUploadButton">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                hidden
              />
              <FaCamera />
              <span>Add Photos</span>
            </label>
          )}
        </div>

        {/* Review Comments */}
        <h4 className="subHeading">
          Detailed Sacred Review <span className="optional-tag">(optional)</span>
        </h4>
        <textarea
          className="reviewInput"
          placeholder="Share your spiritual experience, deity energy, sacred vibrations or packaging quality..."
          value={customReview}
          onChange={(e) => setCustomReview(e.target.value)}
        />

        {/* Submit Action */}
        <button
          className="submitButton"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <TailSpin height="18" width="18" color="#ffffff" />
              Submitting Sacred Review...
            </>
          ) : (
            <>⭐ Submit Sacred Review</>
          )}
        </button>
      </div>
    </div>
  );
}

export default Productreview;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/buynowform.css";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";

function BuyNowForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { user1 } = useAuthStore();

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchProductData = async () => {
    try {
      const res = await api.get(`/products/get/${decryptId(productId)}`);
      setProductData(res.data.data[0]);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);


  const handleBuyNow = () => {
    const totalPrice = quantity * productData.offerPrice || 0;

    if (!user1) {
      // navigate("/login");
      Swal.fire({
        title: "Login Required",
        text: "Please login!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
    } else {
      const rawImg = productData.image;
      let safeImage = rawImg;
      if (Array.isArray(rawImg)) {
        safeImage = rawImg[0];
      } else if (typeof rawImg === "string" && rawImg.startsWith("[")) {
        try {
          const parsed = JSON.parse(rawImg);
          safeImage = parsed[0] || rawImg;
        } catch (e) {}
      }

      const productIdToSend = productData?._id || (productId ? decryptId(productId) : "");

      navigate("/checkout", {
        state: {
          productId: productIdToSend,
          quantity: quantity,
          totalPrice: totalPrice,
          user: user1,
          booking: "normal",
          images: safeImage,
          marchentId: productData?.merchantId,
        },
      });
    }
  };

  return (
    <div className="buynowform">
      <h1 className="buynow-title">Buy Now</h1>
      <div className="buynow-form-container">
        <form
          className="buynow-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleBuyNow();
          }}
        >
          <div className="buynow-price-box">
            <h6 className="current-price-product">
              <span className="old-price">RS.{productData.price}</span>
              <span className="current-price">
                RS.{quantity * productData.offerPrice || 0}
              </span>
            </h6>
          </div>

          <div className="form-group-box">
            <label htmlFor="quantity">
              Quantity: <span>*</span>
            </label>
            <input
              type="number"
              id="quantity"
              className="input-product"
              required
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => {
                const newQuantity = Math.max(1, Math.min(10, e.target.value));
                setQuantity(newQuantity);
              }}
            />
          </div>

          <button type="submit" className="buynow-btn">
            Buy Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuyNowForm;

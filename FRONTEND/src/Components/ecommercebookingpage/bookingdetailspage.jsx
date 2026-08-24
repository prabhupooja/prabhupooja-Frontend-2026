import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import "../../styles/bookingdetailspage.css";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import Swal from "sweetalert2";
import { FaStar, FaRegStar } from "react-icons/fa";
import CryptoJS from "crypto-js";
import { TailSpin } from "react-loader-spinner";

function Bookingdetailspage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const orderDate = searchParams.get("orderDate");
  const paramQuantity = searchParams.get("quantity");
  const quantities = paramQuantity.split(",").map(Number);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);
  const { user1 } = useAuthStore();
  const { userOrdersFetchByOrderId, isLoading, orderCancel, isCancelled } =
    useUserStore();
  const [invoiceUrl, setInvoiceUrl] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const cancelReasons = [
    "Changed my mind",
    "Found a better price",
    "Item arrived damaged",
    "Ordered by mistake",
    "Other",
  ];
  const [rating, setRating] = useState(0);
  const ratingLabels = ["Very Bad", "Bad", "Ok-Ok", "Good", "Very Good"];

  const encryptId = (ID) => {
    const encrypted = CryptoJS.AES.encrypt(
      ID.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };


  const handleRating = (value) => {
  let merchantId=encryptId(value[0][0].merchantId)
  let productId=encryptId(value[0][0].productId)

    navigate(`/productreview/?Id1=${merchantId}&Id2=${productId}`);
  };

  const handleCancelButtonClick = () => {
    Swal.fire({
      title: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowPopup(true);
      }
    });
  };

  const handleCancelReasonChange = (e) => {
    const selectedReason = e.target.value;
    setCancelReason(selectedReason);

    if (selectedReason === "Other") {
      Swal.fire({
        title: "Please specify the reason",
        input: "textarea",
        inputPlaceholder: "Type your custom reason here...",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "Custom reason can't be empty!";
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setCustomReason(result.value);
        } else {
          setCancelReason("");
        }
      });
    }
  };

  const handleCancelOrderWithReason = () => {
    const finalReason = customReason || cancelReason;
    // console.log(`Order cancelled because: ${finalReason}`);
    setShowPopup(false);
    handleCancelOrder();
  };

  useEffect(() => {
    if (user1 && id) {
      fetchOrdersbyId();
    }
  }, [user1, id]);

  const fetchOrdersbyId = async () => {
    try {
      const response = await userOrdersFetchByOrderId(id);
      if (response.data.success) {
        setPaymentMethod(response?.data?.orders?.paymentMethod);
        const fetchedProducts = response.data.products;
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);

          setQuantity(quantities);
          setInvoiceUrl(response?.data?.pathUrl);
        } else {
          setError("Invalid product data received");
        }
      } else {
        setError("Failed to fetch order details");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching the order details");
    }
  };

  const handleCancelOrder = async () => {
    await orderCancel(id, { cancelReason: customReason || cancelReason });
  };

  const totalPrice = products.reduce((sum, product, index) => {
    if (product && product[0]) {
      return sum + product[0].productOfferPrice * (quantity?.[index] || 0);
    }
    return sum;
  }, 0);

  const handleTrackOrder = () => {
    navigate(`/track-order/${id}`);
  };


    


  if (isLoading) {
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
 

  const handleDownload = async () => {
    try {
      const response = await fetch(invoiceUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="order-detail-page">
      <h1 className="page-title">Order Details</h1>
      <div className="decorative-line"></div>

      <div className="order-content">
        {/* Product List */}
        <div className="product-list-container">
          <div className="product-list">
            {products.map(
              (product, index) =>
                product &&
                product[0] && (
                  <div key={product[0].productId} className="product-card">
                    <img
                      src={product[0].productImage[0]}
                      alt={product[0].productName}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h2 className="product-name">{product[0].productName}</h2>
                      <p className="product-price">
                        Price:{" "}
                        <span>&#8377;{product[0].productOfferPrice}</span>
                      </p>
                      <p className="product-quantity">
                        Quantity: <span>{quantity?.[index] || 0}</span>
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
          {!isCancelled && (
            <div className="orderTrack-button">
              <button onClick={handleCancelButtonClick}>Cancel Order</button>
            </div>
          )}

          {isCancelled && paymentMethod.toLowerCase() === "cod" && (
            <p className="order-cancel-text">Your order has been cancelled.</p>
          )}

          {isCancelled && paymentMethod.toLowerCase() === "upi" && (
            <p className="order-cancel-text">
              Your order has been cancelled and amount will be refunded in 2-3
              working days.
            </p>
          )}

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup">
                <h3>Select a Reason for Cancellation</h3>
                <select
                  value={cancelReason}
                  onChange={handleCancelReasonChange}
                  className="bookingpage_section"
                >
                  <option value="">--Select a reason--</option>
                  {cancelReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                <div className="popup-actions">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="popup-close-btn"
                  >
                    Close
                  </button>
                  <button
                    disabled={!cancelReason && !customReason}
                    onClick={handleCancelOrderWithReason}
                    className="popup-confirm-btn"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bill Summary */}
        <div className="bill-container">
          <div className="bill-summary">
            <h2>Bill Summary</h2>
            <p>
              Order Date:{" "}
              {orderDate ? new Date(orderDate).toLocaleDateString() : "N/A"}
            </p>
            <ul>
              {products.map(
                (product, index) =>
                  product &&
                  product[0] && (
                    <li key={product[0].productId}>
                      <span>{product[0].productName}</span>
                      <span>
                        &#8377;{product[0].productOfferPrice} x{" "}
                        {quantity?.[index] || 0} =
                        <strong>
                          {" "}
                          &#8377;
                          {product[0].productOfferPrice *
                            (quantity?.[index] || 0)}
                        </strong>
                      </span>
                    </li>
                  )
              )}
            </ul>
            <p className="total-highlight">
              Total Quantity:{" "}
              <span>
                {Array.isArray(quantity)
                  ? quantity.reduce((sum, qty) => sum + qty, 0)
                  : 0}
              </span>
            </p>
            <p className="total-highlight">
              Total Price: <span>&#8377;{totalPrice.toFixed(2)}</span>
            </p>
            <div className="bill-footer">Thank you for shopping with us!</div>

            <div className="invoiceContainer" onClick={handleDownload}>
              <span>Download Your Invoice</span>
            </div>
            <div className="orderTrack-button">
              <button onClick={handleTrackOrder}>Track Your Order</button>
            </div>

            <div className="rating-containermain">
              <h3 className="rating-title">How was your product?</h3>
            
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className="star-wrapper"
                      onClick={() => handleRating(products)}
                    >
                      {rating >= star ? (
                        <FaStar size={28} color="#FFD700" />
                      ) : (
                        <FaRegStar size={28} color="#ccc" />
                      )}
                      <div className="star-label">{ratingLabels[star - 1]}</div>
                    </div>
                  ))}
                </div>
           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingdetailspage;

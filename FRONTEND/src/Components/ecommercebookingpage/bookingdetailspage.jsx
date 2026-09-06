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
 

  const generateDirectTaxInvoice = () => {
    const orderRefId = !isNaN(Number(id)) ? Number(id) + 1000 : id;
    const invoiceNo = `PP-INV-${new Date().getFullYear()}-${orderRefId}`;
    const invoiceDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (!printWindow) {
      Swal.fire({
        icon: "warning",
        title: "Popup Blocked",
        text: "Please allow popups in your browser to download the invoice PDF.",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const itemsRows = products && products.length > 0 ? products.map((item, idx) => {
      const prod = Array.isArray(item) ? item[0] : item;
      const title = prod?.productName || prod?.productTitle || prod?.title || "Sacred Devotional Item";
      const price = Number(prod?.productOfferPrice || prod?.offerPrice || prod?.price || 0);
      const qty = Number(quantity?.[idx] || 1);
      return `
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1;">
            <strong>${title}</strong>
            <div style="font-size: 11px; color: #64748b;">SAC/HSN: 9983 • Sacred Devotional Item</div>
          </td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">${qty}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right;">₹${price.toFixed(2)}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right;">₹${(price * qty).toFixed(2)}</td>
        </tr>
      `;
    }).join("") : `
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">1</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1;"><strong>Sacred Pooja Samagri & Offerings</strong></td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">1</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right;">₹${Number(totalPrice || 0).toFixed(2)}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right;">₹${Number(totalPrice || 0).toFixed(2)}</td>
      </tr>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tax Invoice - ${invoiceNo} - PrabhuPooja</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 30px;
            color: #1e293b;
            background: #ffffff;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            padding: 30px;
            background: #ffffff;
          }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .brand-name { font-size: 26px; font-weight: 900; color: #ea580c; margin: 0; letter-spacing: 0.5px; }
          .brand-sub { font-size: 12px; color: #64748b; margin: 2px 0 0 0; }
          .tax-invoice-badge {
            background: #fff7ed;
            border: 1.5px solid #fed7aa;
            color: #ea580c;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            display: inline-block;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
            background: #f8fafc;
            padding: 16px 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .meta-col h4 { margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          .meta-col p { margin: 0 0 4px 0; font-size: 13px; color: #1e293b; line-height: 1.4; }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .items-table th {
            background: #f1f5f9;
            color: #334155;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 10px 12px;
            border: 1px solid #cbd5e1;
          }
          .totals-table {
            width: 320px;
            margin-left: auto;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .totals-table td { padding: 6px 12px; font-size: 13px; }
          .totals-table .grand-total td {
            font-size: 16px;
            font-weight: 800;
            color: #ea580c;
            border-top: 2px solid #cbd5e1;
            padding-top: 10px;
          }
          .footer-note {
            border-top: 1px dashed #cbd5e1;
            padding-top: 18px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .stamp-box {
            border: 2px dashed #fed7aa;
            background: #fffbf5;
            padding: 10px 16px;
            border-radius: 8px;
            text-align: center;
            color: #c2410c;
            font-size: 12px;
            font-weight: 700;
          }
          .print-btn-bar {
            margin-bottom: 20px;
            text-align: right;
          }
          .print-btn {
            background: #ea580c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }
          @media print {
            .print-btn-bar { display: none; }
            body { padding: 0; }
            .invoice-box { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-btn-bar">
          <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td style="vertical-align: top;">
                <h1 class="brand-name">🕉️ PRABHU POOJA</h1>
                <p class="brand-sub">Sacred Vedic E-Commerce & Spiritual Services</p>
                <p style="font-size: 11.5px; color: #64748b; margin: 4px 0 0 0;">
                  GSTIN: 23AABCP1234F1Z5 • Reg: 508 Vishnupuri, Indore, MP 452001<br>
                  Support: enquiry@prabhupooja.com • +91 7225016699
                </p>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <span class="tax-invoice-badge">Official Tax Invoice</span>
                <p style="font-size: 13px; font-weight: 700; margin: 8px 0 2px 0;">Invoice #: ${invoiceNo}</p>
                <p style="font-size: 12px; color: #64748b; margin: 0 0 2px 0;">Date: ${invoiceDate}</p>
                <p style="font-size: 12px; color: #64748b; margin: 0;">Order Ref: #${orderRefId}</p>
              </td>
            </tr>
          </table>

          <div class="meta-grid">
            <div class="meta-col">
              <h4>Billed & Shipped To:</h4>
              <p><strong>${user1?.name || "Devotee"} ${user1?.lastname || ""}</strong></p>
              <p>${user1?.address || "Registered Devotee Address"}</p>
              <p>${user1?.city || "Indore"}, ${user1?.state || "MP"} - ${user1?.postalCode || "452001"}</p>
              <p>Phone: ${user1?.mobile || "N/A"}</p>
            </div>
            <div class="meta-col">
              <h4>Payment & Order Info:</h4>
              <p><strong>Payment Mode:</strong> ${paymentMethod || "Online (Razorpay / UPI)"}</p>
              <p><strong>Payment Status:</strong> Paid / Confirmed</p>
              <p><strong>Delivery Status:</strong> Dispatched & In Transit</p>
              <p><strong>Estimated Delivery:</strong> Auspicious Doorstep Delivery</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Sacred Item Description</th>
                <th style="width: 60px;">Qty</th>
                <th style="width: 100px; text-align: right;">Unit Price</th>
                <th style="width: 110px; text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Items Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${Number(totalPrice || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Vedic Protection Packaging:</td>
              <td style="text-align: right; color: #16a34a; font-weight: 600;">FREE 🙏</td>
            </tr>
            <tr>
              <td>Delivery / Shipping Seva:</td>
              <td style="text-align: right; color: #16a34a; font-weight: 600;">FREE</td>
            </tr>
            <tr class="grand-total">
              <td>Grand Total (Incl. GST):</td>
              <td style="text-align: right;">₹${Number(totalPrice || 0).toFixed(2)}</td>
            </tr>
          </table>

          <div class="footer-note">
            <div>
              <p style="font-size: 12px; color: #64748b; margin: 0 0 4px 0;">
                This is a computer-generated official tax invoice, duly verified and sanctified.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                May Lord Prabhu's divine blessings remain with you and your family! 🙏
              </p>
            </div>
            <div class="stamp-box">
              <span>🕉️ PRABHU POOJA VERIFIED</span><br>
              <small style="font-weight: normal; font-size: 10px;">Authorized Digital Signatory</small>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    if (
      !invoiceUrl ||
      typeof invoiceUrl !== "string" ||
      invoiceUrl.toLowerCase().includes("no invoice") ||
      invoiceUrl === "null" ||
      invoiceUrl === "undefined"
    ) {
      generateDirectTaxInvoice();
      return;
    }

    try {
      const response = await fetch(invoiceUrl, { method: "GET" });
      if (!response.ok) throw new Error("Remote fetch failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PrabhuPooja-Invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      generateDirectTaxInvoice();
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

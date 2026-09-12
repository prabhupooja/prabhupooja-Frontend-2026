import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderTracking.css";
import api from "../Axios/api";
import {
  FaBoxOpen,
  FaTruck,
  FaPrayingHands,
  FaArrowLeft,
  FaFileInvoice,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
  FaQuestionCircle,
  FaTimesCircle,
  FaCreditCard,
  FaCheckCircle,
  FaCalendarAlt,
  FaUser,
  FaGift,
  FaWhatsapp,
  FaUndoAlt,
  FaSyncAlt,
} from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import prabhuPoojaLogo from "../Assets/PRABHU POOJA LOGO1.png";
import ReturnRequestModal from "./ReturnRequestModal";
import ReturnStatusModal from "./ReturnStatusModal";

// Helper to safely parse image URLs
const parseSafeImage = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=200&auto=format&fit=crop&q=80";
  if (Array.isArray(img) && img.length > 0) return img[0];
  if (typeof img === "string") {
    try {
      const parsed = JSON.parse(img);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      if (typeof parsed === "string") return parsed;
    } catch (e) {
      if (img.includes(",")) return img.split(",")[0].trim();
      return img.trim();
    }
  }
  return "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=200&auto=format&fit=crop&q=80";
};

const OrderTracking = () => {
  const { getOrderTracking, userOrdersFetchByOrderId, orderCancel, cancelReason, orders: rawStoreProducts } = useUserStore();
  const { user1 } = useAuthStore();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [mapUrl, setMapUrl] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [returnInfo, setReturnInfo] = useState(null);

  const fetchReturnStatus = async (currentUid) => {
    try {
      const uId = currentUid || user1?.id || trackingData?.user_id || trackingData?.userId;
      if (uId && orderId) {
        const res = await api.get(`/orders/user-returns/${uId}?orderId=${orderId}`);
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setReturnInfo(res.data.data[0]);
        } else {
          setReturnInfo(null);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchTrackingAndOrder = async () => {
    try {
      if (orderId) {
        // 1. Fetch tracking status
        const trackRes = await getOrderTracking(orderId);
        if (trackRes?.success && trackRes?.order) {
          setTrackingData(trackRes.order);
          if (trackRes.products && Array.isArray(trackRes.products)) {
            setOrderProducts(trackRes.products);
          }
          if (trackRes.invoiceUrl) {
            setInvoiceUrl(trackRes.invoiceUrl);
          }
        }

        // 2. Fetch order items & products
        const orderRes = await userOrdersFetchByOrderId(orderId);
        if (orderRes?.data?.success) {
          if (orderRes.data.products && Array.isArray(orderRes.data.products)) {
            setOrderProducts(orderRes.data.products);
          }
          if (orderRes.data.pathUrl) {
            setInvoiceUrl(orderRes.data.pathUrl);
          }
          if (!trackingData && orderRes.data.orders) {
            setTrackingData(orderRes.data.orders);
          }
        }

        // 3. Fetch any return/refund status for this order
        await fetchReturnStatus(user1?.id || trackRes?.order?.user_id || orderRes?.data?.orders?.user_id);
      }
    } catch (err) {
      console.error("Failed to fetch tracking data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingAndOrder();
  }, [user1, orderId]);

  const getMapUrl = async (address) => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const lonLeft = parseFloat(lon) - 0.01;
        const lonRight = parseFloat(lon) + 0.01;
        const latBottom = parseFloat(lat) - 0.01;
        const latTop = parseFloat(lat) + 0.01;

        return `https://www.openstreetmap.org/export/embed.html?bbox=${lonLeft},${latBottom},${lonRight},${latTop}&layer=mapnik&marker=${lat},${lon}`;
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
    return null;
  };

  const resolveStatus = (data) => {
    const s1 = (data?.order_status || "").toLowerCase().trim();
    const s2 = (data?.order_progress_status || "").toLowerCase().trim();
    const s3 = (data?.status || "").toLowerCase().trim();
    const all = `${s1} ${s2} ${s3}`;

    if (all.includes("deliver") || all.includes("complete") || all.includes("success")) return "delivered";
    if (all.includes("out for delivery") || all.includes("out_for_delivery") || all.includes("in transit") || all.includes("in_transit")) return "shipping";
    if (all.includes("dispatch") || all.includes("shipped") || all.includes("on_the_way") || all.includes("transit")) return "dispatched";
    if (all.includes("process") || all.includes("pack") || all.includes("confirm") || all.includes("accept")) return "processing";
    if (all.includes("cancel") || all.includes("error") || all.includes("reject") || all.includes("fail")) return "cancelled";
    return "order_placed";
  };

  const getPaymentInfo = (paymentMethod, orderStatus) => {
    const method = (paymentMethod || "COD").toUpperCase();
    const status = (orderStatus || "").toLowerCase();
    const isDelivered = status.includes("deliver") || status.includes("complete");

    if (method.includes("COD") || method.includes("CASH")) {
      if (isDelivered) {
        return {
          label: "COD (Paid & Collected)",
          mode: "Cash on Delivery (COD)",
          statusText: "Paid (Cash Collected at Doorstep)",
          badgeBg: "#dcfce7",
          badgeColor: "#15803d",
          icon: "✅ "
        };
      }
      return {
        label: "COD (Due on Arrival)",
        mode: "Cash on Delivery (COD)",
        statusText: "Pending (To be collected at Doorstep upon delivery)",
        badgeBg: "#fef3c7",
        badgeColor: "#b45309",
        icon: "⏳ "
      };
    }

    return {
      label: `Online Paid (${paymentMethod || "Razorpay / UPI"})`,
      mode: paymentMethod || "Online (Razorpay / UPI)",
      statusText: "Paid Online (Payment Verified via Gateway)",
      badgeBg: "#dcfce7",
      badgeColor: "#15803d",
      icon: "✅ "
    };
  };

  const getSafeTrackingSteps = (data) => {
    const raw = data?.trackingStatus;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw;
    }
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }

    const currentProg = resolveStatus(data);
    const isDispatched = currentProg === "dispatched" || currentProg === "shipping" || currentProg === "delivered";
    const isShipping = currentProg === "shipping" || currentProg === "delivered";
    const isDelivered = currentProg === "delivered";
    const isError = currentProg === "cancelled";

    return [
      {
        name: "Order Placed & Sanctified",
        desc: "Order confirmed with blessings",
        status: isError ? "error" : "completed",
        date: data?.orderDate ? new Date(data.orderDate).toLocaleDateString("en-GB") : "Confirmed",
      },
      {
        name: "Processing & Sacred Packaging",
        desc: "Packed with Vedic care & protection",
        status: isError ? "error" : isDispatched ? "completed" : currentProg === "processing" ? "processing" : "pending",
        date: isDispatched ? "Completed" : "Spiritual Packaging",
      },
      {
        name: "Dispatched & In Transit",
        desc: "Carrier moving towards destination",
        status: isError ? "error" : isShipping ? "completed" : currentProg === "dispatched" ? "processing" : "pending",
        date: isShipping ? "Dispatched" : "Carrier Dispatched",
      },
      {
        name: "Delivered Auspiciously",
        desc: "Received at sacred devotee doorstep",
        status: isError ? "error" : isDelivered ? "completed" : currentProg === "shipping" ? "processing" : "pending",
        date: isDelivered ? "Sanctified & Received" : "Expected Soon",
      },
    ];
  };

  const isValidInvoiceUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    const clean = url.trim().toLowerCase();
    if (clean === "no invoice found" || clean === "null" || clean === "undefined" || clean === "" || clean.includes("not found")) return false;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("/");
  };

  const getResolvedShippingAddress = (data, user) => {
    let addr = data?.shippingAddress || data?.shipping_address || data?.shippingaddress;
    if (typeof addr === "string") {
      try {
        addr = JSON.parse(addr);
      } catch (e) {}
    }

    let innerAddr = addr?.address;
    if (typeof innerAddr === "string" && innerAddr.startsWith("{")) {
      try {
        const parsedInner = JSON.parse(innerAddr);
        addr = { ...addr, ...parsedInner };
      } catch (e) {}
    }

    const name = addr?.name || data?.name || user?.name || "Sonu";
    const lastname = addr?.lastname || data?.lastname || user?.lastname || "Kushwaha";
    const email = addr?.email || data?.email || user?.email || "enquiry@prabhupooja.com";
    const phone = addr?.number || addr?.phone || addr?.mobile || data?.mobile || data?.number || user?.mobile || (addr?.number ? addr.number : "9755XXXXXX");
    const address = (typeof addr?.address === "string" ? addr.address : null) || data?.address || user?.address || "508 Vishnupuri Colony";
    const city = addr?.city || data?.city || user?.city || "Indore";
    const postalCode = addr?.postalCode || addr?.pincode || addr?.postal_code || data?.postalCode || user?.postalCode || "452102";
    const state = addr?.state || data?.state || user?.state || "Madhya Pradesh";
    const country = addr?.country || data?.country || user?.country || "India";

    return { name, lastname, email, phone, address, city, postalCode, state, country };
  };

  // Normalize product array from various backend responses
  const getNormalizedProducts = () => {
    const rawList = (orderProducts && orderProducts.length > 0) ? orderProducts : (rawStoreProducts || []);
    return rawList.map((item, idx) => {
      const prod = Array.isArray(item) ? item[0] : item;
      return {
        id: prod?.productId || prod?.id || idx,
        title: prod?.productName || prod?.productTitle || prod?.title || "Sacred Devotional Item",
        price: Number(prod?.price || prod?.productOfferPrice || prod?.offerPrice || 0),
        quantity: Number(prod?.quantity || 1),
        image: parseSafeImage(prod?.image || prod?.images || prod?.productImage),
      };
    });
  };

  const shippingInfo = getResolvedShippingAddress(trackingData, user1);
  const trackingSteps = getSafeTrackingSteps(trackingData);
  const normalizedProducts = getNormalizedProducts();
  const currentStatusRaw = resolveStatus(trackingData);
  const isCancelled = currentStatusRaw === "cancelled";
  const canCancel = !isCancelled && (currentStatusRaw === "order_placed" || currentStatusRaw === "processing");

  const statusLabels = {
    order_placed: "Order Placed & Sanctified",
    processing: "Processing & Sacred Packaging",
    dispatched: "Dispatched & In Transit",
    shipping: "Out for Delivery",
    delivered: "Auspiciously Delivered",
    cancelled: "Order Cancelled",
  };

  const calculatedItemsTotal = normalizedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalDisplayTotal = trackingData?.totalPrice || (calculatedItemsTotal > 0 ? calculatedItemsTotal : "0.00");
  const paymentInfo = getPaymentInfo(trackingData?.paymentMethod, currentStatusRaw);

  useEffect(() => {
    const addressToQuery = `${shippingInfo.address !== "Registered Devotee Address" ? shippingInfo.address : ""} ${shippingInfo.city !== "N/A" ? shippingInfo.city : ""} ${shippingInfo.state !== "N/A" ? shippingInfo.state : ""} ${shippingInfo.postalCode !== "N/A" ? shippingInfo.postalCode : ""}`.trim() || user1?.city || "India";
    if (addressToQuery) {
      getMapUrl(addressToQuery).then((mUrl) => {
        if (mUrl) setMapUrl(mUrl);
      });
    }
  }, [user1, trackingData, shippingInfo.address, shippingInfo.city, shippingInfo.state, shippingInfo.postalCode]);

  const generateTaxInvoicePdf = () => {
    const orderRefId = !isNaN(Number(trackingData?.orderId || orderId))
      ? Number(trackingData?.orderId || orderId) + 1000
      : trackingData?.orderId || orderId;

    const invoiceNo = `PP-INV-${new Date().getFullYear()}-${orderRefId}`;
    const invoiceDate = trackingData?.orderDate
      ? new Date(trackingData.orderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

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

    const itemsRows = normalizedProducts && normalizedProducts.length > 0 ? normalizedProducts.map((item, idx) => {
      // Calculate unit price according to total to avoid price discrepancy
      const unitPrice = Number(finalDisplayTotal || item.price || 0) / (item.quantity || 1);
      const rowTotal = unitPrice * (item.quantity || 1);

      return `
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1;">
            <strong style="color: #0f172a; font-size: 13.5px;">${item.title}</strong>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">SAC/HSN: 9983 • Sacred Devotional Item</div>
          </td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${item.quantity}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">₹${unitPrice.toFixed(2)}</td>
          <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${rowTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join("") : `
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">1</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1;"><strong>Sacred Pooja Samagri & Offerings</strong></td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: center;">1</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right;">₹${Number(finalDisplayTotal || 0).toFixed(2)}</td>
        <td style="padding: 10px 12px; border: 1px solid #cbd5e1; text-align: right;">₹${Number(finalDisplayTotal || 0).toFixed(2)}</td>
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
          .logo-img { height: 52px; object-fit: contain; margin-bottom: 4px; }
          .brand-name { font-size: 24px; font-weight: 900; color: #ea580c; margin: 0; letter-spacing: 0.5px; }
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
            width: 340px;
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
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
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
                <img src="${prabhuPoojaLogo}" alt="Prabhu Pooja Logo" class="logo-img" onerror="this.style.display='none'" />
                <h1 class="brand-name">PRABHU POOJA</h1>
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
              <p><strong>${shippingInfo.name} ${shippingInfo.lastname}</strong></p>
              <p>${shippingInfo.address}</p>
              <p>${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.postalCode}</p>
              <p><strong>Phone:</strong> ${shippingInfo.phone}</p>
              <p><strong>Email:</strong> ${shippingInfo.email}</p>
            </div>
            <div class="meta-col">
              <h4>Payment & Order Status:</h4>
              <p><strong>Payment Mode:</strong> ${paymentInfo.mode}</p>
              <p><strong>Payment Status:</strong> ${paymentInfo.statusText}</p>
              <p><strong>Delivery Status:</strong> ${statusLabels[currentStatusRaw] || "Dispatched & In Transit"}</p>
              <p><strong>Order Tracking:</strong> Live Active (${orderRefId})</p>
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
              <td style="text-align: right; font-weight: 600;">₹${Number(finalDisplayTotal || 0).toFixed(2)}</td>
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
              <td style="text-align: right;">₹${Number(finalDisplayTotal || 0).toFixed(2)}</td>
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

  const handleInvoiceClick = (e) => {
    e.preventDefault();
    // Direct Backend Stream Endpoint
    const backendBase = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || "http://localhost:3002";
    window.open(`${backendBase}/orders/invoice/${orderId}`, "_blank");
  };

  const handleCancelOrderClick = () => {
    Swal.fire({
      title: "Cancel this Order?",
      text: "Are you sure you want to request cancellation for this order?",
      icon: "warning",
      input: "select",
      inputOptions: {
        "Changed my mind": "Changed my mind",
        "Found better price": "Found better price elsewhere",
        "Ordered by mistake": "Ordered by mistake",
        "Incorrect delivery address": "Need to change delivery address",
        "Other": "Other reason",
      },
      inputPlaceholder: "Select a reason for cancellation",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel Order",
      cancelButtonText: "Keep Order",
      inputValidator: (value) => {
        if (!value) return "Please select a cancellation reason";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCancelling(true);
        try {
          const res = await orderCancel(orderId, { cancelReason: result.value });
          if (res?.data?.success || res?.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Order Cancelled",
              text: "Your order cancellation request has been processed successfully.",
              confirmButtonColor: "#ea580c",
            });
            fetchTrackingAndOrder();
          } else {
            throw new Error(res?.data?.message || "Failed to cancel order");
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Cancellation Failed",
            text: err.message || "Could not cancel order at this stage.",
            confirmButtonColor: "#ea580c",
          });
        } finally {
          setCancelling(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="order-tracking-loader-wrap">
        <TailSpin height="50" width="50" color="#ea580c" />
        <p className="loading_text">Loading divine order tracking...</p>
      </div>
    );
  }

  if (!trackingData) {
    const isNumericId = !isNaN(Number(orderId));
    return (
      <div className="order-tracking-container" style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2>Order Not Found</h2>
        <p style={{ color: "#64748b", margin: "10px 0 20px" }}>
          We could not locate tracking records for Order {isNumericId ? `#${Number(orderId) + 1000}` : ""}.
        </p>
        <button
          className="ot-back-btn"
          style={{ margin: "0 auto" }}
          onClick={() => navigate("/editprofile", { state: { activeTab: "orders" } })}
        >
          <FaArrowLeft /> Back to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="order-tracking-wrapper">
      <div className="order-tracking-container">
        {/* Top Header Navigation & Security Badge */}
        <div className="ot-header-nav">
          <button
            className="ot-back-btn"
            onClick={() => navigate("/editprofile", { state: { activeTab: "orders" } })}
          >
            <FaArrowLeft /> Back to All Bookings
          </button>
          <div className="ot-header-badge">
            <FaShieldAlt style={{ color: "#16a34a" }} />
            <span>100% Authentic Prabhu Pooja Order</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="ot-title-section">
          <span className="ot-divine-tag">✨ VEDIC FULFILLMENT TRACKER ✨</span>
          <h2 className="title">Live Order & Sanctification Journey</h2>
          <p className="subtitle">
            Real-time status updates, Vedic consecration, and express doorstep tracking
          </p>
        </div>

        {/* Order Summary Ribbon (6-KPI Grid) */}
        <div className="order-tracking-summary">
          <div className="summary-tracking-item">
            <div className="summary-item-header">
              <FaCalendarAlt className="summary-icon" />
              <span>ORDER PLACED</span>
            </div>
            <strong>
              {trackingData?.orderDate
                ? new Date(trackingData.orderDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Confirmed"}
            </strong>
          </div>

          <div className="summary-tracking-item">
            <div className="summary-item-header">
              <FaBoxOpen className="summary-icon" />
              <span>ORDER REF #</span>
            </div>
            <strong>
              #{!isNaN(Number(trackingData?.orderId || orderId))
                ? Number(trackingData?.orderId || orderId) + 1000
                : trackingData?.orderId || orderId}
            </strong>
          </div>

          <div className="summary-tracking-item">
            <div className="summary-item-header">
              <FaUser className="summary-icon" />
              <span>DEVOTEE</span>
            </div>
            <strong title={`${shippingInfo.name} ${shippingInfo.lastname}`}>
              {shippingInfo.name} {shippingInfo.lastname}
            </strong>
          </div>

          <div className="summary-tracking-item">
            <div className="summary-item-header">
              <FaCreditCard className="summary-icon" />
              <span>PAYMENT MODE</span>
            </div>
            <strong>{trackingData?.paymentMethod || "COD"}</strong>
          </div>

          <div className="summary-tracking-item">
            <div className="summary-item-header">
              <FaShieldAlt className="summary-icon" />
              <span>PAYMENT STATUS</span>
            </div>
            <span
              className="payment-status-badge"
              style={{
                backgroundColor: paymentInfo.badgeBg,
                color: paymentInfo.badgeColor,
              }}
            >
              {paymentInfo.icon} {paymentInfo.label}
            </span>
          </div>

          <div className="summary-tracking-item total-item">
            <div className="summary-item-header">
              <span>TOTAL AMOUNT</span>
            </div>
            <strong className="summary-total-amount">₹{finalDisplayTotal}</strong>
          </div>
        </div>

        {/* Order Status & 4-Step Animated Timeline */}
        <div className="order-tracking-status">
          <div className="status-header-row">
            <div className="status-badge-wrap">
              <span className="status-label-title">Current Status:</span>
              <span className={`status-pill ${isCancelled ? "cancelled" : currentStatusRaw}`}>
                {isCancelled ? "Order Cancelled" : statusLabels[currentStatusRaw] || "Processing Auspiciously"}
              </span>
            </div>

            {isCancelled ? (
              <div className="ot-cancel-reason-box">
                <strong>Reason: </strong>
                <span>{cancelReason || trackingData?.cancel_reason || "Cancelled upon devotee request"}</span>
              </div>
            ) : (
              <div className="ot-est-delivery">
                <span>Estimated Auspicious Delivery: </span>
                <strong>
                  {trackingData?.estimated_delivery_start
                    ? new Date(trackingData.estimated_delivery_start).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Within 3 - 5 Working Days"}
                  {trackingData?.estimated_delivery_end && (
                    <>
                      {" - "}
                      {new Date(trackingData.estimated_delivery_end).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </>
                  )}
                </strong>
              </div>
            )}
          </div>

          {/* Seller / Customer / Admin Cancellation Notice */}
          {(trackingData?.order_status === "cancel" || trackingData?.status === "cancelled" || isCancelled) && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "14px 18px",
                borderRadius: "10px",
                margin: "15px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b91c1c", fontWeight: "700" }}>
                <FaTimesCircle size={18} />
                <span>
                  Order Cancelled by {trackingData?.cancelled_by === "seller" ? "Merchant / Seller" : trackingData?.cancelled_by === "user" ? "You (Customer)" : "Admin"}
                </span>
              </div>
              {(trackingData?.cancel_reason || cancelReason) && (
                <p style={{ margin: "6px 0 0 26px", color: "#7f1d1d", fontSize: "13px" }}>
                  <strong>Reason:</strong> {trackingData?.cancel_reason || cancelReason}
                </p>
              )}
            </div>
          )}

          {/* Courier Name & Tracking Number Banner (Shipped Orders) */}
          {(trackingData?.courier_name || trackingData?.courier || trackingData?.tracking_number || trackingData?.trackingNumber) && (
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                padding: "12px 18px",
                borderRadius: "10px",
                margin: "15px 0",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FaTruck style={{ color: "#2563eb", fontSize: "22px" }} />
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                  Dispatched via Express Courier
                </span>
                <p style={{ margin: "2px 0 0", color: "#1e3a8a", fontWeight: "700", fontSize: "14px" }}>
                  {(trackingData?.courier_name || trackingData?.courier || "Express Courier")}
                  {(trackingData?.tracking_number || trackingData?.trackingNumber) ? ` — Tracking AWB: ${trackingData?.tracking_number || trackingData?.trackingNumber}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Stepper Progress Pipeline */}
          <div className="tracking-timeline-stepper">
            {trackingSteps.map((step, idx) => {
              const stepStatus = (step.status || "").toLowerCase();
              const isCompleted = stepStatus === "completed" || stepStatus === "complete" || stepStatus === "success";
              const isProcessing = stepStatus === "processing" || stepStatus === "inprogress" || stepStatus === "active";
              const isPending = stepStatus === "pending" || !stepStatus;
              const isStepError = stepStatus === "error" || stepStatus === "cancelled";

              let iconSymbol = <FaBoxOpen />;
              if (idx === 1) iconSymbol = <FaPrayingHands />;
              if (idx === 2) iconSymbol = <FaTruck />;
              if (idx === 3) iconSymbol = <FaGift />;

              return (
                <div
                  key={idx}
                  className={`timeline-step-card ${
                    isCompleted
                      ? "completed"
                      : isProcessing
                      ? "processing"
                      : isStepError
                      ? "error"
                      : "pending"
                  }`}
                >
                  <div className="step-bubble-wrapper">
                    <div className="step-icon-bubble">
                      {isCompleted ? <FaCheckCircle className="check-icon" /> : iconSymbol}
                    </div>
                    {idx < trackingSteps.length - 1 && (
                      <div className={`step-connector-line ${isCompleted ? "completed" : isProcessing ? "processing" : ""}`} />
                    )}
                  </div>

                  <div className="step-card-content">
                    <h4 className="step-title">{step.name}</h4>
                    <p className="step-desc">{step.desc || "Prabhu Seva Step"}</p>
                    <span className="step-timestamp">
                      {step.date || (isCompleted ? "Completed" : isProcessing ? "In Progress" : "Pending")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Products Ledger */}
        {normalizedProducts && normalizedProducts.length > 0 && (
          <div className="ot-products-ledger-card">
            <div className="ledger-header">
              <h3>
                <FaBoxOpen style={{ color: "#ea580c" }} />
                Ordered Sacred Offerings & Items ({normalizedProducts.length})
              </h3>
            </div>
            <div className="ledger-items-list">
              {normalizedProducts.map((prod, index) => (
                <div key={index} className="ledger-item-row">
                  <div className="ledger-img-wrap">
                    <img src={prod.image} alt={prod.title} className="ledger-prod-thumb" />
                  </div>
                  <div className="ledger-prod-details">
                    <span className="ledger-sacred-tag">🕉️ Sanctified Puja Offering</span>
                    <h4>{prod.title}</h4>
                    <div className="ledger-meta-tags">
                      <span className="meta-badge">Qty: <strong>{prod.quantity}</strong></span>
                      <span className="meta-price">Price: <strong>₹{finalDisplayTotal}</strong></span>
                    </div>
                  </div>
                  <div className="ledger-prod-subtotal">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-amount">₹{finalDisplayTotal}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="ledger-pricing-breakdown">
              <div className="pricing-row">
                <span>Items Subtotal</span>
                <span>₹{finalDisplayTotal}</span>
              </div>
              <div className="pricing-row free-row">
                <span>Vedic Purification & Sacred Packaging</span>
                <span className="free-tag">FREE (₹0) 🙏</span>
              </div>
              <div className="pricing-row free-row">
                <span>Doorstep Express Delivery Seva</span>
                <span className="free-tag">FREE (₹0)</span>
              </div>
              <div className="pricing-row total-row">
                <span>Total Amount Paid / Payable</span>
                <strong className="grand-total">₹{finalDisplayTotal}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Grid: Shipping Information & Interactive Map */}
        <div className="ot-details-grid">
          {/* Shipping Information Card */}
          <div className="shipping-info">
            <h3>
              <FaMapMarkerAlt style={{ color: "#ea580c" }} />
              DELIVERY ADDRESS & CONTACT
            </h3>
            <div className="shipping-info-body">
              <div className="devotee-profile-badge">
                <FaUser className="user-icon" />
                <span>{shippingInfo.name} {shippingInfo.lastname}</span>
              </div>
              <p className="contact-row">
                <strong><FaPhoneAlt className="meta-ic" /> Mobile:</strong>
                <a href={`tel:${shippingInfo.phone}`} className="phone-link"> {shippingInfo.phone}</a>
              </p>
              <p className="contact-row">
                <strong><FaEnvelope className="meta-ic" /> Email:</strong> {shippingInfo.email}
              </p>
              <div className="address-box">
                <span className="addr-label">Destination Address:</span>
                <p className="addr-street">{shippingInfo.address}</p>
                <p className="addr-city">{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.postalCode}</p>
                <p className="addr-country">{shippingInfo.country}</p>
              </div>
            </div>
          </div>

          {/* Live OpenStreetMap Preview */}
          <div className="map-container-card">
            <h3>
              <FaTruck style={{ color: "#ea580c" }} />
              DESTINATION ROUTE PREVIEW
            </h3>
            <div className="map-embed-wrap">
              {mapUrl ? (
                <iframe
                  title="Delivery Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "10px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl}
                />
              ) : (
                <div className="map-fallback">
                  <FaMapMarkerAlt className="fallback-map-pin" />
                  <p>Destination: {shippingInfo.city}, {shippingInfo.state}</p>
                  <span>Real-time logistics route active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Return / Refund Status Alert (If already requested) */}
        {returnInfo && (
          <div
            className="ot-return-banner"
            style={{
              background:
                returnInfo.admin_status === "approved" || returnInfo.admin_status === "refunded"
                  ? "#f0fdf4"
                  : returnInfo.admin_status === "rejected"
                  ? "#fef2f2"
                  : "#fff7ed",
              border: `1.5px solid ${
                returnInfo.admin_status === "approved" || returnInfo.admin_status === "refunded"
                  ? "#bbf7d0"
                  : returnInfo.admin_status === "rejected"
                  ? "#fecaca"
                  : "#fed7aa"
              }`,
              borderRadius: "14px",
              padding: "14px 18px",
              marginTop: "20px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>
                {returnInfo.admin_status === "approved" || returnInfo.admin_status === "refunded"
                  ? "✅"
                  : returnInfo.admin_status === "rejected"
                  ? "❌"
                  : "⏳"}
              </span>
              <div>
                <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>
                  {returnInfo.request_type === "refund" ? "Money Refund Request" : "Product Replacement Request"}
                  {" — "}
                  <span
                    style={{
                      color:
                        returnInfo.admin_status === "approved" || returnInfo.admin_status === "refunded"
                          ? "#15803d"
                          : returnInfo.admin_status === "rejected"
                          ? "#dc2626"
                          : "#ea580c",
                      textTransform: "uppercase",
                      fontWeight: "700",
                    }}
                  >
                    {returnInfo.admin_status || "Pending Verification"}
                  </span>
                </strong>
                <p style={{ margin: "3px 0 0 0", fontSize: "12.5px", color: "#475569" }}>
                  Reason: <em>"{returnInfo.reason}"</em>
                  {returnInfo.transaction_reference && (
                    <> • <strong>Bank UTR:</strong> {returnInfo.transaction_reference}</>
                  )}
                  {returnInfo.replacement_tracking_id && (
                    <> • <strong>Replacement Tracking:</strong> {returnInfo.replacement_tracking_id} ({returnInfo.replacement_courier})</>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="ot-invoice-btn"
              style={{ background: "#ffffff", padding: "8px 16px", fontSize: "13px" }}
              onClick={() => setShowStatusModal(true)}
            >
              <FaSyncAlt /> View Full Return Details
            </button>
          </div>
        )}

        {/* Order Actions Toolbar */}
        <div className="ot-actions-bar">
          {canCancel && (
            <button
              className="ot-cancel-order-btn"
              onClick={handleCancelOrderClick}
              disabled={cancelling}
            >
              <FaTimesCircle /> {cancelling ? "Processing Cancellation..." : "Cancel Order"}
            </button>
          )}

          {/* Return & Refund triggers (When Delivered) */}
          {currentStatusRaw === "delivered" && (
            <>
              {!returnInfo ? (
                <button
                  type="button"
                  className="ot-invoice-btn"
                  style={{ background: "#fff7ed", color: "#c2410c", borderColor: "#fed7aa" }}
                  onClick={() => setShowReturnModal(true)}
                >
                  <FaUndoAlt /> Request Return / Replacement
                </button>
              ) : (
                <button
                  type="button"
                  className="ot-invoice-btn"
                  style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
                  onClick={() => setShowStatusModal(true)}
                >
                  <FaSyncAlt /> Check Return / Refund Status
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={handleInvoiceClick}
            className="ot-invoice-btn"
          >
            <FaFileInvoice /> View / Download Tax Invoice (PDF)
          </button>

          <a
            href={`https://wa.me/917225016699?text=Namaste,%20I%20have%20an%20inquiry%20regarding%20my%20Prabhu%20Pooja%20Order%20%23${orderId}`}
            target="_blank"
            rel="noreferrer noopener"
            className="ot-support-btn"
          >
            <FaWhatsapp /> 24/7 Devotee Helpdesk
          </a>
        </div>
      </div>

      {/* Return Request Modal */}
      <ReturnRequestModal
        order={trackingData || { orderId: orderId, totalPrice: finalDisplayTotal, user_id: user1?.id }}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          setShowReturnModal(false);
          fetchReturnStatus(user1?.id || trackingData?.user_id);
          setShowStatusModal(true);
        }}
      />

      {/* Return Status Modal */}
      <ReturnStatusModal
        userId={user1?.id || trackingData?.user_id}
        orderId={orderId || trackingData?.id}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />
    </div>
  );
};

export default OrderTracking;

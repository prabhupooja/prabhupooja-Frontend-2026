import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/booking.css";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import { FaRegCalendarTimes, FaShoppingBag, FaBoxOpen, FaTruck, FaChevronRight, FaUndoAlt, FaEye } from "react-icons/fa";
import ReturnRequestModal from "../OrderTracking/ReturnRequestModal";
import ReturnStatusModal from "../OrderTracking/ReturnStatusModal";
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from "../../utils/imageHelper";

// Helper function to safely parse image urls from API
const parseImages = (imgs) => {
  if (!imgs) return [];
  let rawList = [];

  if (Array.isArray(imgs)) {
    rawList = imgs;
  } else if (typeof imgs === "string") {
    const trimmed = imgs.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) rawList = parsed;
        else if (typeof parsed === "string") rawList = [parsed];
        else rawList = [trimmed];
      } catch (e) {
        rawList = [trimmed];
      }
    } else if (trimmed.includes(",")) {
      rawList = trimmed.split(",");
    } else if (trimmed) {
      rawList = [trimmed];
    }
  }

  const cleanList = rawList
    .flat(Infinity)
    .map((item) => normalizeImageUrl(item, ""))
    .filter((url) => url && url.length > 4 && url !== "[" && url !== "]");

  return cleanList;
};

// Helper function to safely parse quantities
const parseQuantities = (qty, count = 1) => {
  if (!qty) return Array(count).fill(1);
  if (Array.isArray(qty)) return qty;
  if (typeof qty === "number") return [qty];
  if (typeof qty === "string") {
    try {
      const parsed = JSON.parse(qty);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "number") return [parsed];
    } catch (e) {
      if (qty.includes(",")) {
        return qty.split(",").map((s) => Number(s.trim()) || 1);
      }
      const num = Number(qty);
      return isNaN(num) ? [1] : [num];
    }
  }
  return Array(count).fill(1);
};

function EcommerceBookingPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { user1 } = useAuthStore();
  const navigate = useNavigate();

  const { userFetchProduct, isLoading } = useUserStore();

  useEffect(() => {
    if (user1?.id) {
      fetchOrders();
    }
  }, [user1]);

  const fetchOrders = async () => {
    try {
      const res = await userFetchProduct(user1?.id);
      if (res?.success) {
        const rawOrders = Array.isArray(res.data.orders)
          ? res.data.orders
          : Object.values(res.data.orders || {});
        setOrders(rawOrders);
        setCount(res.data.orderCount || rawOrders.length || 0);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Order fetch error:", err);
      setError("An error occurred while fetching orders.");
    }
  };

  if (isLoading) {
    return (
      <div className="order-page-loader">
        <TailSpin height="50" width="50" color="#ea580c" />
        <p className="loading_text">Loading your divine orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <div className="error-container" style={{ textAlign: "center", padding: "40px" }}>
          <p className="error" style={{ color: "#dc2626", fontWeight: "600" }}>{error}</p>
          <button
            className="retry-btn"
            onClick={fetchOrders}
            style={{
              marginTop: "16px",
              padding: "8px 20px",
              backgroundColor: "#ea580c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleNavigate = (orderId, booking) => {
    const qtyArr = parseQuantities(booking.quantity);
    const qtyParam = qtyArr.join(",");
    navigate(
      `/bookingdetailspage/${orderId}?quantity=${qtyParam}&orderDate=${booking.orderDate || ""}`
    );
  };

  return (
    <div className="order-page">
      <div className="order-page-header">
        <h1 className="page-title">
          <FaShoppingBag style={{ marginRight: "10px", color: "#ea580c" }} />
          Your Orders & Sacred Purchases
        </h1>
        <p className="page-subtitle">Track, manage and view invoice for all your spiritual items</p>
        <div className="decorative-line"></div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order, index) => {
            const imagesList = parseImages(order.images);
            const quantitiesList = parseQuantities(order.quantity, imagesList.length || 1);
            const orderStatus = (order.order_status || "pending").toLowerCase();

            return (
              <div
                className="order-card"
                key={order.orderId || index}
                onClick={() => handleNavigate(order.orderId, order)}
              >
                <div className="order-header">
                  <div className="order-id-box">
                    <span className="order-id-label">Order</span>
                    <h3 className="order-id">#{order.orderId}</h3>
                  </div>
                  <p className="order-date">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }) : "Recent"}
                  </p>
                </div>

                <div className="order-price-row">
                  <span className="order-price-label">Total Amount:</span>
                  <span className="order-price-val">&#8377;{Number(order.totalPrice || 0).toLocaleString("en-IN")}</span>
                </div>

                <div className="images-container">
                  {imagesList.length > 0 ? (
                    imagesList.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="image-wrapper"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(order.orderId, order);
                        }}
                      >
                        <img
                          src={image}
                          alt={`Order ${order.orderId}`}
                          className="order-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                        {quantitiesList[imgIndex] !== undefined && (
                          <div className="quantity-badge">
                            ×{quantitiesList[imgIndex]}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      className="image-wrapper"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(order.orderId, order);
                      }}
                    >
                      <img
                        src={DEFAULT_FALLBACK_IMAGE}
                        alt={`Order ${order.orderId}`}
                        className="order-image"
                      />
                      <div className="quantity-badge">
                        ×{quantitiesList[0] || 1}
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-footer-row">
                  <div className="order-status-badge">
                    {(() => {
                      const rawStatus = (
                        order.order_progress_status ||
                        order.status ||
                        order.order_status ||
                        order.statusName ||
                        "Placed"
                      ).trim();
                      const lower = rawStatus.toLowerCase();
                      const isDelivered = lower.includes("deliver") || lower.includes("complete");
                      const isDispatched = lower.includes("dispatch") || lower.includes("transit") || lower.includes("ship");
                      const isProcessing = lower.includes("process") || lower.includes("pack");
                      const isCancelled = lower.includes("cancel") || lower.includes("error");

                      const badgeBg = isDelivered ? "#dcfce7" : isDispatched ? "#e0f2fe" : isProcessing ? "#fef3c7" : isCancelled ? "#fee2e2" : "#fef9c3";
                      const badgeColor = isDelivered ? "#15803d" : isDispatched ? "#0369a1" : isProcessing ? "#b45309" : isCancelled ? "#b91c1c" : "#a16207";
                      const badgeIcon = isDelivered ? "✅ " : isDispatched ? "🚚 " : isProcessing ? "⏳ " : isCancelled ? "❌ " : "📦 ";

                      return (
                        <span
                          style={{
                            backgroundColor: badgeBg,
                            color: badgeColor,
                            padding: "5px 12px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            border: `1px solid ${badgeBg}`
                          }}
                        >
                          {badgeIcon}{rawStatus}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="order-action-links" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/track-order/${order.orderId}`} className="track-link-btn">
                      <FaTruck /> Track
                    </Link>

                    {/* Return / Refund triggers if Delivered */}
                    {(() => {
                      const st = (
                        order.order_progress_status ||
                        order.status ||
                        order.order_status ||
                        order.statusName ||
                        ""
                      ).toLowerCase();
                      const isDelivered = st.includes("deliver") || st.includes("complete");

                      if (isDelivered) {
                        return (
                          <>
                            <button
                              type="button"
                              className="track-link-btn"
                              style={{ background: "#fff7ed", color: "#c2410c", borderColor: "#fed7aa" }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowReturnModal(true);
                              }}
                            >
                              <FaUndoAlt /> Return / Replace
                            </button>
                            <button
                              type="button"
                              className="track-link-btn"
                              style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowStatusModal(true);
                              }}
                            >
                              <FaEye /> Refund Status
                            </button>
                          </>
                        );
                      }
                      return null;
                    })()}

                    <button
                      className="details-link-btn"
                      onClick={() => handleNavigate(order.orderId, order)}
                    >
                      Details <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="booking_box empty-orders-card">
          <FaRegCalendarTimes className="error-icon" size={48} color="#ea580c" />
          <h3 className="no_booking_title">No Orders Found Yet</h3>
          <p className="no_booking_text">Explore our divine store for energized idols, yantras, gemstones and pooja samagri.</p>
          <Link to="/ecomerce" className="shop-now-cta-btn">
            Explore Pooja Store 🙏
          </Link>
        </div>
      )}

      {/* Return & Refund Modals */}
      <ReturnRequestModal
        order={selectedOrder ? { ...selectedOrder, user_id: selectedOrder.user_id || selectedOrder.userId || user1?.id } : null}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          setShowReturnModal(false);
          setShowStatusModal(true);
          fetchOrders();
        }}
      />

      <ReturnStatusModal
        userId={user1?.id}
        orderId={selectedOrder?.orderId}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />
    </div>
  );
}

export default EcommerceBookingPage;


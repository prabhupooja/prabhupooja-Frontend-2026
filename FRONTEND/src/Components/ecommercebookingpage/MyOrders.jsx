import React, { useState, useEffect } from "react";
import api from "../Axios/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReturnRequestModal from "../OrderTracking/ReturnRequestModal";
import ReturnStatusModal from "../OrderTracking/ReturnStatusModal";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import { TailSpin } from "react-loader-spinner";
import {
  FaShoppingBag,
  FaUndoAlt,
  FaEye,
  FaTruck,
  FaTimesCircle,
  FaBoxOpen,
  FaRegCalendarTimes,
} from "react-icons/fa";

const MyOrders = ({ userId }) => {
  const { user1 } = useAuthStore();
  const effectiveUserId = userId || user1?.id;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (effectiveUserId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [effectiveUserId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/getby/${effectiveUserId}`);
      if (res.data?.success) {
        const rawOrders = Array.isArray(res.data.data?.orders)
          ? res.data.data.orders
          : Object.values(res.data.data?.orders || {});
        setOrders(rawOrders);
      }
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    Swal.fire({
      title: "Cancel Order",
      text: "Please provide a reason for cancelling this order:",
      input: "text",
      inputPlaceholder: "e.g. Ordered by mistake, found alternative...",
      showCancelButton: true,
      confirmButtonText: "Cancel Order",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Keep Order",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Cancellation reason is required!";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.put(`/orders/cancelOrder/${orderId}`, {
            cancelReason: result.value.trim(),
          });
          if (res.data?.success || res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Order Cancelled",
              text: "Your order has been cancelled successfully.",
              confirmButtonColor: "#ea580c",
            });
            fetchOrders();
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Cancellation Failed",
            text: err.response?.data?.message || "Could not cancel order at this stage.",
            confirmButtonColor: "#ea580c",
          });
        }
      }
    });
  };

  const getOrderStatusBadge = (order) => {
    const rawStatus = (
      order.order_progress_status ||
      order.status ||
      order.order_status ||
      order.statusName ||
      "Placed"
    ).toLowerCase();

    const isDelivered = rawStatus.includes("deliver") || rawStatus.includes("complete");
    const isDispatched = rawStatus.includes("dispatch") || rawStatus.includes("transit") || rawStatus.includes("ship");
    const isProcessing = rawStatus.includes("process") || rawStatus.includes("pack");
    const isCancelled = rawStatus.includes("cancel") || rawStatus.includes("error");

    const bg = isDelivered ? "#dcfce7" : isDispatched ? "#e0f2fe" : isProcessing ? "#fef3c7" : isCancelled ? "#fee2e2" : "#fef9c3";
    const color = isDelivered ? "#15803d" : isDispatched ? "#0369a1" : isProcessing ? "#b45309" : isCancelled ? "#b91c1c" : "#a16207";

    return (
      <span
        style={{
          background: bg,
          color: color,
          padding: "5px 12px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {rawStatus.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <TailSpin height="50" width="50" color="#ea580c" />
        <p style={{ marginTop: "16px", color: "#64748b", fontWeight: "600" }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "980px", margin: "30px auto", padding: "0 20px", fontFamily: "inherit" }}>
      <div style={{ borderBottom: "2px solid #fed7aa", paddingBottom: "16px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#9a3412", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
          <FaShoppingBag style={{ color: "#ea580c" }} /> My Orders & Purchases
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "6px 0 0 0" }}>
          Track, cancel, request money refund / replacements and download tax invoices
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <FaRegCalendarTimes size={54} color="#ea580c" style={{ marginBottom: "16px" }} />
          <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>No Orders Placed Yet</h3>
          <p style={{ color: "#64748b", margin: "0 0 20px 0" }}>
            Explore our divine pooja store for energized idols, yantras, and sacred samagri.
          </p>
          <Link
            to="/ecomerce"
            style={{
              display: "inline-block",
              background: "#ea580c",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Explore Pooja Store 🙏
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((ord, idx) => {
            const statusStr = (
              ord.order_progress_status ||
              ord.status ||
              ord.order_status ||
              ord.statusName ||
              ""
            ).toLowerCase();

            const isDelivered = statusStr.includes("deliver") || statusStr.includes("complete");
            const isCancelled = statusStr.includes("cancel") || statusStr.includes("error");
            const canCancel = !isDelivered && !isCancelled;

            return (
              <div
                key={ord.orderId || idx}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #fed7aa",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  transition: "all 0.2s",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", color: "#0f172a" }}>Order #{ord.orderId}</strong>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                      Placed on: {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recent"}
                    </div>
                  </div>
                  <div>{getOrderStatusBadge(ord)}</div>
                </div>

                {/* Content */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", flexWrap: "wrap", gap: "14px" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#ea580c" }}>
                      ₹{Number(ord.totalPrice || ord.Price || 0).toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
                      Payment: <strong>{ord.paymentMethod || "Online"}</strong> {ord.paymentStatus ? `(${ord.paymentStatus})` : ""}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Link
                      to={`/track-order/${ord.orderId}`}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #0284c7",
                        background: "#f0f9ff",
                        color: "#0284c7",
                        fontWeight: "700",
                        fontSize: "13px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaTruck /> Track
                    </Link>

                    {/* Return / Replace Button (When Delivered) */}
                    {isDelivered && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setShowReturnModal(true);
                          }}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "1.5px solid #ea580c",
                            background: "#fff7ed",
                            color: "#c2410c",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaUndoAlt /> Return / Replace
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setShowStatusModal(true);
                          }}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "1.5px solid #16a34a",
                            background: "#f0fdf4",
                            color: "#166534",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaEye /> Refund Status
                        </button>
                      </>
                    )}

                    {/* Cancel Order Button */}
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(ord.orderId)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: "1.5px solid #dc2626",
                          background: "#fef2f2",
                          color: "#b91c1c",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <FaTimesCircle /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Return Request Modal */}
      <ReturnRequestModal
        order={selectedOrder}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          setShowReturnModal(false);
          setShowStatusModal(true);
          fetchOrders();
        }}
      />

      {/* Return Status Modal */}
      <ReturnStatusModal
        userId={effectiveUserId}
        orderId={selectedOrder?.orderId}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
      />
    </div>
  );
};

export default MyOrders;

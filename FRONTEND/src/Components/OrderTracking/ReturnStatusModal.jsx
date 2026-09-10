import React, { useState, useEffect } from "react";
import api from "../Axios/api";
import "./ReturnModals.css";
import {
  FaSyncAlt,
  FaFileInvoiceDollar,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaInfoCircle
} from "react-icons/fa";

const ReturnStatusModal = ({ userId, orderId, isOpen, onClose }) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserReturns();
    }
  }, [isOpen, userId, orderId]);

  const fetchUserReturns = async () => {
    try {
      setLoading(true);
      const url = orderId
        ? `/orders/user-returns/${userId}?orderId=${orderId}`
        : `/orders/user-returns/${userId}`;
      const res = await api.get(url);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setReturns(res.data.data);
      } else {
        setReturns([]);
      }
    } catch (err) {
      console.error("Error fetching user returns:", err);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderStatusBadge = (status) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved" || s === "refunded" || s === "replaced") {
      return (
        <span className="ppm-badge ppm-badge-approved">
          <FaCheckCircle style={{ marginRight: "4px" }} /> {s.toUpperCase()}
        </span>
      );
    }
    if (s === "rejected" || s === "cancelled") {
      return (
        <span className="ppm-badge ppm-badge-rejected">
          <FaTimesCircle style={{ marginRight: "4px" }} /> {s.toUpperCase()}
        </span>
      );
    }
    return (
      <span className="ppm-badge ppm-badge-pending">
        <FaClock style={{ marginRight: "4px" }} /> {s.toUpperCase() || "PENDING REVIEW"}
      </span>
    );
  };

  return (
    <div className="ppm-modal-overlay" onClick={onClose}>
      <div className="ppm-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ppm-modal-header">
          <h3 className="ppm-modal-title">
            <FaSyncAlt /> Return & Refund Tracking Status
          </h3>
          <button type="button" onClick={onClose} className="ppm-close-btn" title="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="ppm-modal-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
              <p>Fetching your return & refund details...</p>
            </div>
          ) : returns.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <FaInfoCircle size={36} color="#94a3b8" style={{ marginBottom: "12px" }} />
              <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>No Return Requests Found</h4>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                {orderId
                  ? `There are no return or refund records submitted for Order #${orderId}.`
                  : "You have not submitted any return or replacement requests yet."}
              </p>
            </div>
          ) : (
            returns.map((item) => {
              const reqType = (item.request_type || "refund").toLowerCase();
              return (
                <div key={item.id || item.order_id} className="ppm-status-card">
                  <div className="ppm-status-header">
                    <div>
                      <strong style={{ fontSize: "15px", color: "#0f172a" }}>
                        {reqType === "refund" ? "💰 Money Refund" : "🔄 Product Replacement"}
                      </strong>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Order #{item.order_id} {item.createdAt ? `• ${new Date(item.createdAt).toLocaleDateString("en-IN")}` : ""}
                      </div>
                    </div>
                    <div>{renderStatusBadge(item.admin_status || item.refund_status)}</div>
                  </div>

                  <p style={{ margin: "8px 0", fontSize: "14px", color: "#334155" }}>
                    <strong style={{ color: "#475569" }}>Reason:</strong> {item.reason || "Product issue / return"}
                  </p>

                  {/* REFUND INFORMATION */}
                  {reqType === "refund" && (
                    <div className="ppm-status-detail-box">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>Refund Amount:</span>
                        <strong style={{ fontSize: "14px", color: "#ea580c" }}>₹{item.amount || item.orderTotalPrice || "0"}</strong>
                      </div>

                      {item.upi_id && (
                        <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
                          <strong>UPI ID:</strong> {item.upi_id}
                        </div>
                      )}

                      {item.bank_name && (
                        <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
                          <strong>Bank Account:</strong> {item.bank_name} ••••{String(item.account_number || "").slice(-4)} ({item.account_holder_name || ""})
                        </div>
                      )}

                      {item.transaction_reference && (
                        <div style={{ marginTop: "8px", padding: "8px 12px", background: "#ecfdf5", borderRadius: "8px", border: "1px solid #a7f3d0" }}>
                          <span style={{ color: "#065f46", fontSize: "13px", fontWeight: "700" }}>
                            ✓ Bank Payout UTR / Ref: {item.transaction_reference}
                          </span>
                        </div>
                      )}

                      {item.payment_receipt && (
                        <div style={{ marginTop: "10px" }}>
                          <a
                            href={item.payment_receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ppm-receipt-link"
                          >
                            <FaFileInvoiceDollar /> View / Download Payment Receipt Proof <FaExternalLinkAlt size={10} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* REPLACEMENT INFORMATION */}
                  {reqType === "replacement" && (
                    <div className="ppm-tracking-box">
                      {item.replacement_tracking_id ? (
                        <div>
                          <div style={{ color: "#166534", fontWeight: "800", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaTruck /> Replacement Dispatched!
                          </div>
                          <div style={{ fontSize: "13px", color: "#334155", marginTop: "6px" }}>
                            <strong>Courier Partner:</strong> {item.replacement_courier || "Express Logistics"}
                          </div>
                          <div style={{ fontSize: "13px", color: "#334155", marginTop: "2px" }}>
                            <strong>Tracking Number:</strong> {item.replacement_tracking_id}
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: "#c2410c", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FaClock /> Admin is packing your replacement parcel. Courier & tracking number will appear here once dispatched.
                        </div>
                      )}
                    </div>
                  )}

                  {item.admin_remarks && (
                    <div style={{ marginTop: "10px", fontSize: "12px", color: "#64748b", fontStyle: "italic", background: "#f1f5f9", padding: "8px 12px", borderRadius: "8px" }}>
                      <strong>Admin Note:</strong> {item.admin_remarks}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Close Button */}
          <div className="ppm-actions" style={{ marginTop: "16px", paddingTop: "14px" }}>
            <button type="button" onClick={onClose} className="ppm-btn-cancel" style={{ width: "100%" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnStatusModal;

import React, { useState } from "react";
import api from "../Axios/api";
import Swal from "sweetalert2";
import "./ReturnModals.css";
import { FaUndoAlt, FaMoneyBillWave, FaExchangeAlt, FaShieldAlt } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";

const ReturnRequestModal = ({ order, isOpen, onClose, onSuccess }) => {
  const { user1 } = useAuthStore();
  const [requestType, setRequestType] = useState("refund"); // 'refund' or 'replacement'
  const [reason, setReason] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const orderId = order.orderId || order.order_id || order.id || order.OrderId;
  const userId = user1?.id || order.user_id || order.userId;
  const orderTotal = order.totalPrice || order.Price || order.amount || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please provide a reason for return / replacement.",
        confirmButtonColor: "#ea580c"
      });
      return;
    }

    if (requestType === "refund" && !upiId.trim() && !accountNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Payout Details Required",
        text: "Please provide either your UPI ID or Bank Account Details to receive the refund.",
        confirmButtonColor: "#ea580c"
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: userId,
        order_id: orderId,
        request_type: requestType,
        reason: reason.trim(),
        amount: orderTotal,
        upi_id: upiId.trim() || undefined,
        account_holder_name: accountHolderName.trim() || undefined,
        bank_name: bankName.trim() || undefined,
        account_number: accountNumber.trim() || undefined,
        ifsc_code: ifscCode.trim() || undefined,
        proof_images: proofImage.trim() ? [proofImage.trim()] : undefined,
      };

      const res = await api.post("/orders/return-order", payload);

      if (res.data?.success || res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Request Submitted Successfully!",
          text: `Your ${requestType === "refund" ? "money refund" : "product replacement"} request has been logged. Our administration team will verify and process it shortly.`,
          confirmButtonColor: "#ea580c"
        });

        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error(res.data?.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error("Return Request Error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.response?.data?.message || err.message || "Failed to submit return request. Please try again later.",
        confirmButtonColor: "#ea580c"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ppm-modal-overlay" onClick={onClose}>
      <div className="ppm-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ppm-modal-header">
          <h3 className="ppm-modal-title">
            <FaUndoAlt /> Request Return / Replacement
          </h3>
          <button type="button" onClick={onClose} className="ppm-close-btn" title="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="ppm-modal-body">
          <div style={{ marginBottom: "16px", padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Order Reference:</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
              <strong style={{ fontSize: "15px", color: "#0f172a" }}>Order #{orderId}</strong>
              <strong style={{ fontSize: "15px", color: "#ea580c" }}>₹{orderTotal}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Request Type Selection */}
            <div className="ppm-field-group">
              <label className="ppm-field-label">Choose Request Type:</label>
              <div className="ppm-type-grid">
                <div
                  className={`ppm-type-card ${requestType === "refund" ? "active" : ""}`}
                  onClick={() => setRequestType("refund")}
                >
                  <input
                    type="radio"
                    name="ppmReqType"
                    value="refund"
                    checked={requestType === "refund"}
                    onChange={() => setRequestType("refund")}
                  />
                  <div className="ppm-type-info">
                    <strong><FaMoneyBillWave style={{ color: "#ea580c", marginRight: "4px" }} /> Money Refund</strong>
                    <span>Direct UPI / Bank Transfer</span>
                  </div>
                </div>

                <div
                  className={`ppm-type-card ${requestType === "replacement" ? "active" : ""}`}
                  onClick={() => setRequestType("replacement")}
                >
                  <input
                    type="radio"
                    name="ppmReqType"
                    value="replacement"
                    checked={requestType === "replacement"}
                    onChange={() => setRequestType("replacement")}
                  />
                  <div className="ppm-type-info">
                    <strong><FaExchangeAlt style={{ color: "#0284c7", marginRight: "4px" }} /> Replacement</strong>
                    <span>Ship fresh exchange item</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="ppm-field-group">
              <label className="ppm-field-label">
                Reason for {requestType === "refund" ? "Refund" : "Replacement"} <span className="req">*</span>
              </label>
              <textarea
                rows={3}
                className="ppm-textarea"
                placeholder="e.g. Received damaged idol, defective pooja bell, missing item, wrong size..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Optional Proof Image URL */}
            <div className="ppm-field-group">
              <label className="ppm-field-label">Photo / Proof Image Link (Optional):</label>
              <input
                type="text"
                className="ppm-input"
                placeholder="Paste image URL (e.g. https://example.com/photo.jpg)"
                value={proofImage}
                onChange={(e) => setProofImage(e.target.value)}
              />
            </div>

            {/* Payout Details (Only for Money Refund) */}
            {requestType === "refund" && (
              <div className="ppm-payout-box">
                <div className="ppm-payout-header">
                  <FaShieldAlt /> Where should Admin transfer your refund?
                </div>

                <div className="ppm-field-group" style={{ marginBottom: "10px" }}>
                  <label className="ppm-field-label" style={{ fontSize: "13px" }}>
                    UPI ID (Instant Direct Payout):
                  </label>
                  <input
                    type="text"
                    className="ppm-input"
                    placeholder="e.g. mobile@upi or yourname@okaxis / paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <div className="ppm-or-divider">
                  <span>OR BANK ACCOUNT DETAILS</span>
                </div>

                <div className="ppm-grid-2">
                  <div>
                    <label className="ppm-field-label" style={{ fontSize: "12px" }}>Account Holder Name:</label>
                    <input
                      type="text"
                      className="ppm-input"
                      placeholder="Name as in Bank passbook"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ppm-field-label" style={{ fontSize: "12px" }}>Bank Name:</label>
                    <input
                      type="text"
                      className="ppm-input"
                      placeholder="e.g. SBI, HDFC, ICICI"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ppm-field-label" style={{ fontSize: "12px" }}>Account Number:</label>
                    <input
                      type="text"
                      className="ppm-input"
                      placeholder="Bank account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ppm-field-label" style={{ fontSize: "12px" }}>IFSC Code:</label>
                    <input
                      type="text"
                      className="ppm-input"
                      placeholder="e.g. SBIN0001234"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="ppm-actions">
              <button type="button" onClick={onClose} className="ppm-btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="ppm-btn-submit">
                {loading ? "Submitting..." : `Submit ${requestType === "refund" ? "Refund" : "Replacement"} Request`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestModal;

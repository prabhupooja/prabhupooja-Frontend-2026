import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import "../../styles/bookpoojaform.css";

function BookPoojaForm({ onClose, data }) {
  const { user1 } = useAuthStore();

  const packageName = data?.packageName || data?.package_name || "Standard Package";
  const isFreePrasad =
    packageName.toLowerCase().includes("family") ||
    packageName.toLowerCase().includes("maha") ||
    packageName.toLowerCase().includes("hawan");

  const prasadPrice = isFreePrasad ? 0 : (data?.prasad_price || 251);

  const [formData, setFormData] = useState({
    devotee_name: user1?.name || "",
    gotra: "",
    family_members: "",
    sankalp_wish: "",
    bookingdate: new Date().toISOString().slice(0, 10),
    time_slot: "Morning (07:00 AM - 09:00 AM)",
    whatsapp_number: user1?.mobile || "",
    need_prasad: true,
    shipping_address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  // Dynamic Total Calculation
  const basePrice = Number(data?.price) || 0;
  const currentPrasadAmount = formData.need_prasad ? prasadPrice : 0;
  const totalAmount = basePrice + currentPrasadAmount;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user1) {
      Swal.fire({
        icon: "warning",
        title: "Please Login First",
        text: "You must be logged in to book this Pooja.",
      });
      return;
    }

    if (!formData.devotee_name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Devotee Name Required",
        text: "Please enter Primary Devotee (Yajman) Name for Vedic Sankalp.",
      });
      return;
    }

    if (!formData.bookingdate) {
      Swal.fire({
        icon: "error",
        title: "Date Required",
        text: "Please select an auspicious Pooja date.",
      });
      return;
    }

    if (!formData.whatsapp_number.trim()) {
      Swal.fire({
        icon: "error",
        title: "WhatsApp Number Required",
        text: "Please provide WhatsApp number to receive Live Video call link and photos.",
      });
      return;
    }

    if (formData.need_prasad) {
      if (!formData.shipping_address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
        Swal.fire({
          icon: "error",
          title: "Address Required",
          text: "Please fill complete shipping address, city, and pincode for Prasad delivery.",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const order = await api.post(
        "/payment/create-payment",
        {
          amount: totalAmount,
          currency: "INR",
          user_id: user1.id,
          puja: data.name,
          puja_id: data.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdAt = order.data?.data?.created_at || Math.floor(Date.now() / 1000);
      const paymentid = order.data?.data?.id || `PAY_${Date.now()}`;

      const razorpayKey = order.data?.key_id || order.data?.data?.key_id || process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_J3QKwQbU1OGf1Y";

      const options = {
        key: razorpayKey,
        amount: order.data?.data?.amount || totalAmount * 100,
        currency: "INR",
        name: formData.devotee_name || user1.name,
        description: `Pooja Booking - ${packageName} ${formData.need_prasad ? "+ Prasad" : ""}`,
        order_id: order.data?.data?.id,
        handler: async function (response) {
          try {
            const verifyResponse = await api.post(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyResponse.data?.success) {
              await api.post(
                "/pooja/booking/create",
                {
                  pujaid: data.id,
                  paymentid: paymentid,
                  amount: totalAmount,
                  userid: user1.id,
                  bookingdate: formData.bookingdate,
                  paymentdate: createdAt,
                  package_name: packageName,
                  package_id: data.package_id || null,
                  devotee_name: formData.devotee_name,
                  gotra: formData.gotra || "Vedic",
                  family_members: formData.family_members || "",
                  sankalp_wish: formData.sankalp_wish || "",
                  time_slot: formData.time_slot,
                  whatsapp_number: formData.whatsapp_number,
                  need_prasad: formData.need_prasad ? 1 : 0,
                  prasad_amount: currentPrasadAmount,
                  shipping_address: formData.need_prasad ? formData.shipping_address : "",
                  city: formData.need_prasad ? formData.city : "",
                  state: formData.need_prasad ? formData.state : "",
                  pincode: formData.need_prasad ? formData.pincode : "",
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              Swal.fire({
                icon: "success",
                title: "🙏 Pooja Booked Successfully!",
                text: `Sankalp registered for ${formData.devotee_name}. Our Acharya will connect on WhatsApp (${formData.whatsapp_number}) on ${formData.bookingdate}.${formData.need_prasad ? " Consecrated Prasad will be dispatched to your address." : ""}`,
                confirmButtonText: "Jai Shree Ram",
              }).then(() => {
                if (onClose) onClose();
                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Payment Verification Failed",
                text: "Please try again or contact support.",
              });
            }
          } catch (error) {
            console.error("Booking API error:", error);
            Swal.fire({
              icon: "error",
              title: "Booking Error",
              text: "Payment received but booking creation encountered an error. Our team will verify and confirm.",
            });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.devotee_name || user1.name,
          email: user1.email,
          contact: formData.whatsapp_number || user1.mobile,
        },
        theme: { color: "#ea580c" },
        method: { upi: true, qr: true },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: `Error: ${response.error?.description || "Transaction cancelled"}`,
        });
        setLoading(false);
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Initialization Failed",
        text: "Could not connect to payment gateway. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-modal-body">
      {/* 1. Vedic Sankalp & Devotee Details */}
      <div className="booking-section-box">
        <h4 className="booking-section-title">
          <span>🕉️</span> 1. Vedic Sankalp & Devotee Details
        </h4>

        <div className="booking-grid-2">
          <div className="booking-field-group">
            <label className="booking-field-label">Primary Devotee (Yajman) Name *</label>
            <input
              type="text"
              name="devotee_name"
              required
              placeholder="e.g. Ramesh Sharma"
              value={formData.devotee_name}
              onChange={handleChange}
              className="booking-field-input"
            />
          </div>

          <div className="booking-field-group">
            <label className="booking-field-label">Gotra (गोत्र)</label>
            <input
              type="text"
              name="gotra"
              placeholder="e.g. Kashyap, Bhardwaj (or Vedic)"
              value={formData.gotra}
              onChange={handleChange}
              className="booking-field-input"
            />
          </div>
        </div>

        <div className="booking-field-group">
          <label className="booking-field-label">Family Members for Sankalp (comma separated)</label>
          <input
            type="text"
            name="family_members"
            placeholder="e.g. Sunita Sharma (Wife), Rahul Sharma (Son)"
            value={formData.family_members}
            onChange={handleChange}
            className="booking-field-input"
          />
        </div>

        <div className="booking-field-group">
          <label className="booking-field-label">Sankalp Purpose / Special Wish (मनोकामना)</label>
          <input
            type="text"
            name="sankalp_wish"
            placeholder="e.g. Good health, business growth, family peace & prosperity"
            value={formData.sankalp_wish}
            onChange={handleChange}
            className="booking-field-input"
          />
        </div>
      </div>

      {/* 2. Shubh Muhurat & Live Call */}
      <div className="booking-section-box">
        <h4 className="booking-section-title">
          <span>📅</span> 2. Shubh Muhurat & Live Link
        </h4>

        <div className="booking-grid-3">
          <div className="booking-field-group">
            <label className="booking-field-label">Pooja Date *</label>
            <input
              type="date"
              name="bookingdate"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={formData.bookingdate}
              onChange={handleChange}
              className="booking-field-input"
            />
          </div>

          <div className="booking-field-group">
            <label className="booking-field-label">Preferred Time Slot</label>
            <select
              name="time_slot"
              value={formData.time_slot}
              onChange={handleChange}
              className="booking-field-select"
            >
              <option value="Morning (07:00 AM - 09:00 AM)">Morning (07:00 AM - 09:00 AM)</option>
              <option value="Afternoon (11:00 AM - 01:00 PM)">Afternoon (11:00 AM - 01:00 PM)</option>
              <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
            </select>
          </div>

          <div className="booking-field-group">
            <label className="booking-field-label">WhatsApp No. (for Live Link) *</label>
            <input
              type="tel"
              name="whatsapp_number"
              required
              placeholder="e.g. 9876543210"
              value={formData.whatsapp_number}
              onChange={handleChange}
              className="booking-field-input"
            />
          </div>
        </div>
      </div>

      {/* 3. Prasad & Raksha Sutra Delivery */}
      <div className="booking-section-box" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
        <div className="prasad-checkbox-row">
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flex: 1 }}>
            <input
              type="checkbox"
              name="need_prasad"
              checked={formData.need_prasad}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", accentColor: "#ea580c", cursor: "pointer" }}
            />
            <div>
              <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "13px" }}>
                📦 Send Blessed Mandir Prasad & Raksha Sutra to my home
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "400", marginTop: "2px" }}>
                Panchmeva Prasad, Janeu, Vibhuti & consecrated Raksha Sutra
              </div>
            </div>
          </label>
          <div>
            {isFreePrasad ? (
              <span className="free-badge">FREE (Included)</span>
            ) : (
              <span className={`prasad-addon-badge ${formData.need_prasad ? "active" : ""}`}>
                + ₹{prasadPrice}
              </span>
            )}
          </div>
        </div>

        {formData.need_prasad && (
          <div className="prasad-address-box">
            <div className="booking-field-group">
              <label className="booking-field-label">Full Delivery Address *</label>
              <input
                type="text"
                name="shipping_address"
                required={formData.need_prasad}
                placeholder="House/Flat No., Building, Street, Landmark"
                value={formData.shipping_address}
                onChange={handleChange}
                className="booking-field-input"
              />
            </div>

            <div className="booking-grid-3">
              <div className="booking-field-group">
                <input
                  type="text"
                  name="city"
                  required={formData.need_prasad}
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  className="booking-field-input"
                />
              </div>

              <div className="booking-field-group">
                <input
                  type="text"
                  name="state"
                  required={formData.need_prasad}
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleChange}
                  className="booking-field-input"
                />
              </div>

              <div className="booking-field-group">
                <input
                  type="text"
                  name="pincode"
                  required={formData.need_prasad}
                  placeholder="Pincode *"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="booking-field-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="booking-modal-footer">
        <div className="modal-price-breakdown">
          <span className="modal-price-label">
            {formData.need_prasad && prasadPrice > 0 ? "Total (Pooja + Prasad)" : "Total Dakshina & Samagri"}
          </span>
          <div className="modal-price-val">Rs. {totalAmount}</div>
          <div className="modal-price-sub">
            Pooja: Rs. {basePrice}
            {formData.need_prasad ? (
              isFreePrasad ? " • Prasad: FREE" : ` • Prasad: +Rs. ${prasadPrice}`
            ) : " • Prasad: None"}
          </div>
        </div>

        <div className="modal-btn-group">
          <button type="button" onClick={onClose} className="modal-cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="modal-submit-btn">
            {loading ? "Connecting Gateway..." : `Proceed to Pay (Rs. ${totalAmount})`}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BookPoojaForm;

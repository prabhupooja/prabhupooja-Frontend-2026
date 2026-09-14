import React, { useEffect, useState } from "react";
import "../../styles/checkout.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../Axios/api";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { FaShieldAlt, FaTruck, FaOm, FaCheckCircle } from "react-icons/fa";

function Prasadcheckout() {
  const { user1 } = useAuthStore();
  const location = useLocation();
  const stateData = location.state || {};
  
  const {
    price = 0,
    id,
    prasadName = "Temple Holy Prasad Box",
    templeName = "Sacred Hindu Mandir",
    sankalpaName = "",
    sankalpaGotra = "",
    quantity = 1,
    prasadWeight = 250,
    weight = "grams",
    subtotal: passedSubtotal,
    deliveryCharge: passedDeliveryCharge,
    totalPrice: passedTotalPrice,
  } = stateData;

  const prasad_id = id;
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Price & Delivery calculation
  const unitPrice = Number(price) || 0;
  const qty = Number(quantity) || 1;
  const subtotal = passedSubtotal !== undefined && passedSubtotal !== null
    ? Number(passedSubtotal)
    : unitPrice * qty;

  const deliveryCharge = passedDeliveryCharge !== undefined && passedDeliveryCharge !== null
    ? Number(passedDeliveryCharge)
    : (subtotal >= 499 || subtotal === 0 ? 0 : 40);

  const grandTotal = passedTotalPrice !== undefined && passedTotalPrice !== null
    ? Number(passedTotalPrice)
    : subtotal + deliveryCharge;

  useEffect(() => {
    if (user1) {
      setFormValues((prev) => ({
        ...prev,
        name: sankalpaName || user1.name || prev.name,
        lastName: sankalpaName ? "" : (user1.lastname || prev.lastName),
        email: user1.email || prev.email,
        mobile: user1.mobile || user1.number || prev.mobile,
        address: user1.address?.address || user1.address || prev.address,
        city: user1.address?.city || user1.city || prev.city,
        state: user1.address?.state || user1.state || prev.state,
        country: user1.address?.country || user1.country || "India",
        postalCode: user1.address?.postalCode || user1.postalCode || prev.postalCode,
      }));
    } else {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book sacred prasad delivery!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
    }
  }, [user1, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalVal = value;
    if (name === "mobile" || name === "phone" || name === "number") {
      finalVal = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "postalCode") {
      finalVal = value.replace(/\D/g, "").slice(0, 6);
    }
    setFormValues((prev) => ({ ...prev, [name]: finalVal }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formValues.name?.trim()) newErrors.name = "First name is required.";
    if (!formValues.email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email address is invalid.";
    }
    const cleanMob = (formValues.mobile || "").replace(/\D/g, "");
    if (!cleanMob) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(cleanMob)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!formValues.address?.trim()) newErrors.address = "Address is required.";
    if (!formValues.country?.trim()) newErrors.country = "Country is required.";
    if (!formValues.city?.trim()) newErrors.city = "City is required.";
    if (!formValues.state?.trim()) newErrors.state = "State is required.";
    if (!formValues.postalCode?.trim()) newErrors.postalCode = "Postal Code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to complete your prasad booking!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
      return;
    }

    if (!validate()) {
      Swal.fire({
        title: "Missing Details",
        text: "Please fill all required delivery address fields.",
        icon: "error",
      });
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === "COD") {
      try {
        await api.post(
          "/user/prasad/booking",
          {
            prasadid: prasad_id,
            userid: user1?.id,
            quantity: qty,
            sankalpaGotra: sankalpaGotra || "Kashyap",
            sankalpaName: sankalpaName || formValues.name,
            amount: grandTotal,
            subtotal: subtotal,
            deliveryCharge: deliveryCharge,
            paymentMethod: "COD",
            weight: weight,
            prasadweight: prasadWeight,
            deliveryAddress: {
              name: `${formValues.name} ${formValues.lastName}`.trim(),
              email: formValues.email,
              mobile: formValues.mobile,
              address: formValues.address,
              city: formValues.city,
              state: formValues.state,
              country: formValues.country,
              postalCode: formValues.postalCode,
            },
            status: "Booked",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSubmitting(false);
        Swal.fire({
          title: "Prasad Order Placed!",
          text: "Jai Shri Ram! Your Prasad booking is confirmed with Cash on Delivery.",
          icon: "success",
          confirmButtonColor: "#ea580c",
        });
        navigate("/prasadbookingpage");
      } catch (error) {
        setIsSubmitting(false);
        console.error("COD booking failed:", error);
        Swal.fire("Error", "Failed to create Prasad booking. Please try again.", "error");
      }
    } else {
      try {
        const paymentResponse = await api.post(
          "/payment/create-payment",
          {
            amount: grandTotal,
            currency: "INR",
            user_id: user1?.id,
            puja: "prasad",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { id: orderId, amount: razorpayAmount } =
          paymentResponse.data.data;

        const razorpayKey =
          paymentResponse.data?.key_id ||
          paymentResponse.data?.data?.key_id ||
          process.env.REACT_APP_RAZORPAY_KEY_ID ||
          "rzp_test_J3QKwQbU1OGf1Y";

        const options = {
          key: razorpayKey,
          amount: razorpayAmount,
          currency: "INR",
          name: "Prabhu Pooja",
          description: `Prasad Delivery - ${prasadName}`,
          order_id: orderId,
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
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyResponse.data.success) {
                await api.post(
                  "/user/prasad/booking",
                  {
                    prasadid: prasad_id,
                    userid: user1.id,
                    quantity: qty,
                    paymentid: response.razorpay_payment_id,
                    sankalpaGotra: sankalpaGotra || "Kashyap",
                    sankalpaName: sankalpaName || formValues.name,
                    amount: grandTotal,
                    subtotal: subtotal,
                    deliveryCharge: deliveryCharge,
                    paymentMethod: "UPI",
                    weight: weight,
                    prasadweight: prasadWeight,
                    deliveryAddress: {
                      name: `${formValues.name} ${formValues.lastName}`.trim(),
                      email: formValues.email,
                      mobile: formValues.mobile,
                      address: formValues.address,
                      city: formValues.city,
                      state: formValues.state,
                      country: formValues.country,
                      postalCode: formValues.postalCode,
                    },
                    status: "Booked",
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setIsSubmitting(false);
                Swal.fire({
                  title: "Payment Successful!",
                  text: "Thank you for your order! Temple prasad will be sanctified and dispatched.",
                  icon: "success",
                  confirmButtonColor: "#ea580c",
                });
                navigate("/prasadbookingpage");
              } else {
                setIsSubmitting(false);
                Swal.fire(
                  "Payment Verification Failed",
                  "Please contact customer support.",
                  "error"
                );
              }
            } catch (error) {
              setIsSubmitting(false);
              console.error("Verification or booking failed:", error);
              Swal.fire("Error", "Failed to complete Prasad order.", "error");
            }
          },
          prefill: {
            name: `${formValues.name} ${formValues.lastName}`.trim(),
            email: formValues.email || user1?.email,
            contact: formValues.mobile || user1?.mobile,
          },
          theme: {
            color: "#ea580c",
          },
          method: {
            upi: true,
            qr: true,
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          setIsSubmitting(false);
          Swal.fire("Payment Failed", response.error.description || "Payment cancelled", "error");
        });
      } catch (error) {
        setIsSubmitting(false);
        console.error("Payment initiation error:", error);
        Swal.fire("Error", "An error occurred during checkout.", "error");
      }
    }
  };

  return (
    <div style={{ background: "#fffdfa", minHeight: "85vh", padding: "35px 15px 70px" }}>
      <div className="container" style={{ maxWidth: "1160px" }}>
        
        {/* Page Breadcrumb / Title */}
        <div style={{ marginBottom: "25px" }}>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            <Link to="/" style={{ color: "#ea580c", textDecoration: "none" }}>Home</Link> &nbsp;/&nbsp; 
            <Link to="/prasaddelivery" style={{ color: "#ea580c", textDecoration: "none" }}>Prasad Delivery</Link> &nbsp;/&nbsp; 
            Checkout
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginTop: "8px" }}>
            🕉️ Prasad Delivery Checkout
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14.5px" }}>
            Enter your delivery address to receive sacred consecrated temple prasad directly at your doorstep.
          </p>
        </div>

        <div className="row">
          {/* Left Column: Delivery Address Form */}
          <div className="col-lg-7 col-md-12 mb-4">
            <div style={{
              background: "#ffffff",
              border: "1px solid #fed7aa",
              borderRadius: "18px",
              padding: "26px 24px",
              boxShadow: "0 6px 20px rgba(234, 88, 12, 0.05)"
            }}>
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaTruck color="#ea580c" /> 🚚 पार्सल डिलीवरी पता व संपर्क (Delivery Address)
              </h4>

              <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>
                      प्राप्तकर्ता का नाम (Recipient First Name) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul"
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.name}
                      onChange={handleChange}
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>
                      सरनेम (Last Name)
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="e.g. Sharma"
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>ईमेल (Email Address) *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@example.com"
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.email}
                      onChange={handleChange}
                    />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>

                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>
                      डिलीवरी मोबाइल नंबर (10 Digits Mobile) *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.mobile}
                      onChange={handleChange}
                    />
                    {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                  </div>
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>Full Street Address / House No. *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="House/Flat No., Landmark, Street"
                    className="form-control"
                    style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                    value={formValues.address}
                    onChange={handleChange}
                  />
                  {errors.address && <small className="text-danger">{errors.address}</small>}
                </div>

                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Indore"
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.city}
                      onChange={handleChange}
                    />
                    {errors.city && <small className="text-danger">{errors.city}</small>}
                  </div>

                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>Pincode / Postal Code *</label>
                    <input
                      type="tel"
                      name="postalCode"
                      placeholder="e.g. 452001"
                      maxLength={6}
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.postalCode}
                      onChange={handleChange}
                    />
                    {errors.postalCode && <small className="text-danger">{errors.postalCode}</small>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>State *</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="e.g. Madhya Pradesh"
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.state}
                      onChange={handleChange}
                    />
                    {errors.state && <small className="text-danger">{errors.state}</small>}
                  </div>

                  <div className="col-sm-6 mb-3">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "5px" }}>Country *</label>
                    <input
                      type="text"
                      name="country"
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "10px 14px", border: "1.5px solid #e2e8f0" }}
                      value={formValues.country}
                      onChange={handleChange}
                    />
                    {errors.country && <small className="text-danger">{errors.country}</small>}
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="mt-3 mb-2">
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "8px", display: "block" }}>
                    Select Payment Method
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div
                      onClick={() => setPaymentMethod("UPI")}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: paymentMethod === "UPI" ? "2px solid #ea580c" : "1.5px solid #e2e8f0",
                        background: paymentMethod === "UPI" ? "#fff7ed" : "#f8fafc",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "600",
                        color: paymentMethod === "UPI" ? "#ea580c" : "#475569",
                        transition: "all 0.2s"
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        style={{ accentColor: "#ea580c" }}
                      />
                      <span>Online UPI / Card</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("COD")}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: paymentMethod === "COD" ? "2px solid #ea580c" : "1.5px solid #e2e8f0",
                        background: paymentMethod === "COD" ? "#fff7ed" : "#f8fafc",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "600",
                        color: paymentMethod === "COD" ? "#ea580c" : "#475569",
                        transition: "all 0.2s"
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        style={{ accentColor: "#ea580c" }}
                      />
                      <span>Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm */}
          <div className="col-lg-5 col-md-12">
            {/* Offering details card */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #fed7aa",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(234, 88, 12, 0.05)",
              marginBottom: "20px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #ea580c, #f97316)",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaOm size={24} />
                <div>
                  <h6 style={{ margin: 0, fontWeight: "700", fontSize: "15px" }}>{prasadName}</h6>
                  <small style={{ opacity: 0.9 }}>{templeName}</small>
                </div>
              </div>

              {/* Sankalpa Info */}
              {(sankalpaName || sankalpaGotra) && (
                <div style={{
                  background: "#fff7ed",
                  border: "1px dashed #fed7aa",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  fontSize: "13px"
                }}>
                  <strong style={{ color: "#c2410c", display: "block", marginBottom: "4px" }}>
                    🕉️ संकल्प विवरण (Sankalpa Info):
                  </strong>
                  {sankalpaName && <div style={{ color: "#475569" }}>• <strong>नाम:</strong> {sankalpaName}</div>}
                  {sankalpaGotra && <div style={{ color: "#475569" }}>• <strong>गोत्र:</strong> {sankalpaGotra}</div>}
                  <div style={{ color: "#475569" }}>• <strong>पैकेट साइज़:</strong> {prasadWeight} {weight} × {qty} Box(es)</div>
                </div>
              )}

              {/* Standard Order Summary Box */}
              <div className="order-summary-box card p-3" style={{ borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <h5 style={{ fontWeight: "700", fontSize: "16px", color: "#1e293b", marginBottom: "12px" }}>Order Summary</h5>
                
                <div className="d-flex justify-content-between my-1" style={{ fontSize: "14px", color: "#475569" }}>
                  <span>Items Subtotal ({qty} item{qty > 1 ? "s" : ""}):</span>
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="d-flex justify-content-between my-1" style={{ fontSize: "14px", color: "#475569" }}>
                  <span>Delivery Fee:</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <strong className="text-success font-weight-bold">🚚 FREE</strong>
                    ) : (
                      <strong style={{ color: "#ea580c" }}>₹{deliveryCharge.toFixed(2)}</strong>
                    )}
                  </span>
                </div>

                {deliveryCharge === 0 ? (
                  <div style={{ fontSize: "12px", color: "#15803d", background: "#dcfce7", padding: "4px 8px", borderRadius: "6px", marginTop: "4px" }}>
                    ✓ Free Delivery eligible on this Prasad order
                  </div>
                ) : (
                  <div style={{ fontSize: "12px", color: "#64748b", background: "#fff7ed", padding: "4px 8px", borderRadius: "6px", marginTop: "4px" }}>
                    💡 Tip: Orders above ₹499 get FREE delivery!
                  </div>
                )}

                <hr style={{ margin: "12px 0" }} />

                <div className="d-flex justify-content-between font-weight-bold" style={{ fontSize: "18px", color: "#ea580c" }}>
                  <span>Total Amount:</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="btn w-100 mt-3"
                style={{
                  background: "linear-gradient(135deg, #ea580c, #f97316)",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "16px",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(234, 88, 12, 0.35)",
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                }}
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : paymentMethod === "COD"
                  ? `Confirm COD Order (₹${grandTotal})`
                  : `Pay & Book Prasad (₹${grandTotal})`}
              </button>

              {/* Trust Badges */}
              <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "#64748b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaCheckCircle color="#16a34a" size={14} />
                  <span>100% Shuddh & Energized Mandir Prasad</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaShieldAlt color="#ea580c" size={14} />
                  <span>Safe & Hygienic Sealed Packaging</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaTruck color="#3b82f6" size={14} />
                  <span>Fast Doorstep Express Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prasadcheckout;

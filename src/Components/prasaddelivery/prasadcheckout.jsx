import React, { useEffect, useState } from "react";
import "../../styles/checkout.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Axios/api";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";

function Prasadcheckout() {
  const { user1 } = useAuthStore();
  const location = useLocation();
  const {
    price,
    id,
    sankalpaName,
    sankalpaGotra,
    quantity,
    prasadWeight,
    weight,
  } = location.state || {};
  const prasad_id = id;
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user1 && !formValues.name) {
      setFormValues(user1);
    } else if (!user1) {
      // navigate("/login");
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a prasad!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
    }
  }, [user1, navigate, formValues.name]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formValues.name) newErrors.name = "First name is required.";
    if (!formValues.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formValues.mobile) {
      newErrors.mobile = "Phone mobile is required.";
    } else if (formValues.mobile.length !== 10) {
      newErrors.mobile = "Phone mobile must be 10 digits.";
    }
    if (!formValues.address) newErrors.address = "Address is required.";
    if (!formValues.country) newErrors.country = "Country is required.";
    if (!formValues.city) newErrors.city = "City is required.";
    if (!formValues.state) newErrors.state = "State is required.";
    if (!formValues.postalCode)
      newErrors.postalCode = "PostalCode is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a prasad!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      });
      return;
    }

    // Step 1: Validate the form
    if (!validate()) return;

    const amount = price * quantity; // Calculate amount based on price and quantity

    if (paymentMethod === "COD") {
      // Step 2: Handle Cash on Delivery (COD)
      await api.post(
        "/user/prasad/booking",
        {
          prasadid: prasad_id,
          userid: user1?.id,
          quantity,
          sankalpaGotra,
          sankalpaName,
          amount,
          paymentMethod: "COD",
          weight: weight,
          prasadweight: prasadWeight,
          status:'Booked'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Order Successful!", "Cash on Delivery selected.", "success");
      navigate("/prasadbookingpage");
      window.location.reload();
    } else {
      try {
        // Step 4: Create payment order
        const paymentResponse = await api.post(
          "/payment/create-payment",
          {
            amount: amount, // Amount in paise for Razorpay (multiply by 100)
            currency: "INR",
            user_id: user1.id,
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

        // Razorpay options
        const options = {
          key: "rzp_live_wqQsW2lGC8RXmJ",
          amount: razorpayAmount,
          currency: "INR",
          name: "Your Store Name",
          description: "Prashad Purchase",
          order_id: orderId,
          handler: async function (response) {
            try {
              // Step 5: Verify payment
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
                // Step 6: Create booking after payment success
                await api.post(
                  "/user/prasad/booking",
                  {
                    prasadid: prasad_id,
                    userid: user1.id,
                    quantity,
                    paymentid: response.razorpay_payment_id,
                    sankalpaGotra,
                    sankalpaName,
                    amount,
                    paymentMethod: "UPI",
                    weight: weight,
                    prasadweight: prasadWeight,
                    status:'Booked'
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                Swal.fire(
                  "Payment Successful",
                  "Thank you for your order!",
                  "success"
                );
                navigate("/prasadbookingpage");
                window.location.reload();
              } else {
                Swal.fire(
                  "Payment Verification Failed",
                  "Please contact support.",
                  "error"
                );
              }
            } catch (error) {
              console.error("Verification or booking creation failed:", error);
              Swal.fire(
                "Error",
                "Failed to verify payment or create booking.",
                "error"
              );
            }
          },
          prefill: {
            email: user1.email,
            contact: user1.mobile,
          },
          theme: {
            color: "#3399cc",
          },
          method: {
            upi: true,
            qr: true,
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        // Handle payment failure
        rzp1.on("payment.failed", function (response) {
          Swal.fire(
            "Payment Failed",
            response.error.description || "Unknown error",
            "error"
          );
        });
      } catch (error) {
        console.error("Error during payment process:", error);
        Swal.fire("Error", "An error occurred during payment.", "error");
      }
    }
  };

  return (
    <>
      <section style={{ marginBottom: "1.5rem" }}>
        <div className="container">
          <div className="checkout">
            <h1>Billing Details</h1>

            <form className="checkout-form">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="First name"
                      className="form-control"
                      value={formValues.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      className="form-control"
                      value={formValues.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="form-control"
                      value={formValues.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="error">{errors.email}</div>
                    )}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile"
                      className="form-control"
                      value={formValues.mobile}
                      onChange={handleChange}
                    />
                    {errors.mobile && (
                      <div className="error">{errors.mobile}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      className="form-control"
                      value={formValues.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <div className="error">{errors.address}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      className="form-control"
                      value={formValues.city}
                      onChange={handleChange}
                    />
                    {errors.city && <div className="error">{errors.city}</div>}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="postalCode"
                      placeholder="Postal code"
                      className="form-control"
                      value={formValues.postalCode}
                      onChange={handleChange}
                    />
                    {errors.postalCode && (
                      <div className="error">{errors.postalCode}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      className="form-control"
                      value={formValues.state}
                      onChange={handleChange}
                    />
                    {errors.state && (
                      <div className="error">{errors.state}</div>
                    )}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country *"
                      className="form-control"
                      value={formValues.country}
                      onChange={handleChange}
                    />
                    {errors.country && (
                      <div className="error">{errors.country}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor="paymentMethod">Select Payment Method</label>
                    <select
                      id="paymentMethod"
                      className="form-control"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="" disabled>
                        Choose Payment Method
                      </option>
                      <option value="UPI">UPI</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="primary_btn"
                onClick={(e) => {
                  e.preventDefault();
                  handlePayment();
                }}
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Prasadcheckout;

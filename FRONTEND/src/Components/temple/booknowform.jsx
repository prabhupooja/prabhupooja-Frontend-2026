import React, { useState } from "react";
import api from "../Axios/api";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import "../../styles/templeform.css";

const Booknowform = () => {
  const [pujaDate, setPujaDate] = useState(null);
  const [dob, setDob] = useState(null);
  const [rashi, setRashi] = useState("");
  const [goutra, setGoutra] = useState("");
  const [errors, setErrors] = useState({});
  const { user1 } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const { templeId, price } = location.state || {};
  // console.log(location);
  const token = localStorage.getItem("token");

  const validateForm = () => {
    const newErrors = {};
    if (!pujaDate) newErrors.pujaDate = "Please select a desired date.";
    if (!dob) newErrors.dob = "Please enter your date of birth.";
    if (!rashi) newErrors.rashi = "Please select your Rashi.";
    if (!goutra) newErrors.goutra = "Please enter your Gotram.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (price) => {
    if (!validateForm()) return;

    if (!user1 || !user1?.id) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to book the temple.",
        confirmButtonText: "Go to Login",
      })
      return;
    }

    try {
      const order = await api.post(
        "/payment/create-payment",
        {
          amount: price,
          currency: "INR",
          user_id: user1?.id,
          puja: "temple",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayKey = order.data?.key_id || order.data?.data?.key_id || process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_J3QKwQbU1OGf1Y";

      const options = {
        key: razorpayKey,
        amount: order.data.data.amount,
        currency: "INR",
        name: user1?.name || "Guest",
        description: "Temple Session Booking",
        order_id: order.data.data.id,
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
              await handleSubmit(response.razorpay_payment_id);
            } else {
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: "Payment verification failed. Please try again.",
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Verification failed. Please contact support.",
            });
          }
        },
        prefill: {
          email: user1?.email || "",
          contact: user1?.mobile || "",
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

      rzp1.on("payment.failed", function (response) {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: `Error: ${response.error.code} | ${response.error.description}`,
        });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Unable to initiate payment. Please try again.",
      });
    }
  };

  const handleSubmit = async (orderId) => {
    if (!pujaDate || !dob || !rashi || !goutra || !orderId) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all the required fields.",
      });
      return;
    }

    try {
      const response = await api.post(
        "/temple/booking",
        {
          userId: user1?.id,
          puja_date: pujaDate,
          dob: dob,
          rashi: rashi,
          goutra: goutra,
          order_id: orderId,
          temple_id: templeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Booking Successful",
          text: "Temple booked successfully!",
        });
        navigate(`/temple/${templeId}`);
        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while booking. Please try again.",
      });
    }
  };

  return (
    <div className="addUser_temple">
      <h3>Book Temple</h3>
      <form className="addUserForm_temple" onSubmit={(e) => e.preventDefault()}>
        <div className="inputGroup_temple">
          <label>Desired Date (At least 3 days later)</label>
          <DatePicker
            selected={pujaDate}
            onChange={(date) => setPujaDate(date)}
            minDate={addDays(new Date(), 3)}
            dateFormat="dd/MM/yyyy"
            className="form-control-temple"
            placeholderText="Select Date"
          />
          {errors.pujaDate && (
            <span className="bookerror">{errors.pujaDate}</span>
          )}

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            placeholder="Name"
            required
            value={user1?.name || ""}
            disabled
          />

          <label htmlFor="phone">Number:</label>
          <input
            type="text"
            id="phone"
            required
            autoComplete="off"
            placeholder="Phone Number"
            value={user1?.mobile || ""}
            disabled
          />

          <label>Date of Birth:</label>
          <DatePicker
            selected={dob}
            onChange={(date) => setDob(date)}
            maxDate={addDays(new Date(), -1)}
            dateFormat="dd/MM/yyyy"
            className="form-control-temple"
            placeholderText="Select DOB"
          />
          {errors.dob && <span className="bookerror">{errors.dob}</span>}

          <label htmlFor="rashi">Rashi / Zodiac Sign:</label>
          <select
            id="rashi"
            name="rashi"
            className="rashi_field"
            value={rashi}
            onChange={(e) => setRashi(e.target.value)}
          >
            <option value="">Select Rashi</option>
            <option value="Mesha">Mesha (Aries)</option>
            <option value="Vrishabha">Vrishabha (Taurus)</option>
            <option value="Mithuna">Mithuna (Gemini)</option>
            <option value="Karka">Karka (Cancer)</option>
            <option value="Simha">Simha (Leo)</option>
            <option value="Kanya">Kanya (Virgo)</option>
            <option value="Tula">Tula (Libra)</option>
            <option value="Vrishchika">Vrishchika (Scorpio)</option>
            <option value="Dhanu">Dhanu (Sagittarius)</option>
            <option value="Makara">Makara (Capricorn)</option>
            <option value="Kumbha">Kumbha (Aquarius)</option>
            <option value="Meena">Meena (Pisces)</option>
          </select>
          {errors.rashi && <span className="bookerror">{errors.rashi}</span>}

          <label htmlFor="goutra">Gotram:</label>
          <input
            type="text"
            id="goutra"
            autoComplete="off"
            placeholder="Gotram"
            value={goutra}
            onChange={(e) => setGoutra(e.target.value)}
          />
          {errors.goutra && <span className="bookerror">{errors.goutra}</span>}

          <button
            type="button"
            className="btn btn-success"
            onClick={() => handlePayment(price)}
          >
            Book Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booknowform;

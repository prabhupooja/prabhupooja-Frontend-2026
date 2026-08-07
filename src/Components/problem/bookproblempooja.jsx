import React, { useState } from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";


function BookProblemPooja({ selectedBox, problem }) {
  const [date, setDate] = useState(null);
  const { user1 } = useAuthStore();
  const token = localStorage.getItem("token");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedPrice = selectedBox.price.replace("₹", "").trim();
    if (!date) {
      Swal.fire({
        icon: "warning",
        title: "Date Required",
        text: "Please select a date.",
      });
      return;
    }
    Swal.fire({
      icon: "info",
      title: "Confirm Booking",
      text: `You are booking a pooja .`,
      confirmButtonText: "Proceed to Payment",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with payment
        try {
          const order = await api.post(
            "/payment/create-payment",
            {
              amount: cleanedPrice,
              currency: "INR",
              user_id: user1.id,
              puja: "problem_pooja",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const createdAt = order?.data?.data.created_at;

          // console.log(createdAt, "sifjslifjslk");

          const options = {
            key: "rzp_live_wqQsW2lGC8RXmJ",
            amount: order.data.data.amount,
            currency: "INR",
            name: user1.name,
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
                  // console.log(user1.id, cleanedPrice);
                  // console.log(date,'dfdf')
                  const bookingdate = `${date.getFullYear()}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                  // console.log(bookingdate, "bookingdate");
                  await api.post(
                    "/problem/booking",
                    {
                      pujaid: problem.id,
                      paymentid: response.razorpay_payment_id,
                      amount: cleanedPrice,
                      userid: user1.id,
                      paymentdate: createdAt,
                      bookingdate: bookingdate,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  Swal.fire({
                    icon: "success",
                    title: "Booking Confirmed",
                    text: `Pooja successfully booked `,
                    confirmButtonText: "OK",
                  });
                  window.location.reload();
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Payment Verification Failed",
                    text: "Please try again.",
                  });
                }
              } catch (error) {
                console.error("Booking API error:", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Booking failed. Please contact support.",
                });
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

          rzp1.on("payment.failed", function (response) {
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text: `Error: ${response.error.description}`,
            });
          });
        } catch (error) {
          console.error("Payment creation failed:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Payment failed. Please contact support.",
          });
        }
      }
    });
  };


  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "15px auto",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* <h2 style={{ color: "#cd5702", marginBottom: "20px" }}>Book Pooja</h2> */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <label
            htmlFor="pooja-date"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#333",
            }}
          >
            Select Date
          </label>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className="date-picker-input"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                fontSize: "16px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#cd5702",
            color: "#fff",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#b04a01")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#cd5702")}
        >
          Book Now
        </button>
      </form>
    </div>
  );
}

export default BookProblemPooja;

import React from "react";
import api from "../Axios/api";
import { useNavigate } from "react-router-dom";
import "../../styles/astrology.css";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";

function Recharge() {
  const navigate = useNavigate();
  const { user1, Loading } = useAuthStore();
  const token = localStorage.getItem("token");

  const handlePayment = async (price) => {
    if (!user1) {
      // navigate("/login");
      Swal.fire({
        title: "Login Required",
        text: "Please log in to continue.",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Login Now",
      });
      
      return;
    }
  
    try {
      const order = await api.post(
        "/payment/create-payment",
        {
          amount: price,
          currency: "INR",
          user_id: user1?.id,
          puja: "Astrology",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const options = {
        key: "rzp_live_wqQsW2lGC8RXmJ",
        amount: order.data.data.amount,
        currency: "INR",
        name: user1?.name,
        description: "Astrology",
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
  
            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              text: verifyResponse.data.message,
              confirmButtonColor: "#3399cc",
            }).then(() => {
              navigate("/astrology");
              window.location.reload();
            });
          } catch (error) {
            console.error("Verification failed:", error);
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: "There was an issue verifying your payment.",
            });
          }
        },
        prefill: {
          email: user1?.email,
          contact: user1?.mobile,
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
          html: `
            <strong>${response.error.code}</strong><br/>
            ${response.error.description}
          `,
          confirmButtonColor: "#d33",
        });
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Unable to initiate payment. Please try again later.",
      });
    }
  };

  if (Loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "5vh",
            marginTop: "50px",
          }}
        >
          <TailSpin height="50" width="50" color="orange" />
        </div>
        <p className="loading_text">Loading...</p>
      </>
    );
  }

  return (
    <div className="rechareg_section">
      <div className="container">
        <h1 className="recharge_title">Add Money to Wallet</h1>
        <p className="recharge_balace">Available balance:</p>
        <p className="avail_balace">₹ {user1?.balance}</p>

        <div className="popular_recharge">
          <h1>Popular Recharge</h1>
        </div>

        <div className="row">
          {["25", "50", "100", "200", "500", "1000"].map((price) => (
            <div className="col-sm-2" key={price}>
              <div
                className="rupee_wallet"
                onClick={() => handlePayment(price)}
              >
                <p>₹ {price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recharge;

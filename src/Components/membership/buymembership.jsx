import React, { useState, useEffect } from "react";
import api from "../Axios/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import "../../styles/membershipform.css";

const Buymembership = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  // New state to check membership
  const { user1 } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (user1) {
      setName(user1?.name || "");
      setMobile(user1?.mobile || "");
      setEmail(user1?.email || "");
      setCity(user1?.city || "");
      setCountry(user1?.country || "");
      setAddress(user1?.address || "");

      // Check if the user1 is a member
    }
  }, [user1]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!mobile || !/^\d{10}$/.test(mobile))
      newErrors.mobile = "Valid mobile number is required";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required";
    if (!city) newErrors.city = "City is required";
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    // console.log("m chal rh hu");
    if (!user1) {
      Swal.fire({
        title: "Login Required!",
        text: "Please login to continue.",
        icon: "warning",
        confirmButtonText: "Login",
      });
      return;
    }

    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.put(
        `/users/update/${user1?.id}`,
        {
          name,
          mobile,
          email,
          city,
          country,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        handlePayment(2000);
      } else {
        alert("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating user details");
    }
  };

  const handlePayment = async (price) => {
    if (!user1) {
      Swal.fire({
        title: "Login Required!",
        text: "Please login to continue.",
        icon: "warning",
        confirmButtonText: "Login",
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
          puja: "Membership",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(order.data.data,"jjfksfjfsldjfsljfsljf ")

      const options = {
        key: "rzp_live_wqQsW2lGC8RXmJ",
        amount: order.data.data.amount,
        currency: "INR",
        name: "Prabhu-pooja",
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
            const updatedUser = true;
            // console.log(updatedUser);
            localStorage.setItem("member", updatedUser);
            // console.log(verifyResponse.data);
            alert(  `Payment Status: ${verifyResponse.data.message}`);
            Swal.fire(
              `Payment Status: ${verifyResponse.data.message}`,
              "",
              "success"
            );
            navigate("/membership");
            window.location.reload();
          } catch (error) {
            console.error("Verification failed:", error);
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
        alert(`Error: ${response.error.code} | ${response.error.description}`);
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="addUser_membership">
      <h3>Buy Membership - 2000</h3>
      <form
        className="addUserForm_membership"
        onSubmit={(e) => handleUpdate(e)}
      >
        <div className="inputGroup_membership">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="errorText">{errors.name}</p>}
        </div>

        <div className="inputGroup_membership">
          <label htmlFor="number">Number:</label>
          <input
            type="text"
            id="number"
            autoComplete="off"
            placeholder="Enter your Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {errors.mobile && <p className="errorText">{errors.mobile}</p>}
        </div>

        <div className="inputGroup_membership">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="errorText">{errors.email}</p>}
        </div>

        <div className="inputGroup_membership">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            autoComplete="off"
            placeholder="Enter your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <p className="errorText">{errors.address}</p>}
        </div>

        <div className="inputGroup_membership">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            autoComplete="off"
            placeholder="Enter your City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {errors.city && <p className="errorText">{errors.city}</p>}
        </div>

        <div className="inputGroup_membership">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            autoComplete="off"
            placeholder="Enter your Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {errors.country && <p className="errorText">{errors.country}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-success-membership bookbtn mt-3"
        >
          Buy Now
        </button>
      </form>
    </div>
  );
};

export default Buymembership;

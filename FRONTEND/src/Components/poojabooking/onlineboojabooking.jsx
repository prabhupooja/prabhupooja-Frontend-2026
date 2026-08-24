import React, { useState, useEffect } from "react";
import "../../styles/onlinepoojabooking.css";
import { useNavigate } from "react-router-dom";

import api from "../Axios/api";
import { TailSpin } from "react-loader-spinner";
import { FaRegCalendarTimes } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useOnlinePujaStore from "../../Store/PoojaStore/OnlinePoojaStore";

function OnlinePoojaBooking() {
  // const [bookings, setBookings] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user1 } = useAuthStore();
  const { getUserPujaBookings, bookings, loading } = useOnlinePujaStore();
  const navigate = useNavigate();

  // console.log(bookings, "kllkklklk")

  useEffect(() => {
    if (user1) {
      fetchBookings();
    }
  }, [user1]);

  const fetchBookings = async () => {
    await getUserPujaBookings(user1?.id);
  };

  if (loading) {
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

  if (error) {
    return <div className="container error">{error}</div>;
  }

  if (!bookings.length) {
    return (
      <>
        <div className="error-container">
          <h1 className="page-title">Online Pooja Booking Details</h1>
          <FaRegCalendarTimes className="error-icon" size={40} />
          <div className="container">No booking details available.</div>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <h1 className="booking_heading">Online Pooja Booking Details</h1>
      <div className="card_container">
        {bookings?.map((booking, index) => (
          <div className="card" key={index}>
            <div className="detail-row">
              <span className="label">Pooja Name:</span>
              <span className="value">{booking.puja_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Pooja Price:</span>
              <span className="value">₹{booking.puja_price}</span>
            </div>
            <div className="detail-row">
              <span className="label">Pandit Name:</span>
              <span className="value">{booking.pandit_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Pandit Contact:</span>
              <span className="value">{booking.pandit_mobile}</span>
            </div>
            <div className="detail-row">
              <span className="label">Booking Date:</span>
              <span className="value">
                {new Date(booking.booking_date).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Date:</span>
              <span className="value">
                {new Date(booking.payment_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OnlinePoojaBooking;

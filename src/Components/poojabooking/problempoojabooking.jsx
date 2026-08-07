import React, { useState, useEffect } from "react";
import "../../styles/problembooking.css";
import { TailSpin } from "react-loader-spinner";
import { FaRegCalendarTimes } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useProblemPoojaStore from "../../Store/ProblemPoojaStore/ProblemPoojaStore";
function Problempoojabooking() {
  const [bookings, setBookings] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const { user1 } = useAuthStore();
  const { getBookings, loading } = useProblemPoojaStore();

  useEffect(() => {
    if (user1) {
      problemBookingFetch();
    }
  }, [user1]);

  const problemBookingFetch = async () => {
    const response = await getBookings(user1?.id);
    if (response.data.success) {
      setBookings(response.data.data);
    }
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
          <FaRegCalendarTimes className="error-icon" size={40} />
          <div className="container">No booking details available.</div>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <h1 className="booking_heading">Problem Pooja Booking Details</h1>
      <div className="card_container">
        {bookings.map((booking, index) => (
          <div className="card" key={index}>
            <div className="detail-row">
              <span className="label">Pooja Name:</span>
              <span className="value">{booking.puja_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Pooja Price:</span>
              <span className="value">₹{booking.price}</span>
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

export default Problempoojabooking;

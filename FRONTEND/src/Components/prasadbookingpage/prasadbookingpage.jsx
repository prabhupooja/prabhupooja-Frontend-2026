import React, { useState, useEffect } from "react";
import "../../styles/prasadbooking.css";
import { TailSpin } from "react-loader-spinner";
import { FaRegCalendarTimes } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";

function Prasadbookingpage() {
  const [bookings, setBookings] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const { user1 } = useAuthStore();
  const { userfetchPrasadBooking, isLoading } = useUserStore();

  useEffect(() => {
    if (user1) {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user1]);

  const fetchBookings = async () => {
    const response = await userfetchPrasadBooking(user1?.id);
    if (response.data.success) {
      setBookings(response.data.data);
    }
  };

  if (isLoading) {
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
    return (
      <>
        <div className="error-container">
          <FaRegCalendarTimes className="error-icon" size={40} />
          <div className="prasad-error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <div className="booking-page">
      {bookings?.length > 0 ? (
        <div className="booking-list">
          <h1 className="page-title">Prasad Bookings</h1>
          {bookings?.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-image">
                <img src={booking.prasadImage} alt={booking.prasad_name} />
              </div>
              <div className="booking-details">
                <h2 className="prasad-name">{booking.prasad_name}</h2>
                <p className="amount">₹{booking.amount}</p>
                <p className="sankalpa-name">
                  <strong>Sankalpa Name:</strong> {booking.sankalpa_name}
                </p>
                <p className="sankalpa-gotra">
                  <strong>Sankalpa Gotra:</strong> {booking.sankalpa_gotra}
                </p>
                <p className="order-date">
                  <strong>Booking Date:</strong>{" "}
                  {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="booking_box">
            <FaRegCalendarTimes className="error-icon" size={40} />
            <p className="no_booking_text">No prasad bookings found.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Prasadbookingpage;

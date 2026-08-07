import React, { useState, useEffect } from "react";
import "../../styles/templebooking.css";
import { TailSpin } from "react-loader-spinner";
import { FaRegCalendarTimes } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";

function Templebookingpage() {
  const [bookings, setBookings] = useState([]);
  const [error] = useState(null);
  const { user1 } = useAuthStore();
  const { userfetchTempleBookings, isLoading } = useUserStore();

  useEffect(() => {
    if (user1) {
      fetchTempleBooking();
    }
  }, [user1]);

  const fetchTempleBooking = async () => {
    const res = await userfetchTempleBookings(user1?.id);
    if (res.data.success) {
      setBookings(res.data.data);
    }
  };

  // console.log(bookings);

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
          <h1 className="page-title">Your Temple Bookings</h1>
          {bookings?.map((booking, index) => (
            <div className="booking-card" key={index}>
              <div className="booking-image">
                <img src={booking.templeImage} alt={booking.productName} />
              </div>
              <div className="booking-details">
                <h2 className="temple-name">{booking.templeName}</h2>
                <p className="price">₹{booking.templePrice}</p>
                <p className="address">
                  <strong>Address:</strong> {booking.templeAddress}
                </p>
                <p className="order-date">
                  <strong>Booking Date:</strong>{" "}
                  {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
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
            <p className="no_booking_text">No bookings found.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Templebookingpage;

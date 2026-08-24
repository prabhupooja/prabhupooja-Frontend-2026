import React, { useState, useEffect } from "react";
import "../../styles/yogabooking.css";
import useUserStore from "../../Store/UserStore/userStore";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { FaRegCalendarTimes } from "react-icons/fa";

function Yogabookingpage() {
  const [yoga, setYoga] = useState([]);
  const { userfetchYogaBooking } = useUserStore();
  const { user1 } = useAuthStore();
  // const user = JSON.parse(localStorage.getItem('users'));

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await api.get(`/yoga/getuser/${user.id}`);
  //       console.log(response.data.data);

  //       // Update state based on the response structure
  //       if (Array.isArray(response.data.data)) {
  //         setYoga(response.data.data);
  //       } else {
  //         setYoga([response.data.data]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user details:', error.message);
  //     }
  //   };

  //   fetchUser();
  // }, [user.id]);

  useEffect(() => {
    if (user1) {
      fetchBookedYoga();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user1]);

  const fetchBookedYoga = async () => {
    const response = await userfetchYogaBooking(user1?.id);

    if (response.data.success) {
      setYoga(response.data.data);
    }
  };

  return (
    <div className="booking-page">
      {yoga.length > 0 ? (
        <div className="booking-list">
          <h1 className="page-title">Your Yoga Bookings</h1>
          {yoga.map((booking, index) => (
            <div className="booking-card" key={index}>
              <div className="booking-details">
                <h2 className="yoga-name">{booking.name}</h2>
                <p className="price">₹{booking.amount}</p>
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
            <p className="no_booking_text">No yoga bookings found.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Yogabookingpage;

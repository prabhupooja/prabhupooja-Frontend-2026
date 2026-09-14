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
          <h1 className="page-title">🕉️ My Prasad Bookings</h1>
          {bookings?.map((booking) => {
            const rawImg = booking.prasadImage || booking.image;
            const imgSrc = rawImg
              ? (rawImg.startsWith("http") ? rawImg : `${process.env.REACT_APP_BACKEND_URL || ""}/uploads/${rawImg}`)
              : "/static/media/prasadimg.webp";

            return (
              <div className="booking-card" key={booking.id} style={{ display: "flex", gap: "20px", padding: "20px", borderRadius: "16px", background: "#fff", border: "1px solid #fed7aa", marginBottom: "18px", boxShadow: "0 4px 14px rgba(234, 88, 12, 0.06)" }}>
                <div className="booking-image" style={{ width: "120px", height: "120px", borderRadius: "14px", overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={imgSrc}
                    alt={booking.prasad_name || "Prasad"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/static/media/prasadimg.webp";
                    }}
                  />
                </div>
                <div className="booking-details" style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <h2 className="prasad-name" style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                      {booking.prasad_name || "Temple Divine Prasad"}
                    </h2>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        background:
                          booking.status === "Delivered"
                            ? "#dcfce7"
                            : booking.status === "Dispatched"
                            ? "#dbeafe"
                            : "#fff7ed",
                        color:
                          booking.status === "Delivered"
                            ? "#15803d"
                            : booking.status === "Dispatched"
                            ? "#1d4ed8"
                            : "#ea580c",
                        border: "1px solid currentColor",
                      }}
                    >
                      {booking.status || "Booked"}
                    </span>
                  </div>

                  <p className="amount" style={{ fontSize: "16px", fontWeight: "700", color: "#ea580c", margin: "6px 0" }}>
                    ₹{booking.amount} &nbsp;
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                      ({booking.quantity || 1} Box • {booking.prasadweight || booking.weight || "250g"})
                    </span>
                  </p>

                  <div style={{ background: "#fffdfa", border: "1px dashed #fed7aa", padding: "8px 12px", borderRadius: "8px", margin: "8px 0", fontSize: "13px" }}>
                    <span style={{ color: "#475569" }}>
                      🙏 <strong>संकल्प:</strong> {booking.sankalpa_name || "N/A"} &nbsp;|&nbsp; <strong>गोत्र:</strong> {booking.sankalpa_gotra || "कश्यप"}
                    </span>
                  </div>

                  <p className="order-date" style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
                    <strong>Booking Date:</strong>{" "}
                    {booking.booking_date
                      ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </p>
                </div>
              </div>
            );
          })}
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

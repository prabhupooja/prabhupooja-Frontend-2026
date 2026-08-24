import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/booking.css";
import { TailSpin } from "react-loader-spinner";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import useUserStore from "../../Store/UserStore/userStore";
import { FaRegCalendarTimes } from "react-icons/fa";

function EcommerceBookingPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const { user1 } = useAuthStore();
  const navigate = useNavigate();

  const { userFetchProduct, isLoading } = useUserStore();

  useEffect(() => {
    if (user1?.id) {
      fetchOrders();
    }
  }, [user1]);

  const fetchOrders = async () => {
    try {
      const res = await userFetchProduct(user1?.id);
      if (res?.success) {
        setOrders(
          Array.isArray(res.data.orders)
            ? res.data.orders
            : Object.values(res.data.orders || {})
        );
        setCount(res.data.orderCount || 0);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching orders.");
    }
  };

  // console.log(orders, "orders");

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
      <div className="error-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  const handleNavigate = (orderId, booking) => {
    navigate(
      `/bookingdetailspage/${orderId}?quantity=${booking.quantity}&orderDate=${booking.orderDate}`
    );
  };

  return (
    <div className="order-page">
      <h1 className="page-title">Your Orders</h1>
      <div className="decorative-line"></div>
      {count > 0 ? (
        <div className="order-list">
          {orders?.map((order, index) => (
            <div
              className="order-card"
              key={index}
              onClick={() => handleNavigate(order.orderId, order)}
            >
              <div className="order-header">
                <h3 className="order-id">Order ID: {order.orderId}</h3>
                <p className="order-date">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <p className="order-price">
                Total Price: <span>&#8377;{order.totalPrice}</span>
              </p>

              <div className="images-container">
                {order.images?.map((image, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="image-wrapper"
                    onClick={() => handleNavigate(order.orderId, order)}
                  >
                    <img
                      src={image}
                      alt={`Order ${order.orderId}`}
                      className="order-image"
                    />
                    <div className="quantity-badge">
                      {order.quantity[imgIndex]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-status">
                Status:{" "}
                <span
                  style={{
                    color:
                      order.order_status === "pending"
                        ? "#d17a1d"
                        : order.order_status === "complete"
                        ? "green"
                        : order.order_status === "cancel"
                        ? "red"
                        : "black",
                  }}
                >
                  {order.order_status.toUpperCase().charAt(0) +
                    order.order_status.toLowerCase().slice(1)}
                </span>

              </div>

               <div className="order-status">
                Track Order:{" "}
                <span
                 onClick={(e) => e.stopPropagation()}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                   
                  }}
                >
                  <Link to={`/track-order/${order.orderId}`} className="track-link">
                    Track Now
                  </Link>
                </span>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="booking_box">
            <FaRegCalendarTimes className="error-icon" size={40} />
            <p className="no_booking_text">No orders found.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default EcommerceBookingPage;

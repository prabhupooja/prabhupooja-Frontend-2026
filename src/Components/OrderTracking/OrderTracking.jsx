import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OrderTracking.css";
import { FaCheckCircle } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { useState } from "react";
import useUserStore from "../../Store/UserStore/userStore";
import { TailSpin } from "react-loader-spinner";

const OrderTracking = () => {
  const { getOrderTracking } = useUserStore();
  const { user1 } = useAuthStore();
  const { cancelReason, userOrdersFetchByOrderId } = useUserStore();
  const [mapUrl, setMapUrl] = useState("");
  const { orderId } = useParams();
  // console.log(cancelReason);
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderTracking = async () => {
      try {
        if (user1 && orderId) {
          const res = await getOrderTracking(orderId);

          // console.log("order tracking data", res);

          if (res?.success) {
            setTrackingData(res?.order);
            userOrdersFetchByOrderId(orderId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch tracking data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderTracking();
  }, [user1, orderId, getOrderTracking]);

  const getMapUrl = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];

      const lonLeft = parseFloat(lon) - 0.01;
      const lonRight = parseFloat(lon) + 0.01;
      const latBottom = parseFloat(lat) - 0.01;
      const latTop = parseFloat(lat) + 0.01;

      return `https://www.openstreetmap.org/export/embed.html?bbox=${lonLeft},${latBottom},${lonRight},${latTop}&layer=mapnik&marker=${lat},${lon}`;
    }

    return null;
  };

  useEffect(() => {
    if (user1?.city && user1?.address) {
      const cityParts = user1?.city.split(" ");
      const userShipingAddress = user1?.address + " " + cityParts[0];
      getMapUrl(userShipingAddress).then((mapUrl) => {
        setMapUrl(mapUrl);
      });
    }
  }, [user1]);

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

  if (!trackingData) {
    return <p>Loading order details...</p>;
  }

  const statusLabels = {
    order_placed: "Order Placed",
    dispatched: "Dispatched",
    shipping: "Shipping",
    delivered: "Delivered",
    error: "Error",
  };

  // const orderDownloadFile = trackingData?.orderDownloadFile;

  return (
    <div className="order-tracking-container">
      <h2 className="title">ORDER TRACKING</h2>

      {/* Order Summary */}
      <div className="order-tracking-summary">
        <div className="summary-tracking-item">
          <span>ORDER PLACED</span>
          <strong>
            {trackingData?.orderDate
              ? new Date(trackingData.orderDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </strong>
        </div>
        <div className="summary-tracking-item">
          <span>TOTAL</span>
          <strong>Rs. {trackingData?.totalPrice}</strong>
        </div>
        <div className="summary-tracking-item">
          <span>SHIP TO</span>
          <strong>{trackingData.shippingAddress?.name}</strong>
        </div>
        <div className="summary-tracking-item">
          <span>ORDER</span>
          <strong>#{trackingData?.orderId + 1000}</strong>
        </div>
        <div className="summary-tracking-item">
          <span>Payment Status</span>
          <strong>{trackingData?.orderStatus}</strong>
        </div>
      </div>

      {/* Order Status */}
      <div className="order-tracking-status">
        <h3>
          Order Status:{" "}
          <span
            style={{
              color:
                trackingData?.order_progress_status === "error"
                  ? "red"
                  : "green",
            }}
            className="status"
          >
            {trackingData?.order_progress_status === "error"
              ? "Order Cancel"
              : statusLabels[trackingData?.order_progress_status]}
          </span>
        </h3>
        {trackingData?.order_progress_status === "error" ? (
          <span className="Order_cancel">
            Order Cancel:{" "}
            <p style={{ color: "#6a0505", fontWeight: "bold" }}>
              {cancelReason}
            </p>
          </span>
        ) : (
          <p>
            Estimated Delivery:{" "}
            <strong>
              {trackingData?.estimated_delivery_start
                ? new Date(
                    trackingData.estimated_delivery_start
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
              {" - "}
              {trackingData?.estimated_delivery_end
                ? new Date(
                    trackingData.estimated_delivery_end
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </strong>
          </p>
        )}

        <div className="progress-tracking-bar">
          {trackingData?.trackingStatus?.map((step, index) => (
            <div key={index} className={`tracking-step ${step.status}`}>
              {step.status === "completed" && (
                <FaCheckCircle className="icon success" />
              )}
              {step.status === "processing" && (
                <FaCheckCircle className="icon in-progress" />
              )}
              {step.status === "error" && (
                <FaExclamationTriangle className="icon error" />
              )}

              <span>{step.name}</span>
              <small>
                {step.status === "processing" ? (
                  <span className="processing-status">
                    <span className="dot"></span>
                    Processing
                  </span>
                ) : (
                  step.date
                )}
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="shipping-info">
        <h3>SHIPPING DETAILS</h3>
        {/* <p><strong>Name:</strong> {user1?.name}</p> */}
        {trackingData.shippingAddress && (
          <div>
            <p>
              <strong>Name:</strong> {trackingData.shippingAddress?.name}{" "}
              {trackingData.shippingAddress?.lastname}
            </p>
            <p>
              <strong>Email:</strong> {trackingData.shippingAddress?.email}
            </p>
            <p>
              <strong>Number:</strong> {trackingData.shippingAddress?.number}
            </p>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {trackingData.shippingAddress?.address}
            </p>
            <p>
              <strong>City:</strong> {trackingData.shippingAddress?.city}
            </p>
            <p>
              <strong>Pincode:</strong>{" "}
              {trackingData.shippingAddress?.postalCode}
            </p>
            <p>
              <strong>State:</strong> {trackingData.shippingAddress?.state}
            </p>
            <p>
              <strong>Country:</strong> {trackingData?.shippingAddress?.country}
            </p>
          </div>
        )}
        {/* <p><strong>Address:</strong> {user1?.address}{" "}{user1?.city}</p> */}
      </div>

      {/* Google Map */}
      <div className="map-container">
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        ></iframe>
      </div>
    </div>
  );
};

export default OrderTracking;

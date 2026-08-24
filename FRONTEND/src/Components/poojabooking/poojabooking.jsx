import React from "react";
import "../../styles/poojabooking.css";
import { Link } from "react-router-dom";

function Poojabooking() {
  return (
    <div className="pooja-booking-container">
      <h1 className="pooja-booking-heading">Pooja Booking</h1>
      <div className="poojabooking">
        <Link to="/onlineboojabooking">
          <div className="booking-option">Online Pooja Booking</div>
        </Link>
        <Link to="/problempoojabooking">
          <div className="booking-option">Problem Pooja Booking</div>
        </Link>
      </div>
    </div>
  );
}

export default Poojabooking;

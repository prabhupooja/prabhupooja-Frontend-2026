import React from "react";
import { Link } from "react-router-dom";
import "../styles/button.css";

const Button = () => {
  return (
    <Link to="/signup">
      <button className="btn">Log In</button>
    </Link>
  );
};

export default Button;

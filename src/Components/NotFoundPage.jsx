import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.text}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go Back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f4f4f4",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: "100px",
    color: "rgb(240, 104, 13)",
  },
  text: {
    fontSize: "20px",
    color: "#333",
  },
  link: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "rgb(244, 87, 34)",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
  },
};

export default NotFound;
